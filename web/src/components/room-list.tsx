import { ArrowRight, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRooms } from '@/http/use-rooms';
import { dayjs } from '@/lib/format-relative-date';

export function RoomList() {
  const { data, isLoading } = useRooms();

  // return (
  //   <div>
  //     <h1>Create Rooms</h1>
  //     <br />
  //     <Link className="underline" to={'/room'}>
  //       Acessar sala
  //     </Link>

  //     <br />

  //     {isLoading && <Loader className="size-10 animate-spin" />}

  //          <div>
  //       {data && (
  //          <pre>{JSON.stringify(data, null, 2)}</pre>

  //       )}
  //        </div>

  //     <div className="flex flex-col gap-1">
  //       {data?.result.map((room) => {
  //         return (
  //           <Link className="underline" key={room.id} to={`/room/${room.id}`}>
  //             {room.name}
  //           </Link>
  //         );
  //       })}
  //     </div>
  //   </div>
  // );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salas recentes</CardTitle>
        <CardDescription>
          Acesso rápido as salas criadas recentemente
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {isLoading && (
          <Loader className="flex size-10 w-full animate-spin items-center justify-center" />
        )}

        {data?.result.map((room) => {
          return (
            <Link
              className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50"
              key={room.id}
              to={`/room/${room.id}`}
            >
              <div className="flex flex-1 flex-col gap-1">
                <h3 className="font-medium">{room.name}</h3>

                <div className="flex items-center gap-2">
                  <Badge className="text-xs" variant="secondary">
                    {dayjs(room.createdAt).toNow()}
                  </Badge>
                  <Badge className="text-xs" variant="secondary">
                    {room.questionsCount} pergunta(s)
                  </Badge>
                </div>
              </div>

              <span className="flex items-center gap-1 text-sm">
                Entrar
                <ArrowRight className="size-3" />
              </span>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
