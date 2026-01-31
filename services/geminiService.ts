import { ExtractionResult } from "../types";

export const extractTravelInfo = async (
  quoteText: string
): Promise<ExtractionResult> => {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quoteText }),
  });

  if (!response.ok) {
    throw new Error("Error al comunicarse con el servidor");
  }

  const data = await response.json();

  return {
    segments: data.segments ?? [],
    summary: data.summary ?? "",
  };
};
