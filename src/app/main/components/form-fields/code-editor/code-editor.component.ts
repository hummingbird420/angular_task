import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as ace from 'ace-builds';

@Component({
  selector: 'o-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeEditorComponent),
      multi: true,
    },
  ],
})
export class CodeEditorComponent
  implements AfterViewInit, ControlValueAccessor
{
  @ViewChild('editor') private editor!: ElementRef<HTMLElement>;
  @Input() mode: string = 'sql';

  value = '';
  onChange = (_: any) => {};
  onTouch = () => {};

  ngAfterViewInit(): void {
    ace.config.set(
      'basePath',
      'https://unpkg.com/ace-builds@1.4.12/src-min-noconflict'
    );

    const aceEditor = ace.edit(this.editor.nativeElement);

    aceEditor.setTheme('ace/theme/eclipse');

    aceEditor.setOptions({
      behavioursEnabled: true,
      cursorStyle: 'slim',
      fontFamily: 'monospace',
      fontSize: '14px',
      indentedSoftWrap: true,
      selectionStyle: 'text',
      showPrintMargin: false,
      wrap: true,
    });

    aceEditor.session.setMode('ace/mode/' + this.mode);
    aceEditor.on('change', () => {
      this.onChange(aceEditor.session.getValue());
    });
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
