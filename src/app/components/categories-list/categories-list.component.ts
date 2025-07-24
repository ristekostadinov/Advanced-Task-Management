import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

/**
 * @description Component for displaying a list of categories.
 * Allows deleting and editing categories.
 * @param {Observable<Category[]>} categories$ is an observable for the list of categories.
 */
@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css',
})
export class CategoriesListComponent implements OnInit {
  categories$!: Observable<Category[]>;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();
  }

  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id);
  }
}
