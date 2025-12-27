
import { GoogleGenAI, Type } from "@google/genai";
import { Dog, DiaryEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getPetInsight(dog: Dog, recentLogs: DiaryEntry[]) {
  const logsSummary = recentLogs.map(l => `${l.type}: ${l.content}`).join('\n');
  const prompt = `
    다음은 반려견 '${dog.name}'(${dog.breed}, ${dog.weight}kg)의 최근 양육 기록입니다.
    기록을 분석하여 가족들이 참고할 만한 따뜻한 격려와 건강 팁을 3줄 이내로 한국어로 작성해주세요.
    
    기록:
    ${logsSummary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "오늘도 보람이와 행복한 하루 되세요! 건강한 산책과 식단이 중요합니다.";
  }
}
