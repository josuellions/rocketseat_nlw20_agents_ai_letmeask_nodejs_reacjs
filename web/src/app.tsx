import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Room } from './pages/room';
import { RoomCreate } from './pages/room-crate';
import { RoomRecordAudio } from './pages/room-record-audio';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<RoomCreate />} index />
          <Route element={<Room />} path="room/:roomId" />
          <Route element={<RoomRecordAudio />} path="room/:roomId/audio" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
