import type { IAuthService, AuthDTO } from "../services/auth_service";
import type { Context } from "elysia";

export class AuthHandler {
  private service: IAuthService;

  constructor(service: IAuthService) {
    this.service = service;
  }

  register = async ({ body, set }: Context) => {
    try {
      const dto = body as AuthDTO;
      const user = await this.service.register(dto);
      set.status = 201;
      return user;
    } catch (error: any) {
      set.status = 400;
      return { error: error.message };
    }
  };

  login = async ({ body, cookie, set }: Context) => {
    try {
      const dto = body as AuthDTO;
      const token = await this.service.login(dto);

      // Cookie Ayarla
      cookie.jwt!.set({
        value: token,
        httpOnly: true,
        maxAge: 72 * 60 * 60, // 72 saat (saniye cinsinden)
        path: "/",
        sameSite: "lax", // Localhost için uygun
        // secure: true // HTTPS için
      });

      return { message: "Giriş başarılı" };
    } catch (error: any) {
        set.status = error.message === "Kullanıcı bulunamadı" || error.message === "Hatalı şifre" ? 401 : 500;
      return { error: error.message };
    }
  };
}