import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class HttpLoaderInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}
  exclodedUrl: string[] = ['widget/todays-reminders'];
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.exclodedUrl.includes(request.url)) {
      const loaderService = this.injector.get(LoaderService);
      loaderService.start();
      return next.handle(request).pipe(finalize(() => loaderService.end()));
    }
    return next.handle(request);
  }
}
