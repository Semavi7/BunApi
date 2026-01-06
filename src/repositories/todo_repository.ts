import { PrismaClient, type Todo } from "@prisma/client";

// 1. Interface
export interface ITodoRepository {
  getAllTodos(): Promise<Todo[]>;
  createTodo(data: Partial<Todo>): Promise<Todo>;
  getTodoByID(id: number): Promise<Todo | null>;
}

// 2. Implementation
export class TodoRepository implements ITodoRepository {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async getAllTodos(): Promise<Todo[]> {
    return this.db.todo.findMany();
  }

  async createTodo(data: Partial<Todo>): Promise<Todo> {
    return this.db.todo.create({
      data: {
        title: data.title!,
        completed: data.completed || false,
      },
    });
  }

  async getTodoByID(id: number): Promise<Todo | null> {
    return this.db.todo.findUnique({
      where: { id },
    });
  }
}