import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomizationRoutingModule } from './customization-routing.module';
import { MatCommonModule, MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { TemplatesModule } from 'src/app/components/templates/templates.module';
import { UtilModule } from 'src/app/util/util.module';
import { ComponentModule } from '../../components/component.module';
import {
  CustomizationPage,
  ListcodePage,
  ResponseSetPage,
  ResponseSetsPage,
  SetupItemFilterPipe,
  ClassroomDetailsPage,
  ClassroomsPage,
  StudentBatchPage,
  CurriculumsPage,
  CurriculumPage,
  DepartmentDetailsPage,
  DepartmentsPage,
  DictionaryPage,
  LanguagePage,
  PhrasesPage,
  CourseCategoryPage,
  CoursesPage,
  CourseInfoPage,
  SearchCoursePage,
  SearchCourseResultPage,
  CourseRecordTemplatePage,
  AddEditTabDialog,
  EditStandardFieldDialog,
  CampusesPage,
  CampusDetailsPage,
  CampusRecordTemplatePage,
  ProgramsPage,
  ProgramInfoPage,
} from '.';

@NgModule({
  declarations: [
    CustomizationPage,
    ListcodePage,
    SetupItemFilterPipe,
    StudentBatchPage,
    ClassroomsPage,
    ClassroomDetailsPage,
    ResponseSetsPage,
    ResponseSetPage,
    CurriculumsPage,
    CurriculumPage,
    DepartmentsPage,
    DepartmentDetailsPage,

    DictionaryPage,
    LanguagePage,
    PhrasesPage,

    CourseCategoryPage,
    CoursesPage,
    CourseInfoPage,
    SearchCoursePage,
    SearchCourseResultPage,
    CourseRecordTemplatePage,
    AddEditTabDialog,
    EditStandardFieldDialog,

    CampusesPage,
    CampusDetailsPage,
    CampusRecordTemplatePage,

    ProgramInfoPage,
    ProgramsPage,
  ],
  imports: [
    CommonModule,
    CustomizationRoutingModule,
    MatCommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,

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
    MatExpansionModule,
    MatRadioModule,

    DragDropModule,
    PortalModule,

    TemplatesModule,
    UtilModule,
    ComponentModule,
  ],
})
export class CustomizationModule {}
