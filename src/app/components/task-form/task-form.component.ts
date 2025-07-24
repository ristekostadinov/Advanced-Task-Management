import { Component, Input, OnInit } from '@angular/core';
import {
  Form,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';
import { Priority } from '../../models/priority.enum';
import { combineLatest, Observable, of, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';

interface ITaskForm {
  name: FormControl<string>;
  description: FormControl<string>;
  category: FormControl<number>;
  dueDate: FormControl<string>;
  priority: FormControl<string>;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnInit {
  @Input() id: string | null = null;
  title: string = '';
  task$!: Observable<Task | undefined>;
  task: Task | undefined; // To store the task object for later use
  taskForm!: FormGroup<ITaskForm>;
  categories$!: Observable<Category[]>; // It's better to ensure it's always an array
  allCategories: Category[] = []; // To store categories after subscription

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private taskService: TaskService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    console.log('TaskFormComponent: ngOnInit started. Input ID:', this.id);
    this.title = this.id ? 'Edit Task' : 'Create Task';

    // *** FIX: Initialize the form IMMEDIATELY with default/empty values ***
    this.taskForm = this.formBuilder.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(15)]],
      category: [0, [Validators.required]], // Default to null initially
      dueDate: ['', [Validators.required]], // Default to empty string
      priority: ['Medium', [Validators.required]], // Default priority
    });

    const taskId = this.id ? parseInt(this.id) : undefined;

    combineLatest({
      task:
        taskId !== undefined ? this.taskService.getTask(taskId) : of(undefined),
      categories: this.categoryService.getCategories(),
    }).subscribe({
      next: ({ task, categories }) => {
        console.log('ForkJoin received data:');
        console.log('  Task object from service:', task); // Check this very carefully
        console.log('  Categories array from service:', categories);

        this.task = task; // Store the task for later use
        this.allCategories = categories;
        this.categories$ = of(categories); // Still setting this for template's async pipe
        // Set task$ for template's async pipe
        let categoryToSet: number | null = null;

        if (task) {
          // If in edit mode and task is found, use its category
          categoryToSet = task.category.id;
        } else if (categories.length > 0) {
          // If creating and categories exist, default to the first one
          categoryToSet = categories[0].id;
        }
        // If no task and no categories, categoryToSet remains null, which is fine given the FormControl type

        // *** CRITICAL FIX: Use patchValue() to update the existing form ***
        this.taskForm.patchValue({
          // <--- Use patchValue() here!
          name: task ? task.name : '',
          description: task ? task.description : '',
          category: task ? task.category.id : undefined,
          dueDate: task ? task.dueDate.toISOString().substring(0, 10) : '',
          priority: task ? Priority[task.priority] : 'Medium',
        });
        console.log(
          'Form PATCHED with fetched/default values:',
          this.taskForm.value
        );
        console.log('Form validity after patch:', this.taskForm.valid);
      },
      error: (err) => {
        console.error('Combine latest subscription error:', err);
      },
      complete: () => {
        console.log('Combine latest subscription completed.');
      },
    });
  }

  submitForm() {
    const formValue = this.taskForm.value;
    const { name, description, category, dueDate, priority } = formValue;
    if (name && description && category && dueDate && priority) {
      const selectedCategory = this.getCategoryById(category);
      
      console.log('Selected category:', selectedCategory);

      const taskData: Task = {
        id: this.task ? this.task.id : 0,
        name: name,
        description: description,
        category: selectedCategory,
        dueDate: new Date(dueDate),
        priority: this.convertToPriority(priority),
        completed: this.task ? this.task.completed : false,
      };

      if (this.id) {
        this.taskService
          .getTask(parseInt(this.id))

          .subscribe((existingTask) => {
            if (existingTask) {
              taskData.completed = existingTask.completed;
            }
            this.taskService
              .updateTask(taskData)
              .pipe(take(1))
              .subscribe(() => {
                this.router.navigate(['/tasks']);
              });
          });
      } else {
        this.taskService
          .addTask(taskData)
          .pipe(take(1))
          .subscribe(() => {
            this.router.navigate(['/tasks']);
          });
      }
    }
  }

  convertToPriority(priority: string): Priority {
    switch (priority) {
      case 'High':
        return Priority.High;
      case 'Medium':
        return Priority.Medium;
      case 'Low':
        return Priority.Low;
      default:
        return Priority.Medium; // Default priority if none matches
    }
  }

  getCategoryById(categoryId: number): Category {
    // Look up category from the cached allCategories array
    return this.allCategories.filter((cat) => cat.id == categoryId)[0];
  }
}
