import type { ITodoService, TodoCreateDTO } from "../services/todo_service";
import type { Context } from "elysia";

export class TodoHandler {
  private service: ITodoService;

  constructor(service: ITodoService) {
    this.service = service;
  }

  getTodos = async () => {
    return await this.service.getAllTodos();
  };

  createTodo = async ({ body, set }: Context) => {
    try {
      const dto = body as TodoCreateDTO;
      const todo = await this.service.createTodo(dto);
      set.status = 201;
      return todo;
    } catch (error: any) {
      set.status = 400;
      return { error: error.message };
    }
  };

  getTodo = async ({ params, set }: Context) => {
    try {
      const id = Number(params.id);
      return await this.service.getTodoByID(id);
    } catch (error: any) {
      set.status = 404;
      return { error: error.message };
    }
  };
}