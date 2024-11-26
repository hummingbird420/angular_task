import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MenuItem } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RightLinkService {
  private rightLinks: BehaviorSubject<MenuItem[]>;

  constructor(private http: HttpClient) {
    this.rightLinks = new BehaviorSubject<MenuItem[]>([]);
  }

  getRightLinks(): Observable<MenuItem[]> {
    return this.rightLinks.asObservable();
  }

  setRightLinks(url: string) {
    if (url && url.length > 0) {
      this.http
        .get<MenuItem[]>(url)
        .toPromise()
        .then((data) => {
          this.rightLinks.next(data);
        });
    } else {
      this.rightLinks.next([]);
    }
  }
}
