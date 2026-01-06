import { PrismaClient } from "@prisma/client";

// Global Prisma Client instance (Singleton pattern)
const db = new PrismaClient();

export const connectDB = async () => {
  try {
    await db.$connect();
    console.log("Veritabanı bağlantısı başarılı!");
  } catch (error) {
    console.error("Veritabanına bağlanılamadı:", error);
    process.exit(1);
  }
};

export default db;