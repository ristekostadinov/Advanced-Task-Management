import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Priority } from '../models/priority.enum';
import { Category } from '../models/category.model';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskRecord!: Record<number, Task>;
  private nextId!: number;
  private categories!: Category[];

  constructor(private _categoryService: CategoryService) {
    this.categories = this._categoryService.getCategories();
    this.taskRecord = {
      1: new Task(
        1,
        'Buy groceries',
        'Milk, Bread, Eggs',
        this.categories[0], 
        new Date('2025-07-25'),
        Priority.Medium,
        false
      ),
      2: new Task(
        2,
        'Project presentation',
        'Final slides and review',
        this.categories[1],
        new Date('2025-07-22'),
        Priority.High,
        false
      ),
    };

    this.nextId = Object.keys(this.taskRecord).length + 1;
  }

  getTasks(): Task[] {
    return Object.values(this.taskRecord);
  }

  addTask(task: Task): void {
    this.taskRecord[task.id] = task;
  }

  deleteTask(taskId: number): void {
    if (this.taskRecord[taskId]) {
      delete this.taskRecord[taskId];
    }
  }

  updateTask(updatedTask: Task): void {
    if(this.taskRecord[updatedTask.id]) {
      this.taskRecord[updatedTask.id] = updatedTask;
    }
  }

  patchTask(taskId: number): void {
    const task: Task = this.taskRecord[taskId];
    if (task) {
      task.completed = !task.completed;
      this.taskRecord[taskId] = task;
    }
  }

  getTask(taskId: number): Task | undefined {
    return this.taskRecord[taskId];
  }
}
