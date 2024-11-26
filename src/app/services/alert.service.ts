import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '../components/alert/alert.component';
import { AuthService } from './auth.service';
import { DictionaryService } from './dictionary.service';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(
    private matSnackBar: MatSnackBar,
    private authService: AuthService,
    private dictionaryService: DictionaryService
  ) {}

  showAlert(message: string, type?: AlertType) {
    if (this.authService.isLogin) {
      this.dictionaryService
        .getTranslatedWord(message)
        .toPromise()
        .then((translatedMessage) => {
          this.openSnackBar(translatedMessage, type);
        })
        .catch((reason) => this.openSnackBar(message, type));
    } else {
      this.openSnackBar(message, type);
    }
  }
  showFormInvalidAlert() {
    this.showAlert(
      'Please provide the valid and required information.',
      AlertType.error
    );
  }
  showErrorAlert(message: string) {
    this.showAlert(message, AlertType.error);
  }

  showWarnAlert(message: string) {
    this.showAlert(message, AlertType.warn);
  }

  showSuccessAlert(message: string) {
    this.showAlert(message, AlertType.success);
  }

  private openSnackBar(translatedMessage: string, type?: AlertType) {
    let alertType = 'alert-info';
    let icon = 'info';
    switch (type) {
      case AlertType.error:
        alertType = 'alert-error';
        icon = 'error';
        break;
      case AlertType.warn:
        alertType = 'alert-warn';
        break;
      case AlertType.success:
        alertType = 'alert-success';
        break;
      default:
        break;
    }

    this.matSnackBar.openFromComponent(AlertComponent, {
      data: translatedMessage,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3 * 1000,
      panelClass: ['alert', alertType],
    });
  }
}

export enum AlertType {
  info,
  error,
  warn,
  success,
}
