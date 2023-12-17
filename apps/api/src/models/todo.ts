import { DataTypes } from 'sequelize';
import sequelize from '../db';

const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  dueDate: DataTypes.DATE,
  ordinal: DataTypes.INTEGER,
  status: {
    type: DataTypes.ENUM('pending', 'completed'),
    defaultValue: 'pending',
  },
});

export default Todo;
