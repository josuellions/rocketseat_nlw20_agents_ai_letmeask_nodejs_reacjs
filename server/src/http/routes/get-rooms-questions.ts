import { eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";

import { schema } from "../../../infra/database/schema/index.ts";
import { database } from "../../../infra/database.ts";

export const getRoomsQuestionsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/rooms/:roomId/questions",
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (req, replay) => {
      const { roomId } = req.params;

      const result = await database
        .select({
          id: schema.questions.id,
          question: schema.questions.question,
          answer: schema.questions.answer,
          createdAt: schema.questions.createdAt,
        })
        .from(schema.questions)
        .where(eq(schema.questions.roomId, roomId))
        .orderBy(schema.questions.createdAt);

      if (!result) {
        throw new Error("Failed to list questions.");
      }

      return replay.status(200).send(result);
    }
  );
};
