import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuitionSetupPage } from './tuition-setup/tuition-setup.page';
import { FeeSetupPage } from './fee-setup/fee-setup.page';
import { TuitionAndFeesRoutingModule } from './tuition-and-fees-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { UtilModule } from 'src/app/util/util.module';
import { ComponentModule } from '../../components/component.module';
import { TemplatesModule } from 'src/app/components/templates/templates.module';
import { CopyTuitionPage } from './copy-tuition/copy-tuition.page';
import { CopyFeesPage } from './copy-fees/copy-fees.page';
import { AddEditCourseFeeDialog } from './fee-setup/course-fee/add-edit-course-fee.dialog';
import {
  AddEditFeeComponent,
  FeeComponent,
  InstallmentFeeComponent,
  OnetimeFeeComponent,
  UniversalFeeComponent,
  IndividualFeeComponent,
  ProgramFeeComponent,
  DepartmentFeeComponent,
  DepartmentCourseFeeComponent,
  CourseFeeComponent,
} from './fee-setup';
import { AddEditDepartmentCourseFeeComponent } from './fee-setup/department-course-fee/add-edit-department-course-fee.component';
import { AddEditDepartmentFeeComponent } from './fee-setup/department-fee/add-edit-department-fee.component';
import { AddEditProgramFeeComponent } from './fee-setup/program-fee/add-edit-program-fee.component';
import { AddEditIndividualFeeComponent } from './fee-setup/individual-fee/add-edit-individual-fee.component';
import { AddEditUniversalFeeComponent } from './fee-setup/universal-fee/add-edit-universal-fee.component';
import { AddEditOnetimeFeeComponent } from './fee-setup/onetime-fee/add-edit-onetime-fee.component';
import { AddEditInstallmentFeeComponent } from './fee-setup/installment-fee/add-edit-installment-fee.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TuitionComponent } from './tuition-setup/tuition.component';
import { AddEditTuitionComponent } from './tuition-setup/add-edit-tuition.component';
import { CreditHourTuitionRate } from './tuition-setup/credit-hour-tuition/credit-hour-tuition.rate';
import { InstructionalHourTuitionRate } from './tuition-setup/instructional-hour-tuition/instructional-hour-tuition.rate';
import { CategoryTuitionRate } from './tuition-setup/category-tuition/category-tuition.rate';
import { CourseTuitionRate } from './tuition-setup/course-tuition/course-tuition.rate';
import { LessonTuitionRate } from './tuition-setup/lesson-tuition/lesson-tuition.rate';
import { ProgramTuitionRate } from './tuition-setup/program-tuition/program-tuition.rate';
import { ProgramCreditHourTuitionRate } from './tuition-setup/program-credit-hour-tuition/program-credit-hour-tuition.rate';
import { AddEditLessonTuitionDialog } from './tuition-setup/lesson-tuition/add-edit-lesson-tuition.dialog';
import { AddEditCategoryTuitionDialog } from './tuition-setup/category-tuition/add-edit-category-tuition.dialog';
import { AddEditCourseTuitionDialog } from './tuition-setup/course-tuition/add-edit-course-tuition.dialog';
import { AddEditProgramTuitionDialog } from './tuition-setup/program-tuition/add-edit-program-tuition.dialog';
import { TuitionRateTypePage } from './tuition-rate-type/tuition-rate-type.page';
@NgModule({
  declarations: [
    TuitionSetupPage,
    FeeSetupPage,
    CopyTuitionPage,
    CopyFeesPage,
    CourseFeeComponent,
    AddEditCourseFeeDialog,
    DepartmentCourseFeeComponent,
    DepartmentFeeComponent,
    ProgramFeeComponent,
    IndividualFeeComponent,
    UniversalFeeComponent,
    OnetimeFeeComponent,
    InstallmentFeeComponent,
    FeeComponent,
    AddEditFeeComponent,
    AddEditDepartmentCourseFeeComponent,
    AddEditDepartmentFeeComponent,
    AddEditProgramFeeComponent,
    AddEditIndividualFeeComponent,
    AddEditUniversalFeeComponent,
    AddEditOnetimeFeeComponent,
    AddEditInstallmentFeeComponent,
    TuitionComponent,
    AddEditTuitionComponent,
    CreditHourTuitionRate,
    InstructionalHourTuitionRate,
    CategoryTuitionRate,
    CourseTuitionRate,
    LessonTuitionRate,
    ProgramTuitionRate,
    ProgramCreditHourTuitionRate,
    AddEditLessonTuitionDialog,
    AddEditCategoryTuitionDialog,
    AddEditCourseTuitionDialog,
    AddEditProgramTuitionDialog,
    TuitionRateTypePage,
  ],
  imports: [
    CommonModule,
    TuitionAndFeesRoutingModule,
    MatCardModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatIconModule,
    MatTabsModule,
    MatCheckboxModule,
    MatSelectModule,
    DragDropModule,
    MatDividerModule,

    FlexLayoutModule,
    ReactiveFormsModule,
    UtilModule,
    ComponentModule,
    TemplatesModule,
  ],
})
export class TuitionAndFeesModule {}
