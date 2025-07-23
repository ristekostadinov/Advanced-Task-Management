import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { FormatPriorityPipe } from '../../pipes/format-priority.pipe';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-tasks-list',
  standalone: true,

  imports: [NgClass, FormsModule, DatePipe, RouterLink, FormatPriorityPipe],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
})
export class TasksListComponent implements OnInit {
  tasks: Task[] = [];
  sortBy: 'dueDate' | 'priority' | '' = '';
  filterByCategory: string = '';
  categories: Category[] = [];

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
    this.categories = this.categoryService.getCategories();
  }

  sortTasks(): void {
    if (this.sortBy === 'dueDate') {
      this.tasks.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    } else if (this.sortBy === 'priority') {
      this.tasks.sort((a, b) => a.priority - b.priority);
    } else {
      this.tasks = this.taskService.getTasks();
    }
  }

  toggleComplete(task: Task): void {
    task.completed = !task.completed;
    this.taskService.updateTask(task);
  }

  filterTasks(): void {
    if (this.filterByCategory) {
      this.tasks = this.taskService.getTasks().filter((task) => {
        // Handles both cases: category is an object or an ID
        return String(task.category.id) === this.filterByCategory;
      });
    } else {
      this.tasks = this.taskService.getTasks();
    }
  }
}
