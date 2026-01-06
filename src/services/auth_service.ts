import { type User } from "@prisma/client";
import type { IUserRepository } from "../repositories/user_repository";
import jwt from "jsonwebtoken";
import { Config } from "../config/config";

// DTO
export interface AuthDTO {
  email: string;
  password: string;
}

// Interface
export interface IAuthService {
  login(dto: AuthDTO): Promise<string>;
  register(dto: AuthDTO): Promise<User>;
}

export class AuthService implements IAuthService {
  private repo: IUserRepository;
  private jwtSecret: string;

  constructor(repo: IUserRepository) {
    this.repo = repo;
    this.jwtSecret = Config.load().JWT_SECRET;
  }

  async register(dto: AuthDTO): Promise<User> {
    // Şifreyi Hashle (Bun'ın yerleşik hızlı şifreleyicisini kullanıyoruz)
    const hashedPassword = await Bun.password.hash(dto.password);

    const user = await this.repo.createUser({
      email: dto.email,
      password: hashedPassword,
    });

    return user;
  }

  async login(dto: AuthDTO): Promise<string> {
    const user = await this.repo.findByEmail(dto.email);
    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }

    // Şifre Kontrolü
    const isMatch = await Bun.password.verify(dto.password, user.password);
    if (!isMatch) {
      throw new Error("Hatalı şifre");
    }

    // JWT Oluşturma
    const token = jwt.sign(
      {
        user_id: user.id,
        role: user.role,
      },
      this.jwtSecret,
      { expiresIn: "72h" }
    );

    return token;
  }
}