import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { ExtractionResult } from "../types";

export const extractTravelInfo = async (quoteText: string): Promise<ExtractionResult> => {
  // En Vite se usa import.meta.env en lugar de process.env
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  
  // Usamos gemini-1.5-flash (la versión estable y rápida)
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          segments: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                airline: { type: SchemaType.STRING },
                iataCode: { type: SchemaType.STRING },
                flightNumber: { type: SchemaType.STRING },
                departureDate: { type: SchemaType.STRING },
                departureTime: { type: SchemaType.STRING },
                arrivalDate: { type: SchemaType.STRING },
                arrivalTime: { type: SchemaType.STRING },
                origin: { type: SchemaType.STRING },
                originCode: { type: SchemaType.STRING },
                destination: { type: SchemaType.STRING },
                destinationCode: { type: SchemaType.STRING },
                type: { type: SchemaType.STRING }
              },
              required: ["airline", "iataCode", "flightNumber", "departureDate", "departureTime", "arrivalDate", "arrivalTime", "origin", "originCode", "destination", "destinationCode", "type"]
            }
          },
          summary: { type: SchemaType.STRING }
        },
        required: ["segments", "summary"]
      },
    },
  });

  const prompt = `Analiza detalladamente este itinerario de vuelo y extrae la información estructurada.
    
    REGLAS DE ORO PARA EL FORMATO:
    1. FECHAS: Usa estrictamente el formato "[día] de [nombre del mes en minúsculas]".
    2. HORAS: Convierte siempre "p. m." a "PM" y "a. m." a "AM".
    3. LLEGADAS +1: Si llega al día siguiente, arrivalTime debe incluir el sufijo " +1".
    4. AEROLÍNEAS: Identifica la aerolínea principal y su código IATA de 2 letras.
    5. RUTAS: Extrae ÚNICAMENTE el nombre de la Ciudad, NO incluyas el país.
    6. SEGMENTOS: Cada tramo de vuelo debe ser un objeto independiente.
    7. TIPO DE VUELO: Clasifica como "ida" o "retorno".

    TEXTO A ANALIZAR:
    """
    ${quoteText}
    """`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text()) as ExtractionResult;
  } catch (error) {
    console.error("Error en Gemini:", error);
    throw new Error("No se pudo procesar el itinerario.");
  }
};
