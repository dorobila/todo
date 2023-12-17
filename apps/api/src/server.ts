import express from 'express';
import cors from 'cors';
import sequelize from './db';
import * as todoController from './controllers/todoController';

const app = express();
sequelize.sync();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001' }));

app.get('/todos', todoController.getTodos);
app.get('/todos/:id', todoController.getTodo);
app.post('/todos', todoController.createTodo);
app.put('/todos/:id', todoController.updateTodo);
app.delete('/todos/:id', todoController.deleteTodo);

export default app;
