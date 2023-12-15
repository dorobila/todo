import { useGetTodosQuery } from './app/services';

function App() {
  const { data, error, isLoading } = useGetTodosQuery();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center px-4 py-6 w-full">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center px-4 py-6 w-full">
        <div>There has been an error {JSON.stringify(error)}</div>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center px-4 py-6 w-full">
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}

export default App;
