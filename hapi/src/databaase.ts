import * as mysql from "mysql2/promise";

async function connectToDatabase() {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "ravel_store",
    port: 3306,
  });
  return db;
}

export default connectToDatabase;
