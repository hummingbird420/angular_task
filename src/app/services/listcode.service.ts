import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListTypeInfo, ListCodeInfo } from '../models';

type ListText = {
  [key: string]: string;
};

@Injectable({
  providedIn: 'root',
})
export class ListcodeService {
  private _listText: ListText = {};

  constructor(private http: HttpClient) {}

  geLlistText(listTypeId: number): string {
    return this._listText.hasOwnProperty(listTypeId)
      ? this._listText[listTypeId]
      : '';
  }

  addListText(listTypeId: number, listText: string) {
    this._listText[listTypeId] = listText;
  }

  getListType(listTypeId: number): Promise<ListTypeInfo> {
    return this.http
      .get<ListTypeInfo>('list-code/list-type/' + listTypeId)
      .pipe(
        map((listTypeInfo) => {
          this._listText[listTypeId] = listTypeInfo.textLabel;
          return listTypeInfo;
        })
      )
      .toPromise();
  }

  getListCodes(listTypeId: number): Observable<ListCodeInfo[]> {
    return this.http.get<ListCodeInfo[]>('list-code/listcodes/' + listTypeId);
  }

  saveListCodes(
    listCodes: ListCodeInfo[],
    listTypeId: number
  ): Observable<any> {
    return this.http
      .post<any>('list-code/save-listcodes/' + listTypeId, listCodes)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
