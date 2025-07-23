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

interface ITaskForm {
  name: FormControl<string>;
  description: FormControl<string>;
  category: FormControl<string>;
  dueDate: FormControl<Date>;
  priority: FormControl<string>;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnInit {
  @Input() id: string | null = null;
  title: string = '';
  task?: Task;
  taskForm!: FormGroup<ITaskForm>;
  categories!: Category[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private taskService: TaskService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.task = this.taskService.getTask(parseInt(this.id));
    }
    this.categories = this.categoryService.getCategories();

    this.taskForm = this.formBuilder.nonNullable.group({
      name: [
        this.task ? this.task.name : '',
        { validators: [Validators.required, Validators.minLength(3)] },
      ],
      description: [
        this.task ? this.task.description : '',
        { validators: [Validators.required, Validators.minLength(15)] },
      ],
      category: [
        this.task ? this.task.category.name : '',
        { validators: [Validators.required] },
      ],
      dueDate: [
        this.task ? this.task.dueDate : new Date(),
        { validators: [Validators.required] },
      ],
      priority: [
        this.task ? Priority[this.task.priority] : '',
        { validators: [Validators.required] },
      ],
    });
  }

  submitForm() {
    if (this.taskForm.invalid || !this.taskForm.value) {
      return;
    }
    const {
      name = '',
      description = '',
      category = '',
      dueDate = new Date(),
      priority = '',
    } = this.taskForm.value;

    const taskData: Task = {
      id: this.task ? this.task.id : 0,
      name,
      description,
      category: this.getCategory(category),
      dueDate: new Date(dueDate),
      priority: this.convertToPriority(priority),
      completed: this.task ? this.task.completed : false,
    };

    if (this.id && this.task) {
      this.taskService.updateTask(taskData);
    } else {
      this.taskService.addTask(taskData);
    }

    this.router.navigate(['/tasks']);
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

  getCategory(categoryName: string): Category {
    return (
      this.categories.find((cat) => cat.name === categoryName) ||
      this.categories[0]
    );
  }
}
