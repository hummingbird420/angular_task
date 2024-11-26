import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WidgetTitleService {
  private subTitle: BehaviorSubject<string[]>;

  constructor() {
    this.subTitle = new BehaviorSubject<string[]>([]);
  }

  getSubtitles(): Observable<string[]> {
    return this.subTitle.asObservable();
  }

  setSubTitles(subTitles: string[]) {
    this.subTitle.next(subTitles);
  }
}
