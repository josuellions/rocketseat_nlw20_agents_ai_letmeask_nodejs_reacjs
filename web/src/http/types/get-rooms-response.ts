interface Props {
  result: {
    id: string;
    name: string;
    createdAt: string;
    questionsCount: number;
  }[];
}

export type GetRoomsAPIResponse = Props;
