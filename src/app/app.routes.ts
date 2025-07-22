import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: 'tasks',
        loadComponent: () => import('./components/tasks-list/tasks-list.component').then(m => m.TasksListComponent)
    }
];
