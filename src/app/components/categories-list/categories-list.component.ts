import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];

  constructor(private _categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categories = this._categoryService.getCategories();
  }


  deleteCategory(id: number): void {
    this._categoryService.deleteCategory(id); 
    this.ngOnInit();
  }
}
