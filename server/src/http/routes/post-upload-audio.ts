import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";

import { schema } from "../../../infra/database/schema/index.ts";
import { database } from "../../../infra/database.ts";
import { generateEmbeddings, transcribeAudio } from "../../services/gemini.ts";

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
      const { roomId } = req.params;
      const audio = await req.file();

      if (!audio) {
        throw new Error("Failed, audio is required.");
      }

      //Transcrever o áudio
      //Carregar totalmente o arquivo até o termino do upload
      const audioBuffer = await audio.toBuffer();
      const audioAsBase64 = audioBuffer.toString("base64");

      const transcription = await transcribeAudio(
        audioAsBase64,
        audio.mimetype
      );
      // Gerar o vetor semântico / embeddings
      const embeddings = await generateEmbeddings(transcription);

      // Armazenar os vetores no banco de dados
      const result = await database
        .insert(schema.audioChunks)
        .values({
          roomId,
          transcription,
          embeddings,
        })
        .returning();

      const chunks = result[0];

      if (!chunks) {
        throw new Error("Error: Falha ao salvar chunk de áudio.");
      }

      return replay.status(201).send({ chunksId: chunks.id });
    }
  );
};
