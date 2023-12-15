import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type Todo = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
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
    }),
  }),
});

export const { useGetTodosQuery } = todoApi;
