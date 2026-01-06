import { type Todo } from "@prisma/client";
import type { ITodoRepository } from "../repositories/todo_repository";
import { z } from "zod";

// Validasyon Şeması (Go'daki struct tagleri yerine)
const todoSchema = z.object({
  title: z.string().min(3).max(100),
});

export type TodoCreateDTO = z.infer<typeof todoSchema>;

// Interface
export interface ITodoService {
  getAllTodos(): Promise<Todo[]>;
  createTodo(dto: TodoCreateDTO): Promise<Todo>;
  getTodoByID(id: number): Promise<Todo>;
}

export class TodoService implements ITodoService {
  private repo: ITodoRepository;

  constructor(repo: ITodoRepository) {
    this.repo = repo;
  }

  async getAllTodos(): Promise<Todo[]> {
    return this.repo.getAllTodos();
  }

  async createTodo(dto: TodoCreateDTO): Promise<Todo> {
    // 1. Validasyon
    const validatedData = todoSchema.parse(dto);

    // 2. Repository çağır
    return this.repo.createTodo({
      title: validatedData.title,
    });
  }

  async getTodoByID(id: number): Promise<Todo> {
    const todo = await this.repo.getTodoByID(id);
    if (!todo) {
      throw new Error("Todo bulunamadı");
    }
    return todo;
  }
}