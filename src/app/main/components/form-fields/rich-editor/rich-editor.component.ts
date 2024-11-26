import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const useDarkMode: boolean = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches;

const plugins = [
  'print',
  'preview',
  'paste',
  'importcss',
  'searchreplace',
  'autolink',
  'autosave',
  'save',
  'directionality',
  'code',
  'visualblocks',
  'visualchars',
  'fullscreen',
  'image',
  'link',
  'media',
  'template',
  'codesample',
  'table',
  'charmap',
  'hr',
  'pagebreak',
  'nonbreaking',
  'anchor',
  'toc',
  'insertdatetime',
  'advlist',
  'lists',
  'wordcount',
  'imagetools',
  'textpattern',
  'noneditable',
  'help',
  'charmap',
  'quickbars',
  'emoticons',
];
const menubar = 'file edit view insert format tools table help';
const toolbars = [
  'undo redo cut copy paste',
  'formatselect',
  'fontselect',
  'fontsizeselect',
  'bold italic underline strikethrough',
  'alignleft aligncenter alignright alignjustify',
  'outdent indent',
  'numlist bullist',
  'forecolor backcolor removeformat',
  'pagebreak',
  'charmap emoticons',
  'fullscreen  preview save print',
  'insertfile image media template link anchor codesample',
  'ltr rtl',
];
const quickBar = [
  'bold italic underline strikethrough',
  'h1 h2 h3 h4',
  'forecolor backcolor removeformat',
  'quicklink blockquote quickimage quicktable',
];

const contextMenu = ['cut copy paste', 'link image imagetools table'];

const templateCreationDateFormat =
  '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]';
const templateModifiedDateFormat =
  '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]';

const filePickerCallback = (
  callback: (source: string, options: any) => void,
  value: any,
  meta: any
) => {
  /* Provide file and text for the link dialog */
  if (meta.filetype === 'file') {
    callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
  }

  /* Provide image and alt text for the image dialog */
  if (meta.filetype === 'image') {
    callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
  }

  /* Provide alternative source and posted for the media dialog */
  if (meta.filetype === 'media') {
    callback('movie.mp4', {
      source2: 'alt.ogg',
      poster: 'https://www.google.com/logos/google.jpg',
    });
  }
};

const contentStyle =
  'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }';

@Component({
  selector: 'o-rich-editor',
  templateUrl: './rich-editor.component.html',
  styleUrls: ['./rich-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichEditorComponent),
      multi: true,
    },
  ],
})
export class RichEditorComponent implements ControlValueAccessor {
  initOptions = {
    base_url: '/tinymce',
    suffix: '.min',
    plugins: plugins.join(' | '),

    toolbar: toolbars.join(' | '),
    toolbar_mode: 'sliding',
    toolbar_sticky: true,

    contextmenu: contextMenu.join(' | '),
    menubar: menubar,
    quickbars_selection_toolbar: quickBar.join(' | '),

    imagetools_cors_hosts: ['picsum.photos'],
    image_advtab: true,
    image_caption: true,

    file_picker_callback: filePickerCallback,
    templates: [],
    template_cdate_format: templateCreationDateFormat,
    template_mdate_format: templateModifiedDateFormat,

    noneditable_noneditable_class: 'mceNonEditable',
    skin: useDarkMode ? 'oxide-dark' : 'oxide',

    importcss_append: true,
    content_css: useDarkMode ? 'dark' : 'default',
    content_style: contentStyle,
  };

  value = '';

  onChange = (_: any) => {};

  onTouch = () => {};

  constructor() {}

  writeValue(obj: any): void {
    const normalizeValue = obj == null ? '' : obj;
    this.value = normalizeValue;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
