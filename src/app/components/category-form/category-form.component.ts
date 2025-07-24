import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { Observable } from 'rxjs';

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
  category$!: Observable<Category | undefined>;
  categoryForm!: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.category$ = this.categoryService.getCategory(parseInt(this.id));
      this.category$.subscribe((category) => {
        this.categoryForm = this.formBuilder.nonNullable.group({
          name: [
            category ? category.name : '',
            [Validators.required, Validators.minLength(5)],
          ],
        });
        this.title = category ? 'Edit Category' : 'Create Category';
      });
    } else {
      this.categoryForm = this.formBuilder.nonNullable.group({
        name: ['', [Validators.required, Validators.minLength(5)]],
      });
      this.title = 'Create Category';
    }
  }


  submitForm() {
    if (this.categoryForm.invalid) {
      return;
    }
    let name = this.categoryForm.value.name;
    if (this.id) {
      this.categoryService.updateCategory(parseInt(this.id), name);
    } else {
      this.categoryService.addCategory(name);
    }
    this.router.navigate(['/categories']);
  }
}
