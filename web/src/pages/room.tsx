import { Navigate, useParams } from 'react-router-dom';

type ParamsProps = {
  id: string;
};

export function Room() {
  const params = useParams<ParamsProps>();

  if (!params.id) {
    return <Navigate replace to="/" />;
  }

  return (
    <div>
      <h1>Rooms</h1>
      <br />
      <p>{params.id}</p>
    </div>
  );
}
