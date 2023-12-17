import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type Todo = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  ordinal: number;
  status: 'completed' | 'pending';
};

type PostsResponse = Todo[];

export const todoApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5001/' }),
  tagTypes: ['Todo'],
  endpoints: (build) => ({
    getTodos: build.query<PostsResponse, void>({
      query: () => 'todos',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Todo' as const, id })),
              { type: 'Todo', id: 'LIST' },
            ]
          : [{ type: 'Todo', id: 'LIST' }],
    }),
    addTodo: build.mutation<Todo, Partial<Todo>>({
      query: (body) => ({
        url: `todos`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),
  }),
});

export const { useGetTodosQuery, useAddTodoMutation } = todoApi;
