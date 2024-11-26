import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurriculumInfo } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CurriculumService {
  constructor(private http: HttpClient) {}

  getCurriculums(): Observable<CurriculumInfo[]> {
    return this.http.get<CurriculumInfo[]>('curriculums');
  }

  getCurriculum(curriculumId: number): Promise<CurriculumInfo> {
    return this.http
      .get<CurriculumInfo>('curriculum/' + curriculumId)
      .toPromise();
  }

  saveCurriculum(curriculumInfo: CurriculumInfo): Promise<any> {
    return this.http.post<any>('save-curriculum', curriculumInfo).toPromise();
  }
}
