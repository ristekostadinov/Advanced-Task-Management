import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { FormatPriorityPipe } from '../../pipes/format-priority.pipe';
import { Observable } from 'rxjs';

/**
 * @description Component for previewing a task.
 * @param {string | null} id is the task ID for previewing, it is taken from the path variable param.
 * @param {Observable<Task | undefined>} task$ is an observable for the task being previewed.
 */
@Component({
  selector: 'app-preview-task',
  standalone: true,
  imports: [RouterLink, NgClass, DatePipe, FormatPriorityPipe, AsyncPipe],
  templateUrl: './preview-task.component.html',
  styleUrl: './preview-task.component.css',
})
export class PreviewTaskComponent implements OnInit {
  @Input() id: string | null = null;
  task$!: Observable<Task | undefined>;

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    if (this.id) {
      this.task$ = this.taskService.getTask(parseInt(this.id));
    }
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe((deleted) => {
      this.router.navigate(['/tasks']);
    });
  }
}
