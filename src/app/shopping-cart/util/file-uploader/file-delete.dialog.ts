import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { ShoppingCartService } from '../../service/shopping-cart.service';

@Component({
  selector: 'cart-file-delete',
  templateUrl: './file-delete.dialog.html',
  styleUrls: ['./file-delete.dialog.scss'],
})
export class FileDeleteDialog implements OnInit {
  constructor(
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService,
    private dialogRef: MatDialogRef<FileDeleteDialog, any>,
    @Inject(MAT_DIALOG_DATA) public dialogInfo: any
  ) {
    this.shoppingCartService.fetchTranslatedWords([
      'Delete File',
      'Delete',
      'Cancel',
      'Are you sure you wish to delete this attachment file?',
    ]);
  }

  ngOnInit(): void {}
  delete() {
    const params = {
      fileId: '' + this.dialogInfo.fileId,
    };
    this.http
      .get('/cart/delete-file', { params: params })
      .pipe(take(1))
      .subscribe((response) => {
        this.dialogRef.close({ deleted: true });
      });
  }
}
