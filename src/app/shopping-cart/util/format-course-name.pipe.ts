import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCourseName',
})
export class FormatCourseNamePipe implements PipeTransform {
  transform(
    courseName: string,
    courseNumber: string | null | undefined
  ): string {
    if (courseNumber) {
      courseName = `${courseNumber} ${courseName}`;
    }
    return courseName;
  }
}
