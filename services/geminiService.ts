
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractionResult } from "../types";

export const extractTravelInfo = async (quoteText: string): Promise<ExtractionResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analiza detalladamente este itinerario de vuelo y extrae la información estructurada.
              
REGLAS DE ORO PARA EL FORMATO:
1. FECHAS: Usa estrictamente el formato "[día] de [nombre del mes en minúsculas]". Ejemplo: "01 de agosto", "09 de abril", "24 de diciembre".
2. HORAS: Convierte siempre "p. m." a "PM" y "a. m." a "AM". Ejemplo: "10:05 PM", "02:00 AM".
3. LLEGADAS +1: Si el itinerario indica "+1" en la hora de llegada, significa que llega al día siguiente. 
   - arrivalDate: Debe ser la fecha real de llegada calculada.
   - arrivalTime: Debe incluir el sufijo " +1" (ejemplo: "02:00 AM +1").
4. AEROLÍNEAS: Identifica la aerolínea principal y su código IATA de 2 letras.
5. RUTAS: Extrae ÚNICAMENTE el nombre de la Ciudad (o nombre del aeropuerto si es específico), pero NO incluyas el nombre del país.
6. SEGMENTOS: Cada tramo de vuelo debe ser un objeto independiente.
7. TIPO DE VUELO: Clasifica cada segmento como "ida" o "retorno" basándote en la lógica del viaje completo.

TEXTO A ANALIZAR:
"""
${quoteText}
"""`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Error al comunicarse con el servidor");
  }

  const data = await response.json();

  try {
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    return JSON.parse(text) as ExtractionResult;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw new Error(
      "No se pudo procesar el itinerario. Intenta copiar el texto de nuevo."
    );
  }
};
