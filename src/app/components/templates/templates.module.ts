import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';

import { AlphaPaginatorComponent, MultiSelectComponent } from '../templates';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { UtilModule } from 'src/app/util/util.module';
import { DropdownComponent } from './dropdown/dropdown.component';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { ConfirmDialog } from './confirm/confirm.dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { PortalDialog } from './dialogs/portal.dialog';
import { AddEditDialog } from './dialogs/add-edit.dialog';
import { PortalModule } from '@angular/cdk/portal';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { SucessComponent } from './status/sucess/sucess.component';
@NgModule({
  declarations: [
    AlphaPaginatorComponent,
    MultiSelectComponent,
    DropdownComponent,

    ConfirmDialog,
    PortalDialog,
    AddEditDialog,
    SucessComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatCommonModule,
    MatCardModule,
    MatIconModule,
    MatRippleModule,
    MatListModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatDatepickerModule,
    MatMomentDateModule,
    DragDropModule,
    PortalModule,
    MatCheckboxModule,
    MatRadioModule,
    UtilModule,
  ],
  exports: [AlphaPaginatorComponent, MultiSelectComponent, DropdownComponent],
})
export class TemplatesModule {}
