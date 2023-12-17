import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';

const port = process.env.PORT || 5001;

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001' }));

type Todo = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  ordinal: number;
  status: 'pending' | 'completed';
};

let todos: Todo[] = [];

app.get('/todos', (req: Request, res: Response): Response => {
  return res.json(todos);
});

app.get('/todos/:id', (req: Request, res: Response): Response => {
  const id = parseInt(req.params.id, 10);
  const todo = todos[id];

  return res.json(todo);
});

app.post('/todos', (req: Request, res: Response): Response => {
  const todo = req.body as Todo;
  todo.id = todos.length;
  todos.push(todo);

  return res.json(todo);
});

app.put('/todos/:id', (req: Request, res: Response): Response => {
  const id = parseInt(req.params.id, 10);
  const todo = req.body as Todo;
  todos[id] = { ...todos[id], ...todo };

  return res.json(todos[id]);
});

app.delete('/todos/:id', (req: Request, res: Response): Response => {
  const id = parseInt(req.params.id, 10);
  const updatedTodos = todos.filter((todo) => todo.id !== id);
  todos = updatedTodos;

  return res.json({ id });
});

const start = () => {
  try {
    app.listen(port, () => {
      console.log(`api started on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
