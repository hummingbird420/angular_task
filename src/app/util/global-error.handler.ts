import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { AlertService, ErrorService } from '../services';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse): void {
    const errorService = this.injector.get(ErrorService);

    let message;
    let stackTrace;

    if (error instanceof HttpErrorResponse) {
      message = errorService.getApiErrorMessage(error);
      stackTrace = errorService.getApiStack(error);
    } else {
      message = errorService.getClientErrorMessage(error);
      stackTrace = errorService.getClientStack(error);
    }

    console.error(error);
  }
}
