import { Component, Input, OnInit } from '@angular/core';
import { FormFieldsComponent } from './form-fields.component';

@Component({
  selector: 'o-dialog-form-fields',
  templateUrl: './dialog-form-fields.component.html',
  styles: [],
})
export class DialogFormFieldsComponent extends FormFieldsComponent {
  constructor() {
    super();
  }
}
