import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CourseCategoryInfo } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CourseCategoryService {
  constructor(private http: HttpClient) {}

  getCourseCategories(): Promise<CourseCategoryInfo[]> {
    return this.http.get<CourseCategoryInfo[]>('course-categories').toPromise();
  }

  saveCourseCategories(
    courseCategories: CourseCategoryInfo[],
    deletedCourseCategories: number[]
  ): Promise<any> {
    return this.http
      .post<any>('save-course-categories', {
        courseCategories: courseCategories,
        deletedCourseCategories: deletedCourseCategories,
      })
      .toPromise();
  }
}
