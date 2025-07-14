import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";

export const postUploadAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms/:roomId/audio",
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (req, replay) => {
      //const { roomId } = req.params;
      const audio = await req.file();

      if (!audio) {
        throw new Error("Failed, audio is required.");
      }

      //Transcrever o áudio
      // Gerar o vetor semântico / embeddings
      // Armazenar os vetores no banco de dados

      return replay.status(201).send();
    }
  );
};
