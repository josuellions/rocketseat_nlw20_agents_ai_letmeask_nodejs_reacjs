import { fastifyCors } from "@fastify/cors";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { getRoomsRoute } from "./http/routes/get-rooms.ts";
import { getRoomsQuestionsRoute } from "./http/routes/get-rooms-questions.ts";
import { postRoomsRoute } from "./http/routes/post-rooms.ts";
import { postRoomsQuestionsRoute } from "./http/routes/post-rooms-questions.ts";
import { env } from "./types/env.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: "http://localhost:5173",
  // origin: '*',
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get("/status", (_, res) => {
  return res.status(200).send({ message: "on-line" });
});

app.register(getRoomsRoute);
app.register(postRoomsRoute);
app.register(getRoomsQuestionsRoute);
app.register(postRoomsQuestionsRoute);

app.listen({ port: env.PORT }).then(() => {
  // biome-ignore lint/suspicious/noConsole: only used in dev
  console.log(`>> HTTP server running, port: ${env.PORT}!`);
});
