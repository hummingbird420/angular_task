import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent, MainHeaderComponent, MainNavComponent, MainWidgetComponent } from '.';
import { TableDataDecoderPipe } from './table';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UtilModule } from 'src/app/util/util.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TableComponent } from './table/table.component';
import { CustomFieldComponent } from './custom-field/custom-field.component';
import { FormFieldsComponent } from './form-fields/form-fields.component';
import { MatRadioModule } from '@angular/material/radio';
import { ThemeColorChooser } from './custom-field/theme-color/theme-color.chooser';
import { RichEditorComponent } from './form-fields/rich-editor/rich-editor.component';
import { FileUploaderComponent } from './form-fields/file-uploader/file-uploader.component';
import { ListFieldComponent } from './form-fields/list-field/list-field.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MultiCheckboxComponent } from './form-fields/multi-checkbox/multi-checkbox.component';
import { TextFieldComponent } from './form-fields/text-field/text-field.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NumberDirective } from './form-fields/number.directive';
import { NumberFieldComponent } from './form-fields/number-field/number-field.component';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { TooltipModule } from 'src/app/components/tooltip/tooltip.module';
import { EditDelIconComponent } from './edit-del-icon/edit-del-icon.component';
import { EditDelIconDirective } from './edit-del-icon/edit-del-icon.directive';
import { RecordTemplateActionBarComponent } from './record-template-action-bar/record-template-action-bar.component';
import { CodeEditorComponent } from './form-fields/code-editor/code-editor.component';
import { DndFieldComponent } from './form-fields/dnd-field/dnd-field.component';
import { DialogFormFieldsComponent } from './form-fields/dialog-form-fields.component';
import { PaginatorButtonDirective } from './table/paginator-button.directive';
import { MessageBoxComponent } from './message-box/message-box.component';
import { ContentWidgetComponent } from './content-widget/content-widget.component';
import { HtmlSanitizerDirective } from './html-sanitizer.directive';
import { ClipboardCopyComponent } from './clipboard-copy/clipboard-copy.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MessageRecipientHeaderComponent } from './message-recipient/message-recipient-header.component';
import { MessageRecipientBodyComponent } from './message-recipient/message-recipient-body.component';
import { FilterDropdownComponent } from './filter-dropdown/filter-dropdown.component';

@NgModule({
  declarations: [
    MainHeaderComponent,
    MainLayoutComponent,
    MainNavComponent,
    MainWidgetComponent,
    ContentWidgetComponent,

    TableDataDecoderPipe,
    TableComponent,
    CustomFieldComponent,
    FormFieldsComponent,
    ThemeColorChooser,
    RichEditorComponent,
    FileUploaderComponent,
    ListFieldComponent,
    MultiCheckboxComponent,
    TextFieldComponent,
    NumberDirective,
    NumberFieldComponent,
    ActionBarComponent,
    EditDelIconComponent,
    EditDelIconDirective,
    RecordTemplateActionBarComponent,
    CodeEditorComponent,
    DndFieldComponent,
    DialogFormFieldsComponent,
    PaginatorButtonDirective,
    MessageBoxComponent,
    HtmlSanitizerDirective,
    ClipboardCopyComponent,
    MessageRecipientHeaderComponent,
    MessageRecipientBodyComponent,
    FilterDropdownComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    DragDropModule,
    PortalModule,

    MatCommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatCardModule,
    MatSidenavModule,

    MatIconModule,
    MatRippleModule,
    MatListModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    EditorModule,
    TooltipModule,
    UtilModule,
    ClipboardModule,
  ],
  exports: [
    MainHeaderComponent,
    MainLayoutComponent,
    MainNavComponent,
    MainWidgetComponent,
    TableComponent,
    TableDataDecoderPipe,
    CustomFieldComponent,
    FormFieldsComponent,
    ActionBarComponent,
    NumberDirective,
    DndFieldComponent,
    DialogFormFieldsComponent,
    MessageBoxComponent,
    ContentWidgetComponent,
    ClipboardCopyComponent,
    MultiCheckboxComponent,
    RichEditorComponent,
    MessageRecipientHeaderComponent,
    MessageRecipientBodyComponent,
  ],
})
export class ComponentModule {}
