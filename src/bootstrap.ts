import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Config } from "./config/config";
import db, { connectDB } from "./database/db";
import { UserRepository } from "./repositories/user_repository";
import { TodoRepository } from "./repositories/todo_repository";
import { AuthService } from "./services/auth_service";
import { TodoService } from "./services/todo_service";
import { AuthHandler } from "./handlers/auth_handler";
import { TodoHandler } from "./handlers/todo_handler";
import { setupRoutes } from "./routes/routes";

// BigInt JSON serileştirme yaması (Bunu da buraya alıyoruz ki göz önünden kalksın)
(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export async function bootstrap() {
  // 1. Konfigürasyonu Yükle
  const config = Config.load();

  // 2. Veritabanı Bağlantısı
  await connectDB();

  // 3. DEPENDENCY INJECTION (Bağımlılık Zinciri)
  // Tıpkı Go'daki gibi katmanları birbirine bağlıyoruz

  // -- Auth Modülü --
  const userRepo = new UserRepository(db);
  const authService = new AuthService(userRepo);
  const authHandler = new AuthHandler(authService);

  // -- Todo Modülü --
  const todoRepo = new TodoRepository(db);
  const todoService = new TodoService(todoRepo);
  const todoHandler = new TodoHandler(todoService);

  // 4. Elysia Uygulamasını Oluştur
  const app = new Elysia();

  // 5. Middleware (Ara Yazılımlar)
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
      allowedHeaders: ["Origin", "Content-Type", "Accept"],
    })
  );

  app.use(
    swagger({
      path: "/documentation",
      documentation: {
        info: {
          title: "Bun Todo API",
          version: "1.0.0",
          description: "ElysiaJS ve Prisma ile geliştirilmiş Todo API",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
    })
  );

  // 6. Rotaları Tanımla
  setupRoutes(app, todoHandler, authHandler);

  // Hazır olan uygulamayı ve config'i döndür
  return { app, config };
}