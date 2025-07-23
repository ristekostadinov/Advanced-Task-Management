import { Component, Input, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { Category } from '../../models/category.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css',
})
export class CategoryFormComponent implements OnInit {
  title: string = '';
  @Input() id: string | null = null;
  category?: Category;
  categoryForm!: FormGroup;

  constructor(
    private _categoryService: CategoryService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.category = this._categoryService.getCategory(parseInt(this.id));
    }

    this.categoryForm = this._formBuilder.nonNullable.group({
      name: [
        this.category ? this.category.name : '',
        [Validators.required, Validators.minLength(5)],
      ],
    });

    this.title = this.category ? 'Edit Category' : 'Create Category';
    console.log(this.category);
  }

  submitForm() {
    if (this.categoryForm.invalid) {
      return;
    }
    let name = this.categoryForm.value.name;
    if (this.id) {
      this._categoryService.updateCategory(parseInt(this.id), name);
    } else {
      this._categoryService.addCategory(name);
    }
    this._router.navigate(['/categories']);
  }
}
