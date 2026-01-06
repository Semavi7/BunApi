import { Elysia } from "elysia";
import jwt from "jsonwebtoken";
import { Config } from "../config/config";

const config = Config.load();

// JWT Doğrulama Middleware'i
export const authMiddleware = (app: Elysia) =>
  app.derive(async ({ cookie, set, request }) => {
    // Cookie'den token oku
    const tokenVal = cookie.jwt?.value;
    const token = typeof tokenVal === 'string' ? tokenVal : "";

    if (!token) {
      return { user: null };
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as any;
      return { user: decoded }; // Context'e user ekle
    } catch (err) {
      return { user: null };
    }
  });

// Admin Kontrolü
export const adminOnly = async (context: any) => {
  if (!context.user || context.user.role !== "admin") {
    context.set.status = 403;
    throw new Error("Bu işlem için yetkiniz yok!");
  }
};

// Login Kontrolü (Router'da kullanılacak koruma)
export const protectedRoute = async (context: any) => {
  if (!context.user) {
    context.set.status = 401;
    throw new Error("Yetkisiz erişim (Token geçersiz)");
  }
}