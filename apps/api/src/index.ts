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
  dueDate: string;
  ordinal: number;
  status: 'pending' | 'completed';
};

const todos: Todo[] = [
  {
    id: 0,
    title: 'Init Todo',
    description: 'This is a todo',
    dueDate: '2023-12-16T00:00:00.000Z',
    ordinal: 0,
    status: 'pending',
  },
];

app.get('/todos', (req: Request, res: Response): Response => {
  return res.json(todos);
});

app.post('/todos', (req: Request, res: Response): Response => {
  const todo = req.body as Todo;
  todo.id = todos.length - 1;
  todos.push(todo);
  return res.json(todo);
});

app.put('/todos/:id', (req: Request, res: Response): Response => {
  const id = parseInt(req.params.id, 10);
  const todo = req.body as Todo;
  todos[id] = todo;
  return res.json(todo);
});

app.delete('/todos/:id', (req: Request, res: Response): Response => {
  const id = parseInt(req.params.id, 10);
  todos.splice(id, 1);
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
