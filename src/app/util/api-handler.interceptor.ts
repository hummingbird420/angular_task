import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Select } from '@ngxs/store';
import { AppState } from '../app.state';
import { concatMap, take } from 'rxjs/operators';

@Injectable()
export class ApiHandlerInterceptor implements HttpInterceptor {
  @Select(AppState.sessionId)
  sessionId$!: Observable<string | null>;

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let tenantName = this.getTenant();
    let url = this.getApiUrl(request.url);
    return this.sessionId$.pipe(
      take(1),
      concatMap((sessionId) => {
        let headers = request.headers
          .set('clientId', tenantName)
          .set('TENANT_NAME', tenantName)
          .set('secretKey', this.getKey(tenantName))
          .set('sessionId', sessionId || '')
          .set('X-Requested-With', 'XMLHttpRequest');

        const updatedRequest = request.clone({
          headers: headers,
          url: url,
          withCredentials: true,
        });
        return next.handle(updatedRequest);
      })
    );
  }

  private getKey(tenantName: string) {
    const apiInfos: any = environment.apiInfos;
    return apiInfos.hasOwnProperty(tenantName) ? apiInfos[tenantName].secretKey : null;
  }

  private getTenant(): string {
    if (environment.develop) {
      return environment.tenantName; //for Development environment only.
    }
    return window.location.hostname.split('.')[0];
  }

  private getApiUrl(requestUrl: string): string {
    // IN ANGULAR MatIconRegistry USES HttpClient CLASS FOR GETTING SVG ICON FROM THE ASSETS FOLDER.
    // WE DON'T NEED TO CONVERT THE URL TO BACKEND API URL.
    if (requestUrl.lastIndexOf('/assets/svg/') != -1) {
      return requestUrl;
    }
    if (environment.useFakeApi) {
      return 'http://localhost:4200/einstein-galactic/' + requestUrl;
    }
    let apiUrl = environment.apiUrl;
    if (!environment.develop) {
      const hostParts = window.location.hostname.split('.');
      let contextPath = 'einstein-galactic'; //Should be remove before go live.
      apiUrl = `https://${hostParts[0]}.${hostParts[1]}.com:8443/${contextPath}`;
    }
    let url = '';

    if (apiUrl.endsWith('/') && requestUrl.startsWith('/')) {
      url = apiUrl + requestUrl.substring(1);
    } else if (!apiUrl.endsWith('/') && !requestUrl.startsWith('/')) {
      url = apiUrl + '/' + requestUrl;
    } else {
      url = apiUrl + requestUrl;
    }

    return url;
  }
}
