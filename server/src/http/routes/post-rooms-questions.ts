import { and, eq, sql } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { schema } from "../../../infra/database/schema/index.ts";
import { database } from "../../../infra/database.ts";
import { generateAnswer, generateEmbeddings } from "../../services/gemini.ts";

export const postRoomsQuestionsRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms/:roomId/questions",
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(7),
        }),
      },
    },
    async (req, replay) => {
      const { roomId } = req.params;
      const { question } = req.body;

      //Busca resposta com A.I
      const grauSingularidade = 0.7; //1 => quanto mais proximo a probabilidade ser texto
      const embeddings = await generateEmbeddings(question);

      const embeddingsAsString = `[${embeddings.join(",")}]`;

      const chunks = await database
        .select({
          id: schema.audioChunks.id,
          transcription: schema.audioChunks.transcription,
          similarity: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`,
        })
        .from(schema.audioChunks)
        .where(
          and(
            eq(schema.audioChunks.roomId, roomId),
            sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > ${grauSingularidade}`
          )
        )
        .orderBy(
          sql`${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector`
        )
        .limit(3);

      let answer: string | null = null;

      if (chunks.length > 0) {
        const transcriptions = chunks.map((chunk) => chunk.transcription);

        answer = await generateAnswer(question, transcriptions);
      }
      //END resposta A.I

      const insertedRoomQuestions = await database
        .insert(schema.questions)
        .values({
          question,
          answer,
          roomId,
        })
        .returning();

      const result = insertedRoomQuestions[0];

      if (!result) {
        throw new Error("Failed to create new questions.");
      }

      return replay.status(201).send({ questionId: result.id, answer });
    }
  );
};
