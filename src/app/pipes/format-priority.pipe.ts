import { Pipe, PipeTransform } from '@angular/core';
import { Priority } from '../models/priority.enum';

@Pipe({
  name: 'formatPriority',
  standalone: true,
})
export class FormatPriorityPipe implements PipeTransform {
  transform(value: Priority): string {
    return Priority[value];
  }
}
