import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Priority } from '../../models/priority.enum';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [NgClass],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css'
})
export class TasksListComponent implements OnInit {
[x: string]: any;
  tasks : Task[] = [];

  constructor(private _taskService: TaskService) { }

  ngOnInit(): void {
    this.tasks = this._taskService.getTasks();
    console.log('Tasks loaded:', this.tasks);
  }

  previewTask(task: Task): void {
    console.log('Previewing task:', task);
  }

  toStringPriority(taskPriority: Priority): string {
    switch (taskPriority) {
      case Priority.Low:
        return 'Low';
      case Priority.Medium:
        return 'Medium';
      case Priority.High:
        return 'High';
      default:
        return 'Unknown';
    }
  }
}
