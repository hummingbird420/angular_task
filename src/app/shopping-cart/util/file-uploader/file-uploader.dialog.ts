import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ShoppingCartService } from '../../service/shopping-cart.service';

@Component({
  selector: 'o-file-uploader',
  templateUrl: './file-uploader.dialog.html',
  styleUrls: ['./file-uploader.dialog.scss'],
})
export class FileUploaderDialog implements OnInit {
  fileName = '';
  file!: File;
  uploadProgress: number = 0;
  uploadSub: Subscription | null = null;
  errorMessage: string = '';
  shakeError = false;

  maxFileSize: number = 50 * 1024 * 1024; // 50 * 1024 * 1024

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<FileUploaderDialog, any>,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit(): void {}

  onFileSelected(event: any) {
    console.log('selected: ', event);
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      this.file = file;
    }
  }

  upload() {
    this.shakeError = false;
    if (this.isValidFile()) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('description', 'STUDENT_FILE');
      const upload$ = this.http
        .post('/cart/upload-file', formData, {
          reportProgress: true,
          observe: 'events',
        })
        .pipe(finalize(() => this.reset()));

      this.uploadSub = upload$.subscribe(
        (event: any) => this.monitorProgress(event),
        (errors) => this.handleAPIError(errors)
      );
    }
  }

  private isValidFile(): boolean {
    let isValid: boolean = true;

    if (!this.file) {
      isValid = false;
      this.showValidationError('Please choose file to upload.');
    } else if (this.file.size <= 0) {
      isValid = false;
      this.showValidationError('File size should be grater than 0.');
    } else if (this.file.size > this.maxFileSize) {
      isValid = false;
      this.showValidationError('Maximum file size should be 50MB.');
    }

    if (isValid) {
      this.errorMessage = '';
    }

    return isValid;
  }

  private showValidationError(message: string): void {
    if (this.errorMessage) {
      this.shakeError = true;
      setTimeout(() => (this.shakeError = false), 900);
    }
    this.errorMessage = message;
  }

  private monitorProgress(event: any) {
    if (event.type == HttpEventType.UploadProgress) {
      this.uploadProgress = Math.round(100 * (event.loaded / event.total));
    } else if (event.type == HttpEventType.Response) {
      let fileArray = event.body.fileId.split(';');
      let fileId = parseInt(fileArray.length > 0 ? fileArray[0] : '0');
      fileId = isNaN(fileId) ? 0 : fileId;
      const data = {
        fileId: fileId,
        fileName: this.fileName,
      };
      this.dialogRef.close(data);
    }
  }
  private handleAPIError(errors: any) {
    const error = errors.error.error;
    if (error.hasOwnProperty('error')) {
      const errorMessage = error.error.message;
      this.errorMessage = errorMessage;
    }
  }

  private reset() {
    this.uploadProgress = 0;
    this.uploadSub?.unsubscribe();
    this.uploadSub = null;
  }
}
