import { Request, Response } from 'express';
import Todo from '../models/todo';

export type Todo = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  ordinal: number;
  status: 'pending' | 'completed';
};

export const getTodos = async (req: Request, res: Response): Promise<Response> => {
  const todos = await Todo.findAll();
  return res.json(todos);
};

export const getTodo = async (req: Request, res: Response): Promise<Response> => {
  const id = parseInt(req.params.id, 10);
  const todo = await Todo.findByPk(id);
  return res.json(todo);
};

export const createTodo = async (req: Request, res: Response): Promise<Response> => {
  const todo = await Todo.create(req.body);
  return res.json(todo);
};

export const updateTodo = async (req: Request, res: Response): Promise<Response> => {
  const id = parseInt(req.params.id, 10);
  const todo = req.body as Todo;
  const updatedTodo = await Todo.update(todo, {
    where: { id },
    returning: true,
  });

  return res.json(updatedTodo[1][0]);
};

export const deleteTodo = async (req: Request, res: Response): Promise<Response> => {
  const id = parseInt(req.params.id, 10);
  await Todo.destroy({
    where: { id },
  });

  return res.json({ id });
};
