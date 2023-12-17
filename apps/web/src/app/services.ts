import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type Todo = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  ordinal: number;
  status: 'completed' | 'pending';
};

type TodosResponse = Todo[];

// Todo: fix caching. Currently, it invalidates the entire list if it's not the 1st item

export const todoApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5001/' }),
  tagTypes: ['Todo'],
  endpoints: (build) => ({
    getTodos: build.query<TodosResponse, void>({
      query: () => 'todos',
      providesTags: (result) => {
        return result
          ? [
              ...result.map(({ id }) => ({ type: 'Todo' as const, id })),
              { type: 'Todo', id: 'LIST' },
            ]
          : [{ type: 'Todo', id: 'LIST' }];
      },
    }),
    getTodo: build.query<Todo, number>({
      query: (id) => `todos/${id}`,
      providesTags: (result, error, id) => [{ type: 'Todo', id }],
    }),
    addTodo: build.mutation<Todo, Partial<Todo>>({
      query: (body) => ({
        url: `todos`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),
    editTodo: build.mutation<
      void,
      Pick<Todo, 'id'> & Pick<Todo, 'title' | 'description' | 'dueDate'>
    >({
      query: ({ id, ...patch }) => ({
        url: `todos/${id}`,
        method: 'PUT',
        body: patch,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todoApi.util.updateQueryData('getTodos', undefined, (draft) => {
            const todo = draft.find((todo) => todo.id === id);
            if (todo) {
              Object.assign(todo, { ...patch });
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => {
        return [{ type: 'Todo', id }];
      },
    }),
    completeTodo: build.mutation<void, Pick<Todo, 'id'> & Pick<Todo, 'status'>>({
      query: ({ id, ...patch }) => ({
        url: `todos/${id}`,
        method: 'PUT',
        body: patch,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todoApi.util.updateQueryData('getTodos', undefined, (draft) => {
            const todo = draft.find((todo) => todo.id === id);
            if (todo) {
              todo.status = patch.status;
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => {
        return [{ type: 'Todo', id }];
      },
    }),
    deleteTodo: build.mutation<void, number>({
      query: (id) => ({
        url: `todos/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const undoDelete = dispatch(
          todoApi.util.updateQueryData('getTodos', undefined, (draft) => {
            const index = draft.findIndex((todo) => todo.id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          undoDelete.undo();
        }
      },
      invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useEditTodoMutation,
  useDeleteTodoMutation,
  useCompleteTodoMutation,
} = todoApi;
