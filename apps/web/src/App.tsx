import * as TabsPrimitive from '@radix-ui/react-tabs';
import { useGetTodosQuery } from './app/services';
import { useState } from 'react';
import TodoCard from './components/TodoCard';
import NewTodoDialog from './components/NewTodoDialog';

function App() {
  const [activeTab, setActiveTab] = useState('active');
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

  const activeTodos = data?.filter((todo) => todo.status === 'pending') || [];
  const completedTodos = data?.filter((todo) => todo.status === 'completed') || [];
  const totalTodos = activeTodos.length + completedTodos.length;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-2 px-4 py-12">
      <h1 className="mb-6 text-center text-5xl font-bold text-gray-300">todos</h1>
      <NewTodoDialog />
      <div className="flex flex-col space-y-2">
        {totalTodos === 0 ? (
          <div className="text-center text-gray-400">
            Seems quiet in here. How about adding a to-do?
          </div>
        ) : (
          <TabsPrimitive.Root value={activeTab} className="min-w-[335px] space-y-2">
            <TabsPrimitive.List className="flex flex-col space-y-2 overflow-hidden rounded-lg p-4">
              <div className="text-muted-foreground inline-flex h-10 items-center justify-center space-x-2 rounded-md p-1">
                <TabsPrimitive.Trigger
                  value="active"
                  onClick={() => setActiveTab('active')}
                  className="ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 data-[state=active]:border data-[state=active]:shadow-sm"
                >
                  Active
                </TabsPrimitive.Trigger>
                <TabsPrimitive.Trigger
                  value="completed"
                  onClick={() => setActiveTab('completed')}
                  className="ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 data-[state=active]:border data-[state=active]:shadow-sm"
                >
                  Completed
                </TabsPrimitive.Trigger>
              </div>
              <div className="flex flex-col space-y-2 rounded-lg border p-4">
                <TabsPrimitive.Content
                  value="active"
                  className="ring-offset-background focus-visible:ring-ring max-h-[600px] space-y-2 overflow-y-scroll rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  {activeTodos.length === 0 ? (
                    <div>No active tasks right now, but look at those completed to-dos!</div>
                  ) : (
                    <>
                      {activeTodos?.map((todo) => (
                        <div key={todo.id}>
                          <TodoCard todo={todo} />
                        </div>
                      ))}
                    </>
                  )}
                </TabsPrimitive.Content>
                <TabsPrimitive.Content value="completed" className="space-y-2">
                  {completedTodos.length === 0 ? (
                    <div>Get back to work!</div>
                  ) : (
                    <>
                      {completedTodos?.map((todo) => (
                        <div key={todo.id}>
                          <TodoCard todo={todo} />
                        </div>
                      ))}
                    </>
                  )}
                </TabsPrimitive.Content>
              </div>
            </TabsPrimitive.List>
          </TabsPrimitive.Root>
        )}

        {/* <div className="flex max-h-[600px] flex-col space-y-2 overflow-scroll rounded-lg border p-4">
          {data?.map((todo) => (
            <div key={todo.id}>
              <TodoCard todo={todo} />
            </div>
          ))}
        </div>
        <div className="text-muted-foreground inline-flex h-10 items-center justify-center space-x-1 rounded-md p-1">
          <button
            type="button"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium"
          >
            Active
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium shadow-sm"
          >
            Completed
          </button>
        </div> */}
        {/* <p>Seems quiet in here. How about adding a to-do?</p> */}
        {/* <p>Get back to work!</p>
      <p>No active tasks right now, but look at those completed to-dos!</p> */}
      </div>
    </div>
  );
}

export default App;
