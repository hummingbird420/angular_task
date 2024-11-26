import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { FileDeleteDialog } from './file-delete.dialog';
import { FileUploaderDialog } from './file-uploader.dialog';

@Component({
  selector: 'cart-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploaderComponent),
      multi: true,
    },
  ],
})
export class FileUploaderComponent implements OnInit, ControlValueAccessor {
  value = 0;

  onChange = (_: any) => {};

  onTouch = () => {};

  fileName: string | null = null;
  fileId: string | null = null;
  isUploaded: boolean = false;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  writeValue(obj: number): void {
    const normalizeValue = obj == null ? 0 : obj;
    this.value = normalizeValue;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  uploadFile() {
    const dialogRef = this.dialog.open(FileUploaderDialog, {
      maxWidth: 'calc(100vw - 8px)',
      disableClose: true,
      closeOnNavigation: true,
      autoFocus: false,
      data: {},
    });
    dialogRef
      .beforeClosed()
      .pipe(take(1))
      .subscribe((data) => {
        console.log('data: ', data);
        if (data && data.fileName && data.fileId) {
          this.isUploaded = true;
          this.fileName = data.fileName;
          this.fileId = data.fileId;
          this.onChange(data.fileId);
        }
      });
  }
  deleteFile() {
    let fileId = this.fileId || '0';
    const lastIndex = fileId.indexOf(';');
    if (lastIndex && lastIndex > -1) {
      fileId = fileId.substring(0, lastIndex);
    }
    const dialogRef = this.dialog.open(FileDeleteDialog, {
      maxWidth: 'calc(100vw - 8px)',
      disableClose: true,
      closeOnNavigation: true,
      autoFocus: false,
      data: {
        fileId: fileId,
      },
    });
    dialogRef
      .beforeClosed()
      .pipe(take(1))
      .subscribe((data) => {
        console.log('data: ', data);
        if (data && data.deleted) {
          this.isUploaded = false;
          this.fileName = null;
          this.fileId = null;
          this.onChange(null);
        }
      });
  }
}
