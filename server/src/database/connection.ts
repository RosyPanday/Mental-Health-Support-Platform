import { Sequelize } from "sequelize";
import { connectionString } from "../config/index.js";

class Database {
  public sequelize: Sequelize;
  //singleton instance to maintain only one connection to db
  private static instance: Database;

  private constructor() {
    this.sequelize = new Sequelize(connectionString);
  }

  static get(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    await this.sequelize.authenticate();
    console.info("Database connection established succesfully");
  }

  async disconnect(): Promise<void> {
    await this.sequelize.close();
    console.info("Database disconnected succesfully");
  }
}

const database = Database.get();
export { database as Database };
