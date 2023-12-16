import { Plus, PlusCircleIcon } from 'lucide-react';
import { useGetTodosQuery } from './app/services';
import TodoCard from './components/TodoCard';

function App() {
  const { data, error, isLoading } = useGetTodosQuery();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center px-4 py-6">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center px-4 py-6">
        <div>There has been an error {JSON.stringify(error)}</div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 py-12 space-y-2">
      <h1 className="text-5xl text-center text-gray-300 font-bold mb-6">todos</h1>
      <button
        type="button"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      >
        <Plus size={14} className="mr-2 h-4 w-4" />
        Add a new todo
      </button>
      <div className="rounded-lg border space-y-2 p-4 flex flex-col justify-center">
        {data?.map((todo) => (
          <div key={todo.id}>
            <TodoCard todo={todo} />
          </div>
        ))}
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground space-x-1">
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium">
            Active
          </button>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium shadow-sm">
            Completed
          </button>
        </div>
        {/* <p>Seems quiet in here. How about adding a to-do?</p> */}
        {/* <p>Get back to work!</p>
      <p>No active tasks right now, but look at those completed to-dos!</p> */}
      </div>
    </div>
  );
}

export default App;
