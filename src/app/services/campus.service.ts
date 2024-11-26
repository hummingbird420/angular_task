import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListCodeInfo, SortedFieldInfo } from '../models';
import { CampusInfo } from '../models/campus.info';

@Injectable({
  providedIn: 'root',
})
export class CampusService {
  constructor(private http: HttpClient) {}

  getCampuses(status: number): Observable<CampusInfo[]> {
    return this.http.get<CampusInfo[]>('campus/infos' + status);
  }

  getCampusInfo(campusId: number): Observable<CampusInfo> {
    return this.http.get<CampusInfo>('campus/' + campusId);
  }

  getCampusRecordSections(isAll?: boolean): Observable<ListCodeInfo[]> {
    return this.http.get<ListCodeInfo[]>(
      'campus/record-sections' + (isAll ? '/all' : '')
    );
  }

  getCampusFields(
    campusId: number,
    tabName: string
  ): Observable<SortedFieldInfo<any, string>[]> {
    return this.http.get<SortedFieldInfo<any, string>[]>(
      'campus/fields/' + campusId + '/' + tabName
    );
  }

  getCampusDropdown(campusId: number) {
    return this.http.get<SortedFieldInfo<any, string>>(
      'campus/dropdown/' + campusId
    );
  }
}
