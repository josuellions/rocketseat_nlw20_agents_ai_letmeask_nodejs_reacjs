import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";

import { schema } from "../../../infra/database/schema/index.ts";
import { database } from "../../../infra/database.ts";

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

      const insertedRoomQuestions = await database
        .insert(schema.questions)
        .values({
          question,
          roomId,
        })
        .returning();

      const result = insertedRoomQuestions[0];

      if (!result) {
        throw new Error("Failed to create new questions.");
      }

      return replay.status(201).send({ questionId: result.id });
    }
  );
};
