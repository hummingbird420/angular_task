import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ShoppingCartService } from '../service/shopping-cart.service';

@Component({
  selector: 'o-pass-code',
  templateUrl: './pass-code.dialog.html',
  styleUrls: ['./pass-code.dialog.scss'],
})
export class PassCodeDialog {
  title: string = 'Enter Passcode';
  addButtonLabel: string = 'Submit';
  closeButtonLabel = 'Cancel';
  addIcon: string = 'check';
  formGroup: FormGroup;
  private _submitEmitter: EventEmitter<string> = new EventEmitter<string>();
  onSubmit(): EventEmitter<string> {
    return this._submitEmitter;
  }
  constructor(private formBuilder: FormBuilder, private shoppingCartService: ShoppingCartService) {
    this.formGroup = this.formBuilder.group({
      passCode: new FormControl('', [
        this.shoppingCartService.required(this.shoppingCartService.translate('Passcode')),
      ]),
    });
  }

  submit() {
    if (this.formGroup.valid) {
      this._submitEmitter.emit(this.formGroup.controls['passCode'].value);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
  onClose() {
    this.formGroup.markAllAsTouched();
    return this._submitEmitter;
  }
  invalidate() {
    this.formGroup.controls['passCode'].setErrors({
      invalid: true,
      message: 'Invalid passcode.',
    });
  }

  isInvalid(passCode: string) {
    const field = this.formGroup.controls[passCode];
    return field !== null && field.invalid && (field.dirty || field.touched);
  }
  getErrorMessage(fieldName: string): string | null {
    const control = this.formGroup.controls[fieldName];
    if (control && control.errors) {
      return control.errors.message;
    }
    return null;
  }
}
