import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { schema } from "../../../infra/database/schema/index.ts";
import { database } from "../../../infra/database.ts";

export const getRoomsRoute: FastifyPluginCallbackZod = (app) => {
  app.get("/rooms", async () => {
    const result = await database
      .select({
        id: schema.rooms.id,
        name: schema.rooms.name,
      })
      .from(schema.rooms)
      .orderBy(schema.rooms.createdAt);

    return { result };
  });
};
