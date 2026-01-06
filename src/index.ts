(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { Config } from "./config/config";
import db, { connectDB } from "./database/db";
import { UserRepository } from "./repositories/user_repository";
import { TodoRepository } from "./repositories/todo_repository";
import { AuthService } from "./services/auth_service";
import { TodoService } from "./services/todo_service";
import { AuthHandler } from "./handlers/auth_handler";
import { TodoHandler } from "./handlers/todo_handler";
import { setupRoutes } from "./routes/routes";

// 1. Konfigürasyon
const config = Config.load();

// 2. Veritabanı Bağlantısı
await connectDB();

// 3. DEPENDENCY INJECTION (Bağımlılık Enjeksiyonu) ZİNCİRİ

// Auth Bağımlılıkları
const userRepo = new UserRepository(db);
const authService = new AuthService(userRepo);
const authHandler = new AuthHandler(authService);

// Todo Bağımlılıkları
const todoRepo = new TodoRepository(db);
const todoService = new TodoService(todoRepo);
const todoHandler = new TodoHandler(todoService);

// 4. Elysia Uygulamasını Başlat
const app = new Elysia();

// --- CORS AYARLARI ---
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    allowedHeaders: ["Origin", "Content-Type", "Accept"],
  })
);

// 5. Rotaları Tanımla
setupRoutes(app, todoHandler, authHandler);

// 6. Sunucuyu Ayağa Kaldır
app.listen(config.SERVER_PORT);

console.log(
  `🚀 Sunucu http://localhost:${app.server?.port} portunda Bun ile çalışıyor...`
);