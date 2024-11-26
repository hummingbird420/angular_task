import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'o-file-uploader',
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

  constructor() {}

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

  uploadFile() {}
  deleteFile() {}
}
