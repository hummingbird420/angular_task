import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartSetupPage } from './cart-setup/cart-setup.page';
import { CouponSetupPage } from './coupon-setup/coupon-setup.page';
import { CartLogPage } from './cart-log/cart-log.page';
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
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { UtilModule } from 'src/app/util/util.module';
import { ComponentModule } from '../../components/component.module';
import { TemplatesModule } from 'src/app/components/templates/templates.module';
import { ShoppingCartSetupRoutingModule } from './shopping-cart-setup-routing.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { TooltipModule } from 'src/app/components/tooltip/tooltip.module';

@NgModule({
  declarations: [CartSetupPage, CouponSetupPage, CartLogPage],
  imports: [
    ShoppingCartSetupRoutingModule,
    CommonModule,
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
    ClipboardModule,
    TooltipModule,
  ],
})
export class ShoppingCartSetupModule {}
