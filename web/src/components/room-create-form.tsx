import { zodResolver } from '@hookform/resolvers/zod';
//import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRoomsCreate } from '@/http/use-rooms-create';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const createRoomSchema = z.object({
  name: z.string().min(7, { message: 'Inclua no mínimo 7 caracteres' }),
  description: z.string(),
});

type CreateRoomFormData = z.infer<typeof createRoomSchema>;

export function RoomCreateForm() {
  const { mutateAsync: createRoom } = useRoomsCreate();

  const createRoomForm = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  async function handleCrateRoom({ name, description }: CreateRoomFormData) {
    await createRoom({ name, description });
    await createRoomForm.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Salas</CardTitle>
        <CardDescription>
          Crie uma salas para começar e fazer perguntas, e receber resposta da
          A.I
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {/* {isLoading && (
          <Loader className="flex size-10 w-full animate-spin items-center justify-center" />
        )} */}

        <Form {...createRoomForm}>
          <form
            className="flex flex-col gap-6"
            onSubmit={createRoomForm.handleSubmit(handleCrateRoom)}
          >
            <FormField
              control={createRoomForm.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Nome da sala</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Digite nome da sala..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={createRoomForm.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Descrição sala</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Digite uma descrição para sala"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button className="w-full" type="submit">
              Criar sala
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
