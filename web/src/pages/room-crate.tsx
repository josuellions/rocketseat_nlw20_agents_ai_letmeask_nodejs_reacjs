import { RoomCreateForm } from '@/components/room-create-form';
import { RoomList } from '@/components/room-list';

export function RoomCreate() {
  return (
    <div className="min-h-screen flex-col px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-2 items-start gap-8">
          <h1 className="flex w-full items-center justify-center">Salas</h1>
          <div />
          <RoomCreateForm />
          <RoomList />
        </div>
      </div>
    </div>
  );
}
