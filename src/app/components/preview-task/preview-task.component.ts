import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { DatePipe, NgClass } from '@angular/common';
import { FormatPriorityPipe } from '../../pipes/format-priority.pipe';

@Component({
  selector: 'app-preview-task',
  standalone: true,
  imports: [RouterLink, NgClass, DatePipe, FormatPriorityPipe],
  templateUrl: './preview-task.component.html',
  styleUrl: './preview-task.component.css'
})
export class PreviewTaskComponent implements OnInit {
  @Input() id: string | null = null;
  task: Task | undefined;

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    if (this.id) {
      this.task = this.taskService.getTask(parseInt(this.id));
    }
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId);
    this.router.navigate(['/tasks']);
  }
}
