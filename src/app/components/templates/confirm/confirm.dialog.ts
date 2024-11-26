import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'o-confirm',
  templateUrl: './confirm.dialog.html',
  styleUrls: ['./confirm.dialog.scss'],
})
export class ConfirmDialog implements OnInit, OnDestroy {
  dialogTitle: string = 'Confirmation';
  yesButtonLabel: string = 'Yes';
  closeButtonLabel: string = 'Cancel';
  defaultMessage: string = 'Are you sure you wish to remove it?';

  subscription?: Subscription;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public message: string
  ) {
    if (!this.message) this.message = this.defaultMessage;
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    const routerSubscription = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        filter(() => !!this.dialogRef)
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
    if (this.subscription) {
      this.subscription.add(routerSubscription);
    } else {
      this.subscription = routerSubscription;
    }
  }
  confirmYes() {
    this.dialogRef.close(true);
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
