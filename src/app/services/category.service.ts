import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories = new Map<number, Category>();
  private nextId = 1;

  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  constructor() {
    // Initialize with mock data
    this.addInitialCategories([
      new Category(1, 'Category 1'),
      new Category(2, 'Category 2'),
      new Category(3, 'Category 3'),
    ]);
  }


  getCategories(): Observable<Category[]> {
    return this.categoriesSubject.asObservable();
  }

  getCategory(id: number): Observable<Category> {
    const category = this.categories.get(id);
    if (category) {
      return of(category);
    } else {
      return throwError(() => new Error(`Category with ID ${id} not found.`));
    }
  }

  addCategory(name: string): Observable<Category> {
    const category = new Category(this.nextId++, name);
    this.categories.set(category.id, category);
    this.emitChange();
    return of(category);
  }

  updateCategory(id: number, name: string): Observable<Category | null> {
    if (!this.categories.has(id)) return of(null);
    const updated = new Category(id, name);
    this.categories.set(id, updated);
    this.emitChange();
    return of(updated);
  }

  deleteCategory(id: number): Observable<boolean> {
    const deleted = this.categories.delete(id);
    if (deleted) {
      this.emitChange();
    }
    return of(deleted);
  }

  categoryExists(id: number): boolean {
    return this.categories.has(id);
  }

  clearAllCategories(): void {
    this.categories.clear();
    this.nextId = 1;
    this.emitChange();
  }

  // ==== Private Helpers ====

  private emitChange(): void {
    this.categoriesSubject.next(Array.from(this.categories.values()));
  }

  private addInitialCategories(initial: Category[]): void {
    initial.forEach((cat) => {
      this.categories.set(cat.id, cat);
      this.nextId = Math.max(this.nextId, cat.id + 1);
    });
    this.emitChange();
  }
}
