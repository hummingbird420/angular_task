import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../service/shopping-cart.service';

@Component({
  templateUrl: './confirm-reset-password.dialog.html',
  styleUrls: ['./confirm-reset-password.dialog.scss'],
})
export class ConfirmResetPasswordDialog {
  constructor(
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private dialogRef: MatDialogRef<ConfirmResetPasswordDialog, boolean>
  ) {}

  resetPassword(reset: boolean) {
    if (reset) {
      this.shoppingCartService.goToRequestPasswordPage(this.router);
    } else {
      this.shoppingCartService.goLoginPage(this.router);
    }
    this.dialogRef.close(reset);
  }
}
