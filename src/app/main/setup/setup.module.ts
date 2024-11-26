import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  MatMomentDateModule,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

import {
  AccountProfilePage,
  AdditionalSetupPage,
  DisplayOptionsPage,
  OptionFilterPipe,
  PaymentPlanPage,
  PaymentSetupPage,
  SemesterInfoPage,
  SemestersPage,
  StartPageQueryPage,
  StartPageSetupPage,
  SystemOptionFilterPipe,
  SystemOptionsPage,
  UserFeaturesPage,
} from '.';

import { SetupPage } from './setup.page';

import { FlexLayoutModule } from '@angular/flex-layout';
import { TemplatesModule } from 'src/app/components/templates/templates.module';
import { UtilModule } from '../../util/util.module';
import { ComponentModule } from '../components/component.module';
import { SetupRoutingModule } from './setup-routing.module';
import { MenuCheckboxesComponent } from './user-features/menu-checkboxes.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@NgModule({
  declarations: [
    AccountProfilePage,
    UserFeaturesPage,
    SetupPage,

    PaymentPlanPage,
    SystemOptionsPage,
    SystemOptionFilterPipe,
    OptionFilterPipe,
    SemestersPage,
    SemesterInfoPage,
    DisplayOptionsPage,
    StartPageSetupPage,
    AdditionalSetupPage,
    PaymentSetupPage,
    StartPageQueryPage,
    MenuCheckboxesComponent,
  ],
  imports: [
    CommonModule,
    SetupRoutingModule,

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

    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,

    DragDropModule,
    PortalModule,
    TemplatesModule,
    UtilModule,
    ComponentModule,
  ],
  providers: [
    /* {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },*/
    //{ provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    // { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SetupModule {}
