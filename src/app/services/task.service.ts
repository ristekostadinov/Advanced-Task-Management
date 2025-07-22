import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Priority } from '../models/priority.enum';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [
    new Task(1, 'Buy groceries', 'Milk, Bread, Eggs', 'Home', new Date('2025-07-25'), Priority.Medium, false),
    new Task(2, 'Project presentation', 'Final slides and review', 'Work', new Date('2025-07-22'), Priority.High, false)
  ];

  constructor() {}

  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(task: Task): void {
    this.tasks.push(task);
  }

  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }

  patchTask(taskId: number, updatedTask: Partial<Task>): void {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
    }
  }
}
