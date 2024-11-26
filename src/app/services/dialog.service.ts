import { Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { ConfirmDialog } from '../components/templates/confirm/confirm.dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  confirmDelete(
    yes: () => void,
    message?: string,
    no?: () => void
  ): MatDialogRef<ConfirmDialog, any> {
    if (!message) {
      message = 'Are you sure you wish to delete this?';
    }
    const options = DialogService.getOptions();
    options.data = message;
    const dialogRef = this.dialog.open(ConfirmDialog, options);
    dialogRef
      .beforeClosed()
      .pipe(take(1))
      .subscribe((response) => {
        if (response) {
          yes();
        } else if (no) {
          no();
        }
      });

    return dialogRef;
  }

  static getOptions(): MatDialogConfig {
    return {
      disableClose: true,
      closeOnNavigation: true,
      autoFocus: false,
    };
  }
}
