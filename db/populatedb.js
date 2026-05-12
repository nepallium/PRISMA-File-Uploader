import { Client } from "pg";
import "dotenv/config";

const createSQLTables = `
  CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    is_member BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE
  );

  CREATE TABLE IF NOT EXISTS messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
`;

async function main() {
  console.log("...seeding");

  const client = new Client({
    connectionString: process.env.DB_CONNECTION,
    ssl: { rejectUnauthorized: true },
  });

  try {
    await client.connect();
    console.log("Connected to database.");

    // start a transaction
    await client.query("BEGIN");

    await client.query(createSQLTables);
    console.log("tables created");

    // console.log("data created successfully");

    // If we got here, save all changes
    await client.query("COMMIT");
  } catch (error) {
    // If anything fails, undo everything
    await client.query("ROLLBACK");
    console.error("Error while populating db: " + error.message);
  } finally {
    await client.end();
    console.log("client ended.");
  }
}

main();
