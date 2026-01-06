import { PrismaClient, type User } from "@prisma/client";

// 1. Interface (Kontrat)
export interface IUserRepository {
  createUser(data: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}

// 2. Implementation
export class UserRepository implements IUserRepository {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createUser(data: Partial<User>): Promise<User> {
    // data.email ve data.password zorunlu kabul edilir TS tarafından kontrol edilmeli
    return this.db.user.create({
      data: {
        email: data.email!,
        password: data.password!,
        role: data.role || "user",
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { email },
    });
  }
}