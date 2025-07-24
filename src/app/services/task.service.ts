import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Priority } from '../models/priority.enum';
import { Category } from '../models/category.model';
import { CategoryService } from './category.service';
import { BehaviorSubject, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks = new Map<number, Task>();
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private nextId = 1;

  constructor(private categoryService: CategoryService) {
    this.initMockTasks();
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  getTask(id: number): Observable<Task | undefined> {
    return new BehaviorSubject(this.tasks.get(id)).asObservable();
  }

  addTask(task: Task): Observable<Task> {
    task.id = this.nextId++;
    this.tasks.set(task.id, task);
    this.emitChange();
    return new BehaviorSubject(task).asObservable();
  }

  updateTask(task: Task): Observable<Task | null> {
    if (!this.tasks.has(task.id)) return new BehaviorSubject(null).asObservable();
    this.tasks.set(task.id, task);
    this.emitChange();
    return new BehaviorSubject(task).asObservable();
  }

  deleteTask(id: number): Observable<boolean> {
    const deleted = this.tasks.delete(id);
    this.emitChange();
    return new BehaviorSubject(deleted).asObservable();
  }

  toggleTaskCompletion(id: number): Observable<Task | null> {
    const task = this.tasks.get(id);
    if (!task) return new BehaviorSubject(null).asObservable();
    const updatedTask = { ...task, completed: !task.completed };
    this.tasks.set(id, updatedTask);
    this.emitChange();
    return new BehaviorSubject(updatedTask).asObservable();
  }



  private emitChange(): void {
    this.tasksSubject.next(Array.from(this.tasks.values()));
  }

  private initMockTasks(): void {
    this.categoryService.getCategories().pipe(take(1)).subscribe((categories) => {
      const cat1 = categories[0];
      const cat2 = categories[1];

      const task1 = new Task(
        this.nextId++,
        'Buy groceries',
        'Milk, Bread, Eggs',
        cat1,
        new Date('2025-07-25'),
        Priority.Medium,
        false
      );

      const task2 = new Task(
        this.nextId++,
        'Project presentation',
        'Final slides and review',
        cat2,
        new Date('2025-07-22'),
        Priority.High,
        false
      );

      this.tasks.set(task1.id, task1);
      this.tasks.set(task2.id, task2);

      this.emitChange();
    });
  }
}
