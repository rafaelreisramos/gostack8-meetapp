import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    console.log(this.connection.options.database);
  }
}

export default new Database();
