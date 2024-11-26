import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ResponseSetInfo, ResponseInfo, PairValue } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ResponseSetService {
  constructor(private http: HttpClient) {}

  getResponseSetTypes(): Promise<PairValue<number, string>[]> {
    return this.http
      .get<PairValue<number, string>[]>('response-set-type')
      .toPromise();
  }
  getResponseSets(): Observable<ResponseSetInfo[]> {
    return this.http.get<ResponseSetInfo[]>('response-sets');
  }

  getResponseSetInfo(responseSetId: number): Promise<ResponseSetInfo> {
    return this.http
      .get<ResponseSetInfo>('response-set-info/' + responseSetId)
      .toPromise();
  }

  getResponses(responseSetId: number): Promise<ResponseInfo[]> {
    return this.http
      .get<ResponseInfo[]>('responses/' + responseSetId)
      .toPromise();
  }

  saveResponseSetInfo(
    responseSetInfo: ResponseSetInfo,
    responses: ResponseInfo[]
  ): Promise<any> {
    return this.http
      .post<{ responseSetId: number }>('save-response-set', responseSetInfo)
      .pipe(
        mergeMap((data) =>
          this.http.post<any>('save-responses', {
            responseSetId: data.responseSetId,
            responses: responses,
          })
        )
      )
      .toPromise();
  }

  deleteResponseSet(responseSetId: number): Promise<any> {
    return this.http
      .get<any>('delete-response-set/' + responseSetId)
      .toPromise();
  }
}
