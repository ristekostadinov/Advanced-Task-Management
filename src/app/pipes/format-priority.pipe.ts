import { Pipe, PipeTransform } from '@angular/core';
import { Priority } from '../models/priority.enum';

/**
 * @description Pipe to format task priority for display.
 * Converts the Priority enum value to its string representation.
 */
@Pipe({
  name: 'formatPriority',
  standalone: true,
})
export class FormatPriorityPipe implements PipeTransform {
  transform(value: Priority): string {
    return Priority[value];
  }
}
