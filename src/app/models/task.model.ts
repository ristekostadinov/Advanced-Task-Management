import { Category } from "./category.model";
import { Priority } from "./priority.enum";

export class Task {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public category: Category,
    public dueDate: Date,
    public priority: Priority,
    public completed: boolean = false
  ) {}
}