import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { RecipientInfo, SortedFieldInfo } from '../models';
import { DropDownModel } from '../models/filter-dropdown';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private http: HttpClient) {}
  getRecipient(): Observable<RecipientInfo> {
    return this.http.get<RecipientInfo>('/messages-recipient/type-fake');
  }
  getFilterDropdown(): Observable<DropDownModel> {
    return this.http.get<DropDownModel>('/messages-recipient-dropdown/type-fake');
  }
}
