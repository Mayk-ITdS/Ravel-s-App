import Hapi from "@hapi/hapi";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";
import inert from "@hapi/inert";
import bcrypt from "bcrypt";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  **Połączenie z bazą MySQL**
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "ravel_store",
});

// **Tworzymy katalog na obrazy**
const uploadDir = path.join(__dirname, "assets");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//  **Tworzymy serwer Hapi**
const server = Hapi.server({
  port: 5000,
  host: "localhost",
  routes: {
    cors: true,
    payload: {
      maxBytes: 10 * 1024 * 1024,
    },
  },
});
server.ext("onRequest", (request, h) => {
  console.log(
    `📥 Otrzymano zapytanie: ${request.method.toUpperCase()} ${request.path}`
  );
  return h.continue;
});

// **Rejestracja Inert do obsługi statycznych plików**
await server.register(inert);

// 🔥 **Serwowanie plików statycznych**
server.route({
  method: "GET",
  path: "/assets/{file*}",
  handler: {
    directory: {
      path: uploadDir,
      listing: true,
    },
  },
});
server.route({
  method: "POST",
  path: "/register",
  options: {
    payload: {
      allow: ["application/json", "application/x-www-form-urlencoded"],
      parse: true,
    },
  },
  handler: async (request, h) => {
    const { username, email, password } = request.payload;

    try {
      console.log("Otrzymane dane rejestracji", { username, email });

      const [existingUser] = await db.execute(
        "SELECT id From users WHERE email = ?",
        [email]
      );
      if (existingUser.length > 0) {
        return h.response({ error: "Email already in use" }).code(400);
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const [result] = await db.execute(
        "INSERT INTO users (username, email, password_hash, created_at) VALUES (?,?,?,NOW())",
        [username, email, hashedPassword]
      );

      return h
        .response({
          message: "User registered successfully",
          user: { id: result.insertId, username, email },
        })
        .code(201);
    } catch (error) {
      console.error("❌ Błąd rejestracji:", error);
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  },
});

server.route({
  method: "POST",
  path: "/login",
  options: {
    payload: {
      allow: ["application/json", "application/x-www-form-urlencoded"],
      parse: true,
    },
  },
  handler: async (request, h) => {
    console.log("📥 Otrzymane dane:", JSON.stringify(request.payload, null, 2));

    if (!request.payload?.email || !request.payload?.password) {
      return h.response({ error: "Email i hasło są wymagane" }).code(400);
    }

    const { email, password } = request.payload;

    try {
      console.log("Otrzymane dane logowania:", { email, password });

      const sql =
        "SELECT id, username, email, password_hash FROM users WHERE email = ?";
      const [rows] = await db.execute(sql, [email]);

      console.log("🟡 Dane pobrane z bazy:", rows);

      if (!rows.length) {
        return h.response({ error: "User not found" }).code(404);
      }

      const user = rows[0];
      console.log("🔑 Hasło użytkownika w bazie:", user.password_hash);
      console.log("🔑 Hasło podane przez użytkownika:", password);

      // 🛑 Poprawione sprawdzanie hasła
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isPasswordCorrect) {
        return h.response({ error: "Invalid password" }).code(401);
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: "2h" } // Token ważny przez 2 godziny
      );
      return h
        .response({
          message: "Login successful",
          user: { id: user.id, username: user.username, email: user.email },
          token,
        })
        .code(200);
    } catch (error) {
      console.error("❌ Login error:", error);
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  },
});

// **Pobieranie wszystkich produktów lub eventów**
server.route({
  method: "GET",
  path: "/{type}",
  handler: async (request, h) => {
    const { type } = request.params;
    if (type !== "products" && type !== "events") {
      return h
        .response({ error: "Invalid type. Use 'products' or 'events'." })
        .code(400);
    }

    try {
      const [rows] = await db.execute(`SELECT * FROM ${type}`);
      console.log("📦 Dane z bazy:", [rows]);
      const formattedData = rows.map((item) => ({
        ...item,
        image: item.image
          ? `data:image/png;base64,${item.image.toString("base64")}`
          : null,
      }));

      return h.response(formattedData);
    } catch (error) {
      console.error("❌ Błąd pobierania danych:", error);
      return h.response({ error: "Błąd pobierania danych" }).code(500);
    }
  },
});

// **Pobieranie pojedynczego produktu lub eventu**
server.route({
  method: "GET",
  path: "/{type}/{id}",
  handler: async (request, h) => {
    const { type, id } = request.params;
    if (type !== "products" && type !== "events") {
      return h
        .response({ error: "Invalid type. Use 'products' or 'events'." })
        .code(400);
    }

    try {
      const [rows] = await db.execute(`SELECT * FROM ${type} WHERE id=?`, [id]);
      if (rows.length === 0) {
        return h.response({ error: "Nie znaleziono" }).code(404);
      }
      return h.response(rows[0]);
    } catch (error) {
      console.error("❌ Błąd pobierania elementu:", error);
      return h.response({ error: "Błąd pobierania elementu" }).code(500);
    }
  },
});

// **Obsługa przesyłania plików i edycji produktów/eventów**
server.route({
  method: ["POST", "PUT"],
  path: "/{type}/{id?}",
  options: {
    payload: {
      output: "stream",
      parse: true,
      allow: "multipart/form-data",
      multipart: true,
    },
  },
  handler: async (request, h) => {
    try {
      const { type, id } = request.params;
      const payload = request.payload;
      let imageUrl = null;
      console.log(request.params);
      if (type !== "products" && type !== "events") {
        return h
          .response({ error: "Invalid type. Use 'products' or 'events'." })
          .code(400);
      }

      // 🖼️ Jeśli plik został przesłany, zapisujemy go w katalogu assets
      let img_array = [];
      if (payload.file) {
        for await (const el of payload.file) {
          img_array.push(el);
        }

        console.log(img_array);
        console.log(Buffer.concat(img_array));
        // const filename = `${Date.now()}-${payload.file.hapi.filename}`;
        // const filePath = path.join(uploadDir, filename);
        // const fileStream = fs.createWriteStream(filePath);
        // await payload.file.pipe(fileStream);

        // imageUrl = `/assets/${filename}`;
      }

      if (id) {
        //  **Aktualizacja produktu / eventu**
        if (type === "products") {
          await db.execute(
            "UPDATE products SET name=?, description=?, price=?, category=?, image=? WHERE id=?",
            [
              payload.name,
              payload.description,
              payload.price,
              payload.category,
              Buffer.concat(img_array),
              id,
            ]
          );
        } else {
          await db.execute(
            "UPDATE events SET title=?, description=?, date=?, location=?, image=? WHERE id=?",
            [
              payload.title,
              payload.description,
              payload.date,
              payload.location,
              Buffer.concat(img_array),
              id,
            ]
          );
        }
        return h.response({
          message: `${type.slice(0, -1)} zaktualizowany`,
          id,
        });
      }

      // **Dodawanie nowego**
      let result;
      if (type === "products") {
        [result] = await db.execute(
          "INSERT INTO products (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)",
          [
            payload.name,
            payload.description,
            payload.price,
            payload.category,
            imageUrl,
          ]
        );
      } else {
        [result] = await db.execute(
          "INSERT INTO events (title, description, date, location, image) VALUES (?, ?, ?, ?, ?)",
          [
            payload.title,
            payload.description,
            payload.date,
            payload.location,
            imageUrl,
          ]
        );
      }

      return h.response({
        message: `${type.slice(0, -1)} dodany`,
        id: result.insertId,
      });
    } catch (error) {
      console.error("❌ Błąd serwera:", error);
      return h.response({ error: "Błąd serwera" }).code(500);
    }
  },
});

//  **Usuwanie produktu lub eventu**
server.route({
  method: "DELETE",
  path: "/{type}/{id}",
  handler: async (request, h) => {
    const { type, id } = request.params;

    if (type !== "products" && type !== "events") {
      return h
        .response({ error: "Invalid type. Use 'products' or 'events'." })
        .code(400);
    }

    try {
      const [rows] = await db.execute(`SELECT * FROM ${type} WHERE id=?`, [id]);
      if (rows.length === 0) {
        return h
          .response({ error: "Nie znaleziono elementu do usunięcia." })
          .code(404);
      }
      await db.execute(`DELETE FROM ${type} WHERE id=?`, [id]);

      return h.response({ message: `${type.slice(0, -1)} usunięty` });
    } catch (error) {
      console.error(" Błąd usuwania:", error);
      return h.response({ error: "Błąd usuwania" }).code(500);
    }
  },
});

//  **Uruchomienie serwera**
const start = async () => {
  await server.start();
  console.log(`🚀 Server running at: ${server.info.uri}`);
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
