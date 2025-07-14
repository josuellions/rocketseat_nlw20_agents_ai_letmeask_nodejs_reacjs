/** biome-ignore-all lint/suspicious/noConsole: <explanation> tratativa de erro*/
import { GoogleGenAI } from "@google/genai";
import { env } from "../types/env.ts";

const gemini = new GoogleGenAI({
  apiKey: env.GOOGLE_GEMINI_API_KEY,
});

const model = "gemini-2.5-flash";

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
  try {
    const response = await gemini.models.generateContent({
      model,
      contents: [
        {
          text: "Transcreva o áudio para português Brasil. Seja preciso e natural na transcrição. Mantenha a pontuação adequada e dívida o texto em parágrafos quando for apropriado.",
        },
        {
          inlineData: {
            mimeType,
            data: audioAsBase64,
          },
        },
      ],
    });

    if (!response.text) {
      throw new Error("Falha: não foi possível transcrever o áudio.");
    }

    return response.text;
  } catch (erro) {
    console.log(erro);
  }
}

export async function generateEmbeddings(text: string) {
  const response = await gemini.models.embedContent({
    model: "text-embedding-004",
    contents: [{ text }],
    config: {
      taskType: "RETRIEVAL_DOCUMENT",
    },
  });

  if (!response.embeddings?.[0].values) {
    throw new Error("Falha:  Não foi possível gerar os embeddings.");
  }

  return response.embeddings[0].values;
}

export async function generateAnswer(
  question: string,
  transcriptions: string[]
) {
  const context = transcriptions.join("\n\n");

  const prompt = `
    Com base no texto fornecido abaixo como contexto, responda a pergunta de forma clara e precisa, em português do Brasil.

    CONTEXTO:
    ${context}

    PERGUNTA:
    ${question}

    INSTRUÇÕES:
    - Use apenas informações contidas no contexto enviado;
    - Se a resposta não for encontrada no contexto, apenas responda que não possui informações suficiente para responder;
    - Seja objetivo;
    - Mantenha um tom educativo e profissional;
    - Cite trechos relevantes do contexto se apropriado;
    - Se for citar o contexto, utilize o termo "conteúdo do áudio";
  `.trim();

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt,
      },
    ],
  });

  if (!response.text) {
    throw new Error("Falha: Error ao gerar resposta pelo Gemini.");
  }

  return response.text;
}
