import Hapi from "@hapi/hapi";
import fs from "fs";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";
import inert from "@hapi/inert";
import bcrypt from "bcrypt";
import HapiJWT from "@hapi/jwt";
import jsonwebtoken from "jsonwebtoken";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "ravel_store",
});

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

await server.register(inert);
await server.register(HapiJWT);

server.auth.strategy("jwt", "jwt", {
  keys: Buffer.from("ilina112", "base64"),
  verify: {
    aud: false,
    iss: false,
    sub: false,
    maxAgeSec: 14400,
  },
  validate: (artifacts, request, h) => {
    return {
      isValid: true,
      credentials: { userId: artifacts.decoded.payload.id },
    };
  },
});

server.auth.default("jwt");

server.ext("onRequest", (request, h) => {
  console.log(
    `📥 Otrzymano zapytanie: ${request.method.toUpperCase()} ${request.path}`
  );
  return h.continue;
});
const uploadDir = path.join(__dirname, "assets");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
      console.error(" Błąd rejestracji:", error);
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  },
});

server.route({
  method: "POST",
  path: "/login",
  options: {
    auth: false,
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

      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isPasswordCorrect) {
        return h.response({ error: "Invalid password" }).code(401);
      }

      const token = jsonwebtoken.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.is_admin,
        },
        Buffer.from("ilina112", "base64"),
        { expiresIn: "2h" }
      );

      return h
        .response({
          message: "Login successful",
          user: { id: user.id, username: user.username, email: user.email },
          token,
        })
        .code(200);
    } catch (error) {
      console.error("Login error:", error);
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  },
});

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
      console.error(" Błąd pobierania danych:", error);
      return h.response({ error: "Błąd pobierania danych" }).code(500);
    }
  },
});
server.route({
  method: "GET",
  path: "/orders",
  options: { auth: "jwt" },
  handler: async (request, h) => {
    try {
      console.log("🛡 Uwierzytelniony użytkownik:", request.auth.credentials);
      const userId = request.auth.credentials.userId;

      const [orders] = await db.execute(
        "SELECT * FROM orders WHERE user_id = ?",
        [userId]
      );

      console.log(" Zamówienia użytkownika:", orders);
      return h.response(orders).code(200);
    } catch (error) {
      console.error(" Błąd pobierania zamówień:", error);
      return h.response({ error: "Błąd serwera" }).code(500);
    }
  },
});

server.route({
  method: "POST",
  path: "/orders",
  options: {
    payload: {
      parse: true,
      allow: "application/json",
    },
  },
  handler: async (request, h) => {
    console.log(
      "📥 Otrzymane dane do /orders:",
      JSON.stringify(request.payload, null, 2)
    );

    const { user_id, items, total } = request.payload;

    if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
      console.log("Brak wymaganych danych");
      return h.response({ error: "Brak wymaganych danych" }).code(400);
    }

    try {
      await db.beginTransaction();

      console.log("🛒 Tworzenie zamówienia w bazie...");
      const [orderResult] = await db.execute(
        "INSERT INTO orders (user_id, total_price, status, created_at) VALUES (?, ?, 'pending', NOW())",
        [user_id, total]
      );

      const orderId = orderResult.insertId;
      console.log(` Zamówienie utworzone, order_id: ${orderId}`);

      if (items.length > 0) {
        const sql = `
          INSERT INTO order_items (order_id, product_id, product_name, quantity, price) 
          VALUES ${items.map(() => "(?, ?, ?, ?, ?)").join(", ")}
        `;

        const values = items.flatMap(({ id, name, quantity, price }) => {
          const product_id = id ?? null;
          const product_name = name ?? "Brak nazwy";
          const product_quantity = quantity ?? 1;
          const product_price = price ?? 0.0;

          console.log(
            `🛠 Sprawdzam: ${product_id}, ${product_name}, ${product_quantity}, ${product_price}`
          );

          return [
            orderId,
            product_id,
            product_name,
            product_quantity,
            product_price,
          ];
        });

        console.log(" Zapytanie SQL do `order_items`:");
        console.log(sql);
        console.log("Wartości do wstawienia:", values);

        // Wykonanie zapytania z wartościami
        await db.execute(sql, values);
      }

      await db.commit();
      console.log("Zamówienie i produkty zostały zapisane!");
      return h
        .response({
          message: "Zamówienie i produkty zapisane",
          order_id: orderId,
        })
        .code(201);
    } catch (error) {
      await db.rollback();
      console.error("Błąd zapisu zamówienia:", error);
      return h
        .response({ error: "Błąd serwera", details: error.message })
        .code(500);
    }
  },
});

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
      console.error(" Błąd pobierania elementu:", error);
      return h.response({ error: "Błąd pobierania elementu" }).code(500);
    }
  },
});

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
      console.error("Błąd serwera:", error);
      return h.response({ error: "Błąd serwera" }).code(500);
    }
  },
});

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

const start = async () => {
  await server.start();
  console.log(`🚀 Server running at: ${server.info.uri}`);
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
