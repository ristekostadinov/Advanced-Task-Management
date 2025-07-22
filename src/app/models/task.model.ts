import { Priority } from "./priority.enum";

export class Task {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public category: string,
    public dueDate: Date,
    public priority: Priority,
    public completed: boolean = false
  ) {}
}