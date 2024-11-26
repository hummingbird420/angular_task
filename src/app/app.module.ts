import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ApiErrorInterceptor, ApiHandlerInterceptor, HttpLoaderInterceptor } from './util';
import { GlobalErrorHandler } from './util/global-error.handler';
import { MatDialogModule } from '@angular/material/dialog';
import { E404Page } from './errors/e404.page';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AlertComponent } from './components/alert/alert.component';
import { MatIconModule } from '@angular/material/icon';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { environment } from 'src/environments/environment';
import { AppState } from './app.state';
import { fakeBackendProvider } from './fake-backend/helper/student-api.helper';
import { MessageState } from './main/states/message-state';

@NgModule({
  declarations: [AppComponent, E404Page, AlertComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
    AppRoutingModule,
    MatDialogModule,
    MatIconModule,
    NgxsModule.forRoot([AppState, MessageState], {
      developmentMode: environment.develop,
      selectorOptions: {
        suppressErrors: false,
      },
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({ name: 'ONGXS', disabled: environment.production || false }),
  ],
  providers: [
    Title,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiHandlerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiErrorInterceptor,
      multi: true,
    },
    DatePipe,
    TitleCasePipe,
    fakeBackendProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
