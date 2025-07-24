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

/**
 *
 * @description Component for displaying a list of tasks with sorting and filtering options.
 * Allows toggling task completion and deleting tasks.
 * @param {BehaviorSubject<'dueDate' | 'priority' | ''>} sortBy$ is used to control the sorting of tasks.
 * @param {BehaviorSubject<string>} filterByCategory$ is used to filter tasks by category.
 * @param {Observable<Task[]>} tasks$ is an observable for the list of tasks.
 * @param {Observable<Category[]>} categories$ is an observable for the list of categories.
 */
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

  /**
   *
   * @param event is the change event from the sort dropdown.
   * @description Handles the change event for sorting tasks.
   * Updates the sortBy$ BehaviorSubject with the selected sorting option.
   */
  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as
      | 'dueDate'
      | 'priority'
      | '';
    this.sortBy$.next(value);
  }

  /**
   *
   * @param event is the change event from the category filter dropdown.
   * @description Handles the change event for filtering tasks by category.
   * Updates the filterByCategory$ BehaviorSubject with the selected category ID.
   */
  onCategoryChange(event: Event): void {
    const selectedCategoryId = (event.target as HTMLSelectElement).value;
    this.filterByCategory$.next(selectedCategoryId);
  }

  toggleComplete(task: Task): void {
    this.taskService.toggleTaskCompletion(task.id).subscribe();
  }
}
