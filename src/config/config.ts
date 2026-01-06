import { z } from "zod";

// Ortam değişkenlerini doğrulayarak yüklüyoruz (Go'daki struct yapısı gibi)
const envSchema = z.object({
  DB_HOST: z.string().default("localhost"),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("password"),
  DB_NAME: z.string().default("todo_db"),
  DB_PORT: z.string().default("5432"),
  SERVER_PORT: z.string().default("3000"),
  JWT_SECRET: z.string().default("supersecretkey"),
  DATABASE_URL: z.string().optional() // Prisma için gerekli
});

export class Config {
  public static load() {
    // Bun, .env dosyasını otomatik okur, ekstra kütüphaneye gerek yok.
    const config = envSchema.parse(process.env);
    return config;
  }
}