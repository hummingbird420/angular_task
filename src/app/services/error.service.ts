import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor() {}

  getClientErrorMessage(error: Error): string {
    if (!navigator.onLine) {
      return 'No Internet Connection';
    }
    return error.message ? error.message : error.toString();
  }

  getClientStack(error: Error): string | undefined {
    return error.stack;
  }

  getApiErrorMessage(error: HttpErrorResponse): string {
    return error.message;
  }

  getApiStack(error: HttpErrorResponse): string {
    // TODO handle stack trace
    return 'stack';
  }
}
