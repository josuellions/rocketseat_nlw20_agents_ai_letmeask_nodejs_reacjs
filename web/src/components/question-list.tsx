import { Loader } from 'lucide-react';
import { useRoomsQuestions } from '@/http/use-rooms-questions';
import { QuestionItem } from './question-item';

interface QuetionListProps {
  roomId: string;
}

export function QuestionList(params: QuetionListProps) {
  const { data, isLoading } = useRoomsQuestions(params.roomId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl text-foreground">
          Perguntas & Respostas
        </h2>
      </div>

      {isLoading && (
        <Loader className="flex size-10 w-full animate-spin items-center justify-center" />
      )}

      {data?.map((question) => {
        return <QuestionItem key={question.id} question={question} />;
      })}
    </div>
  );
}
