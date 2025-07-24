import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgClass } from '@angular/common';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { FormatPriorityPipe } from '../../pipes/format-priority.pipe';
import { CategoryService } from '../../services/category.service';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'app-tasks-list',
  standalone: true,

  imports: [
    NgClass,
    AsyncPipe,
    FormsModule,
    DatePipe,
    RouterLink,
    FormatPriorityPipe,
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
})
export class TasksListComponent implements OnInit {
  sortBy$ = new BehaviorSubject<'dueDate' | 'priority' | ''>('');
  filterByCategory$ = new BehaviorSubject<string>('');

  tasks$!: Observable<Task[]>;
  categories$!: Observable<Category[]>;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService
  ) {
    this.categories$ = this.categoryService.getCategories();
    this.tasks$ = combineLatest([
      this.taskService.getTasks(),
      this.sortBy$,
      this.filterByCategory$,
    ]).pipe(
      map(([tasks, sortBy, categoryId]) => {
        let filtered = tasks;

        if (categoryId) {
          filtered = filtered.filter(
            (task) => String(task.category.id) == categoryId
          );
        }

        if (sortBy === 'dueDate') {
          filtered = [...filtered].sort(
            (a, b) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          );
        } else if (sortBy === 'priority') {
          filtered = [...filtered].sort((a, b) => a.priority - b.priority);
        }

        return filtered;
      })
    );
  }

  ngOnInit(): void {}

  onSortChange(event : Event): void {
    const value = (event.target as HTMLSelectElement).value as 'dueDate' | 'priority' | '';
    this.sortBy$.next(value);
  }

  onCategoryChange(event: Event): void {
    const selectedCategoryId = (event.target as HTMLSelectElement).value;
    this.filterByCategory$.next(selectedCategoryId);
  }

  toggleComplete(task: Task): void {
    this.taskService.toggleTaskCompletion(task.id).subscribe();
  }
}
