import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { Component, Input, OnInit } from '@angular/core';
import { ThemeColorChooser } from './theme-color/theme-color.chooser';

@Component({
  selector: 'o-custom-field',
  templateUrl: './custom-field.component.html',
  styleUrls: ['./custom-field.component.scss'],
})
export class CustomFieldComponent implements OnInit {
  @Input()
  formControlName: string = '';
  @Input()
  customFieldId: string = '';

  constructor() {}

  ngOnInit(): void {}

  getField(): Portal<any> {
    return new ComponentPortal(ThemeColorChooser);
  }
}
