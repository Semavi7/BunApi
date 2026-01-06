import { Elysia } from "elysia";
import { TodoHandler } from "../handlers/todo_handler";
import { AuthHandler } from "../handlers/auth_handler";
import { authMiddleware, protectedRoute, adminOnly } from "../middleware/auth";

export const setupRoutes = (
  app: Elysia,
  todoHandler: TodoHandler,
  authHandler: AuthHandler
) => {
  const api = new Elysia({ prefix: "/api" });

  // 1. Auth Rotaları (Public)
  api.post("/auth/register", authHandler.register);
  api.post("/auth/login", authHandler.login);

  // --- KORUMALI ALAN ---
  // Middleware'i kullan
  api.use(authMiddleware);

  // Yetki gerektiren rotalar grubu
  api.guard(
    {
      beforeHandle: protectedRoute, // Login kontrolü
    },
    (protectedApi) =>
      protectedApi
        .get("/todos", todoHandler.getTodos)
        .get("/todos/:id", todoHandler.getTodo)
        
        // Admin Group
        .group("/admin", (adminApi) =>
          adminApi
            .guard(
              {
                beforeHandle: adminOnly, // Sadece Admin
              },
              (adminRoutes) => 
                adminRoutes.post("/todos", todoHandler.createTodo)
            )
        )
  );

  app.use(api);
};