import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories: Record<number, Category> = {};
  private nextId!: number;
  constructor() { 
    this.categories = {
      1: new Category(1, 'Category 1'),
      2: new Category(2, 'Category 2'),
      3: new Category(3, 'Category 3'),
    }
    this.nextId = Object.keys(this.categories).length + 1;
  }

  addCategory(name: string): Category {
    const newCategory = new Category(this.nextId, name);
    this.categories[this.nextId] = newCategory;
    this.nextId++;
    return newCategory;
  }

  updateCategory(id: number, name: string): Category | null {
    const category = this.categories[id];
    if (category) {
      category.name = name;
      return category;
    }
    return null;
  }

  deleteCategory(id: number): void{
    if (this.categories[id]) {
      delete this.categories[id];
    }
  }

  getCategories(): Category[] {
    return Object.values(this.categories);
  }

  getCategory(id: number): Category | undefined {
    return this.categories[id] || undefined;
  }
}
