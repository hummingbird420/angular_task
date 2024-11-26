import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  getLogo(logoId: string): Observable<string> {
    return this.http
      .get<{ logo: string }>('logo/' + logoId)
      .pipe(map((data) => data.logo));
  }

  getLogoByAdminId(adminId: number): Observable<string> {
    return this.http
      .get<{ logo: string }>('public-logo/' + adminId)
      .pipe(map((data) => data.logo));
  }
}
