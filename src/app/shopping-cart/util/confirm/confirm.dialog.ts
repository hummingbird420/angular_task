import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './confirm.dialog.html',
  styleUrls: ['./confirm.dialog.scss'],
})
export class ConfirmDialog implements OnInit {
  message: string = '';
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialog, boolean>,
    @Inject(MAT_DIALOG_DATA) public dialogInfo: any
  ) {
    this.message = dialogInfo.message;
  }

  ngOnInit(): void {}
  confirm() {
    this.dialogRef.close(true);
  }
}
