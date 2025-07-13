import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  result: {
    id: string;
    name: string;
  }[];
}

type GetRoomsAPIResponse = Props;

export function RoomCreate() {
  const { data, isLoading } = useQuery({
    queryKey: ['get-rooms'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3333/rooms');

      const result: GetRoomsAPIResponse = await response.json();

      return result;
    },
  });

  return (
    <div>
      <h1>Create Rooms</h1>
      <br />
      <Link className="underline" to={'/room'}>
        Acessar sala
      </Link>

      <br />

      {isLoading && <Loader className="size-10 animate-spin" />}

      {/*
           <div>   
        {data && (
           <pre>{JSON.stringify(data, null, 2)}</pre>
          
        )} 
         /div>
         */}
      <div className="flex flex-col gap-1">
        {data?.result.map((room) => {
          return (
            <Link className="underline" key={room.id} to={`/room/${room.id}`}>
              {room.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
