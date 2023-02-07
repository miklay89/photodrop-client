import dotenv from "dotenv";
import { drizzle } from "drizzle-orm-pg/node";
import { Pool } from "pg";
import * as schema from "./schema";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT as string),
  database: process.env.DB_DATABASE_NAME as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  ssl: true,
});

const connector = drizzle(pool);

export default {
  Tables: schema,
  Connector: connector,
};
