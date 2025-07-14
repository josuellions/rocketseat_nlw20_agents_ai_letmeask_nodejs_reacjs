import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";

import { schema } from "../../../infra/database/schema/index.ts";
import { database } from "../../../infra/database.ts";

export const postRoomsRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms",
    {
      schema: {
        body: z.object({
          name: z.string().min(7),
          description: z.string().optional(),
        }),
      },
    },
    async (req, replay) => {
      const { name, description } = req.body;

      const insertedRoom = await database
        .insert(schema.rooms)
        .values({
          name,
          description,
        })
        .returning();

      const result = insertedRoom[0];

      if (!result) {
        throw new Error("Failed to create new room.");
      }

      return replay.status(201).send({ roomId: result.id });
    }
  );
};
