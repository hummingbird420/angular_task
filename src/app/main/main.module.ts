import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCommonModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { MainRoutingModule } from './main-routing.module';
import { MainPage } from './main.page';
import { LayoutsModule } from 'src/app/components/layouts/layouts.module';
import { TemplatesModule } from 'src/app/components/templates/templates.module';
import { ComponentModule } from './components/component.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [MainPage],
  imports: [
    CommonModule,
    MatCommonModule,
    MainRoutingModule,
    LayoutsModule,
    TemplatesModule,
    MatGridListModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    ComponentModule,
    MatDialogModule,
  ],
})
export class MainModule {}
