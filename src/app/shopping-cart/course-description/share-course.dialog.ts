import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FieldInfo } from '../models';
import { ShoppingCartService } from '../service/shopping-cart.service';

@Component({
  templateUrl: './share-course.dialog.html',
  styleUrls: ['./share-course.dialog.scss'],
})
export class ShareCourseDialog implements OnInit {
  formGroup: FormGroup;
  formFields: FieldInfo[] = [];
  errorMessage: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private shoppingCartService: ShoppingCartService,
    private dialogRef: MatDialogRef<ShareCourseDialog>,
    @Inject(MAT_DIALOG_DATA) public dialogInfo: any
  ) {
    this.formGroup = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.initFormFields();
    this.initFormGroup();
  }

  initFormFields() {
    this.formFields = [
      {
        fieldName: 'senderName',
        fieldTitle: this.shoppingCartService.translate('Your Name'),
        fieldType: 'TEXT',
        fieldValue: '',
        required: true,
      } as FieldInfo,
      {
        fieldName: 'senderEmail',
        fieldTitle: this.shoppingCartService.translate('Your Email'),
        fieldType: 'EMAIL',
        fieldValue: '',
        required: true,
      } as FieldInfo,
      {
        fieldName: 'recipientsEmail',
        fieldTitle: this.shoppingCartService.translate('Send to Email'),
        fieldType: 'EMAIL',
        fieldValue: '',
        required: true,
      } as FieldInfo,
      {
        fieldName: 'course',
        fieldTitle: this.shoppingCartService.translate('Subject'),
        fieldType: 'TEXT',
        fieldValue: this.dialogInfo.course,
        required: true,
      } as FieldInfo,
      {
        fieldName: 'message',
        fieldTitle: this.shoppingCartService.translate('Message'),
        fieldType: 'MEMO',
        fieldValue: this.dialogInfo.courseUrl,
        required: true,
      } as FieldInfo,
    ];
  }

  initFormGroup() {
    const controls: { [key: string]: FormControl } = {};
    for (let i = 0; i < this.formFields.length; i++) {
      const field = this.formFields[i];
      const required = [];
      if (field.required) {
        required.push(this.shoppingCartService.required(field.fieldTitle));
      }
      controls[field.fieldName] = new FormControl(field.fieldValue, required);
    }
    this.formGroup = this.formBuilder.group(controls);
  }

  isInvalid(fieldName: string) {
    const control = this.formGroup.controls[fieldName];
    return control && (control.dirty || control.touched) && control.invalid;
  }
  getErrorMessage(fieldName: string): string | null {
    const control = this.formGroup.controls[fieldName];
    return control && control.errors ? control.errors.message : null;
  }

  shareCourse() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.formGroup.updateValueAndValidity();
      return;
    }
    const payload = this.formGroup.value;
    this.shoppingCartService.shareCourse(payload).subscribe(
      (response) => {
        this.dialogRef.close();
      },
      (errors) => {
        const error = errors.error.error;
        if (error.hasOwnProperty('error')) {
          const errorCode = error.error.code;
          const errorMessage = error.error.message;
          this.errorMessage = errorMessage;
        }
      }
    );
  }
}
