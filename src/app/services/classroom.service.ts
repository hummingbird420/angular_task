import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClassroomInfo } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  constructor(private http: HttpClient) {}

  getClassroomFieldNames(): Observable<any> {
    return this.http.get<any>('classroom-field-names');
  }

  getClassrooms(campusCode: string): Observable<any> {
    return this.http.get<any>('classrooms/' + campusCode);
  }

  getClassroomDetails(campusCode: string): Observable<any> {
    return this.http.get<any>('classroom-details/' + campusCode);
  }

  saveClassroom(classroomInfo: ClassroomInfo): Observable<any> {
    return this.http.post<any>('save-classroom/', classroomInfo);
  }

  deleteClassroom(classroomId: number): Observable<any> {
    return this.http.post<any>('delete-classroom/', classroomId);
  }
}
