import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:', { logging: false });

sequelize
  .authenticate()
  .then(() => console.log('Sqlite connection is up.'))
  .catch((error) => console.error('Unable to connect to the database: ', error));

export default sequelize;
