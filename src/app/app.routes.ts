import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./components/tasks-list/tasks-list.component').then(
        (m) => m.TasksListComponent
      ),
  },
  {
    path: 'tasks/create',
    loadComponent: () =>
      import('./components/task-form/task-form.component').then(
        (m) => m.TaskFormComponent
      ),
  },
  {
    path: 'tasks/:id',
    loadComponent: () =>
      import('./components/preview-task/preview-task.component').then(
        (m) => m.PreviewTaskComponent
      ),
  },
  {
    path: 'tasks/:id/edit',
    loadComponent: () =>
      import('./components/task-form/task-form.component').then(
        (m) => m.TaskFormComponent
      ),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./components/categories-list/categories-list.component').then(
        (m) => m.CategoriesListComponent
      ),
  },
  {
    path: 'categories/:id/edit',
    loadComponent: () =>
      import('./components/category-form/category-form.component').then(
        (m) => m.CategoryFormComponent
      ),
  },
  {
    path: 'categories/create',
    loadComponent: () =>
      import('./components/category-form/category-form.component').then(
        (m) => m.CategoryFormComponent
      ),
  },
];
