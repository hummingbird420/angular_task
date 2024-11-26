import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartPage } from './start.page';
import { DashboardPage } from './dashboard/dashboard.page';
import { StartPageRoutingModule } from './start-page-routing.module';
import { LayoutsModule } from 'src/app/components/layouts/layouts.module';
import { TemplatesModule } from 'src/app/components/templates/templates.module';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { DefaultWidget } from './dashboard/widgets/default/default.widget';
import { NewApplicationsWidget } from './dashboard/widgets/new-applications/new-applications.widget';
import { MessagesWidget } from './dashboard/widgets/messages.widget';
import { PortalModule } from '@angular/cdk/portal';
import { MatRippleModule } from '@angular/material/core';
import { GoogleChartsModule } from 'angular-google-charts';
import { QueryWidget } from './dashboard/widgets/query/query.widget';
import { MatBadgeModule } from '@angular/material/badge';
import { WidgetTableWidget } from './dashboard/widgets/widget-table/widget-table.widget';
import { ComponentModule } from '../components/component.module';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { TodaysRemindersWidget } from './dashboard/widgets/todays-reminders.widget';
import { TasksWidget } from './dashboard/widgets/tasks/tasks.widget';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    StartPage,
    DashboardPage,
    DefaultWidget,
    NewApplicationsWidget,
    MessagesWidget,
    QueryWidget,
    WidgetTableWidget,
    TodaysRemindersWidget,
    TasksWidget,
  ],
  imports: [
    CommonModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    DragDropModule,
    MatDividerModule,
    PortalModule,
    MatRippleModule,
    GoogleChartsModule,
    MatBadgeModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    StartPageRoutingModule,
    LayoutsModule,
    TemplatesModule,
    ComponentModule,
  ],
})
export class StartPageModule {}
