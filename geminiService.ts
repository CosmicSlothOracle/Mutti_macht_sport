
import { GoogleGenAI, Type } from "@google/genai";
import { MatchdayData } from "./types";

const apiKey = process.env.API_KEY;
if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
  console.warn("Warnung: Kein gültiger GEMINI_API_KEY gesetzt. Bitte in .env.local konfigurieren.");
}
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      matchday: { type: Type.NUMBER },
      matches: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            date: { type: Type.STRING },
            homeTeam: { type: Type.STRING },
            awayTeam: { type: Type.STRING },
            homeScore: { type: Type.NUMBER },
            awayScore: { type: Type.NUMBER },
            status: { type: Type.STRING },
            goals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  minute: { type: Type.NUMBER },
                  player: { type: Type.STRING },
                  team: { type: Type.STRING }
                }
              }
            }
          },
          required: ["homeTeam", "awayTeam", "homeScore", "awayScore", "date"]
        }
      }
    },
    required: ["matchday", "matches"]
  }
};

export const fetchBundesligaResults = async (matchdayRange: string = "aktuell"): Promise<MatchdayData[]> => {
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    throw new Error("Kein gültiger GEMINI_API_KEY konfiguriert.");
  }

  const prompt = `Gib mir die Ergebnisse der 1. Fußball-Bundesliga Saison 2024/2025 für den Spieltag-Bereich: ${matchdayRange}. 
  Stelle sicher, dass alle Spiele enthalten sind, inklusive Torschützen, Datum und Endstand. 
  Verwende die aktuellsten verfügbaren Daten aus dem Web.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("Leere Antwort von Gemini erhalten.");
  }

  try {
    const data: MatchdayData[] = JSON.parse(text);
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Keine Spieltag-Daten in der Antwort.");
    }
    // Ensure every match has an id
    data.forEach(md => {
      md.matches.forEach((m, idx) => {
        if (!m.id) {
          m.id = `md${md.matchday}-m${idx}`;
        }
        if (!m.goals) {
          m.goals = [];
        }
        if (!m.status) {
          m.status = 'beendet';
        }
      });
    });
    return data;
  } catch (error) {
    console.error("Fehler beim Parsen der Gemini-Antwort:", error, "\nRaw text:", text?.substring(0, 500));
    throw error;
  }
};
