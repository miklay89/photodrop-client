import dotenv from "dotenv";
import { drizzle } from "drizzle-orm-pg/node";
import { Pool } from "pg";
import * as schema from "./schema";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: true,
});

const connector = drizzle(pool);

export default {
  Tables: schema,
  Connector: connector,
};
