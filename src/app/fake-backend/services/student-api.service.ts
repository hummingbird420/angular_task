import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const baseUrl = `http://localhost:4200/einstein-galactic/`;
@Injectable({ providedIn: 'root' })
export class StudentAPIService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(`${baseUrl}students`);
  }

  getById(id: string) {
    return this.http.get<any>(`${baseUrl}students/${id}`);
  }

  create(params: any) {
    return this.http.post(`${baseUrl}students`, params);
  }

  update(id: string, params: any) {
    return this.http.put(`${baseUrl}students/${id}`, params);
  }

  delete(id: string) {
    return this.http.delete(`${baseUrl}students/${id}`);
  }
  getMessageOptions() {
    return this.http.get(`${baseUrl}students-message-options`);
  }
  getMessages() {
    return this.http.get(`${baseUrl}students-messages`);
  }
}
