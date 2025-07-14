import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateQuestionAPIRequest } from "./types/create-question-request";
import type { CreateQuestionAPIResponse } from "./types/create-question-response";
import type { GetRoomsQuestionsAPIResponse } from "./types/get-rooms-questions-response";

export function useRoomsQuestionCreate(roomId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateQuestionAPIRequest) => {
      const response = await fetch(
        `http://localhost:3333/rooms/${roomId}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result: CreateQuestionAPIResponse = await response.json();

      return result;
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["get-rooms-questions", roomId],
    //   });
    // },

    // Executa no momento que for realizado a chamada da API
    onMutate({ question }) {
      const questions = queryClient.getQueryData<GetRoomsQuestionsAPIResponse>([
        "get-rooms-questions",
        roomId,
      ]);

      const questionsArray = questions ?? [];

      const newQuestion = {
        id: crypto.randomUUID(),
        question,
        answer: null,
        createdAt: new Date().toISOString(),
        isGeneratingAnswer: true,
      };

      queryClient.setQueryData<GetRoomsQuestionsAPIResponse>(
        ["get-rooms-questions", roomId],
        [newQuestion, ...questionsArray]
      );

      return { newQuestion, questions };
    },
    onSuccess(data, _variable, context) {
      queryClient.setQueryData<GetRoomsQuestionsAPIResponse>(
        ["get-rooms-questions", roomId],
        (questions) => {
          if (!questions) {
            return questions;
          }

          if (!context?.newQuestion) {
            return questions;
          }
          return questions.map((question) => {
            if (question.id === context.newQuestion.id) {
              return {
                ...context.newQuestion,
                id: data.questionId,
                answer: data.answer,
                isGeneratingAnswer: false,
              };
            }
            return question;
          });
        }
      );
    },
    onError(_error, _variable, context) {
      if (context?.questions) {
        queryClient.setQueryData<GetRoomsQuestionsAPIResponse>(
          ["get-rooms-questions", roomId],
          context?.questions
        );
      }
    },
  });
}
