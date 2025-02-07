import bcrypt from "bcrypt";
import mysql from "mysql2/promise";

(async () => {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "ravel_store",
  });

  const plainPassword = "password123";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  console.log("Nowy hash hasła:", hashedPassword);

  await db.execute(
    "INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, NOW())",
    ["Pawel Krupski", "pawel@example.com", hashedPassword]
  );

  console.log("✅ Nowy użytkownik dodany do bazy");
  process.exit();
})();
