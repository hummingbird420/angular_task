import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassListPage } from './class-list/class-list.page';
import { ShoppingCartRoutingModule } from './shopping-cart-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ShoppingCartPage } from './shopping-cart.page';
import { CourseDescriptionPage } from './course-description/course-description.page';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TooltipModule } from '../components/tooltip/tooltip.module';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { DisplayCartPage } from './display-cart/display-cart.page';
import { RemoveCartItemDirective } from './display-cart/remove-cart-item.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormatClassInfoPipe } from './util/format-class-info.pipe';
import { AddCartItemDirective } from './util/add-cart-item.directive';
import { HoverItemContentDirective } from './util/hover-item-content.directive';
import { BackToClassListDirective } from './util/back-to-class-list.directive';
import { RegistrationPage } from './registration/registration.page';
import { LoginPage } from './registration/login.page';
import { CreateAccountPage } from './registration/create-account.page';
import { MatRadioModule } from '@angular/material/radio';
import { CartBasePage } from './cart-base.page';
import { CheckoutPage } from './payment/checkout.page';
import { BillingPage } from './payment/billing.page';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DisplayCartDirective } from './util/display-cart.directive';
import { MatSelectModule } from '@angular/material/select';
import { FilterDropdownComponent } from './filter-dropdown/filter-dropdown.component';
import { TranslatePipe } from './util/translate.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MatCommonModule,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { ThankyouPage } from './thankyou/thankyou.page';
import { FormatCourseNamePipe } from './util/format-course-name.pipe';
import { ClassFilterPipe } from './util/class-filter.pipe';
import { PassCodeDialog } from './pass-code/pass-code.dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UpdateStudentPage } from './registration/update-student.page';
import { AddStudentsPage } from './registration/add-students.page';
import { NgxsModule } from '@ngxs/store';
import { AddRemoveIndividualFeeDirective } from './payment/add-remove-individual-fee.directive';
import { ShoppingCartState, CartFilterState } from './cart-states';
import { ComponentModule } from '../main/components/component.module';
import { CartMultiCheckboxComponent } from './util/cart-multi-checkbox/cart-multi-checkbox.component';
import { AddStudentsDialog } from './registration/add-students.dialog';
import { AddStudentMultiplePage } from './display-cart/add-student-multiple.page';
import {
  MatMomentDateModule,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { RequestPasswordPage } from './registration/request-password.page';
import { FileUploaderComponent } from './util/file-uploader/file-uploader.component';
import { FileUploaderDialog } from './util/file-uploader/file-uploader.dialog';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TrimFileNamePipe } from './util/file-uploader/trim-file-name.pipe';
import { FileDeleteDialog } from './util/file-uploader/file-delete.dialog';
import { CartHtmlPipe } from './util/cart-html.pipe';
import { CartStickyDirective } from './util/cart-sticky.directive';
import { CartPrintDirective } from './util/cart-print.directive';
import { ShareCourseDialog } from './course-description/share-course.dialog';
import { ConfirmDialog } from './util/confirm/confirm.dialog';
import { ConfirmResetPasswordDialog } from './registration/confirm-reset-password.dialog';
import { SafeHtmlPipe } from './util/safe-html.pipe';
import { AddAllCartItemDirective } from './util/add-all-cart-item.directive';

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
    ClassListPage,
    HeaderComponent,
    FooterComponent,
    ShoppingCartPage,
    CourseDescriptionPage,
    DisplayCartPage,
    RemoveCartItemDirective,
    FormatClassInfoPipe,
    AddCartItemDirective,
    HoverItemContentDirective,
    BackToClassListDirective,
    RegistrationPage,
    LoginPage,
    CreateAccountPage,
    CartBasePage,
    CheckoutPage,
    BillingPage,
    DisplayCartDirective,
    FilterDropdownComponent,
    TranslatePipe,
    ThankyouPage,
    FormatCourseNamePipe,
    ClassFilterPipe,
    PassCodeDialog,
    UpdateStudentPage,
    AddStudentsPage,
    AddRemoveIndividualFeeDirective,
    CartMultiCheckboxComponent,
    AddStudentsDialog,
    AddStudentMultiplePage,
    RequestPasswordPage,
    FileUploaderComponent,
    FileUploaderDialog,
    TrimFileNamePipe,
    FileDeleteDialog,
    CartHtmlPipe,
    CartStickyDirective,
    CartPrintDirective,
    ShareCourseDialog,
    ConfirmDialog,
    ConfirmResetPasswordDialog,
    SafeHtmlPipe,
    AddAllCartItemDirective,
  ],
  imports: [
    CommonModule,
    MatCommonModule,
    ShoppingCartRoutingModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    TooltipModule,
    SvgIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatCommonModule,
    MatDialogModule,
    DragDropModule,
    ComponentModule,
    MatProgressBarModule,
    NgxsModule.forFeature([ShoppingCartState, CartFilterState]),
  ],
  providers: [
    FormatClassInfoPipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ShoppingCartModule {}
