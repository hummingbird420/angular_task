import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SetupItemInfo } from '../models/setup-item-info';

@Injectable({
  providedIn: 'root'
})
export class SetupService {

  constructor(private http: HttpClient) { }

  getSetupItems() {
    return this.http.get<SetupItemInfo[]>('setup-items');
  }
}
