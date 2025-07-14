/** biome-ignore-all lint/suspicious/noConsole: <explanation> */
import { Mic, MicOff } from 'lucide-react';
import { useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

//Verifica se navegador tem permissão de gravação
const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === 'function' &&
  typeof window.MediaRecorder === 'function';

type RoomRecordAudioProps = {
  roomId: string;
};

export function RoomRecordAudio() {
  const params = useParams<RoomRecordAudioProps>();
  const [isRecording, setIsRecording] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  function stopRecording() {
    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder?.current.stop();
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsRecording(!isRecording);
  }

  async function uploadAudio(audio: Blob) {
    const formData = new FormData();

    formData.append('file', audio, 'audio.webm');

    await fetch(`http://localhost:3333/rooms/${params.roomId}/audio`, {
      method: 'POST',
      body: formData,
    });

    //const result = await response.json();

    //console.log(result);
  }

  function createRecorder(audio: MediaStream) {
    recorder.current = new MediaRecorder(audio, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 64_000,
    });

    recorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        console.log(event.data);
        uploadAudio(event.data);
      }
    };

    recorder.current.onstart = () => {
      console.log('Gravação iniciada');
    };

    recorder.current.onstop = () => {
      console.log('Gravação encerrada/pausada');
    };

    recorder.current.start();
  }

  async function startRecording() {
    if (!isRecordingSupported) {
      alert('Seu navegador não suporta gravação!');
      return;
    }

    await setIsRecording(!isRecording);

    const audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44_100,
      },
    });

    createRecorder(audio);

    intervalRef.current = setInterval(() => {
      recorder.current?.stop();
      createRecorder(audio);
    }, 5000);
  }

  if (!params.roomId) {
    return <Navigate replace to="/" />;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Button
        className={`w-28 cursor-pointer ${isRecording && 'bg-red-600 text-zinc-100 hover:bg-red-700'} `}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? 'Parar' : 'Gravar'} áudio
      </Button>

      {isRecording ? (
        <>
          <p>Gravando...</p>
          <Mic className="size-8 animate-pulse text-red-600" />
        </>
      ) : (
        <>
          <p>Pausado...</p>
          <MicOff className="size-8 animate-in text-zinc-600" />
        </>
      )}
    </div>
  );
}
