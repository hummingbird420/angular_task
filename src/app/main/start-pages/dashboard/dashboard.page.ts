import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { AfterViewInit, ChangeDetectorRef, Component, Injector, OnInit, EventEmitter } from '@angular/core';

import { map, takeUntil } from 'rxjs/operators';
import { StudentAPIService } from 'src/app/fake-backend/services/student-api.service';
import { ApiService, ApiUrl } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';

import { createBreadcrumb, Page } from '../../page';
import { DefaultWidget } from './widgets/default/default.widget';
import { MessagesWidget } from './widgets/messages.widget';
import { QueryWidget } from './widgets/query/query.widget';
import { TasksWidget } from './widgets/tasks/tasks.widget';
import { TodaysRemindersWidget } from './widgets/todays-reminders.widget';

export interface Widget {
  widgetId: string;
  title: string;
  cols: number;
  rows: number;
  collapse: boolean;
  active: boolean;
  refreshAfter: number;
  refresh: EventEmitter<boolean>;
}

export const createWidget = (
  widgetId: string,
  title: string,
  cols: number,
  rows: number,
  collapse: boolean,
  active: boolean
) => ({
  widgetId: widgetId,
  title: title,
  cols: cols,
  rows: rows,
  collapse: collapse,
  active: active,
  refreshAfter: 0,
  refresh: new EventEmitter<boolean>(false),
});
export const resizeWidget = (widget: Widget) => {
  widget.cols = 1;
};

@Component({
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage extends Page implements OnInit, AfterViewInit {
  cols: number = 2;
  rowHeight: number = 55;
  widgetsOrginal: Widget[] = [];
  widgets: Widget[] = [];
  widgetColsOrginal: Map<string, number> = new Map<string, number>();
  refreshAfterValues: number[] = [0, 1, 3, 5];
  widgetRows: number[] = [1, 2, 3];
  isViewInit: boolean = false;
  widgetContentMap: Map<string, Portal<any>> = new Map<string, Portal<any>>();
  disableColumnMenu = false;

  fakeStudents: any[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cdRef: ChangeDetectorRef,
    private dialogService: DialogService,
    private apiService: ApiService,
    private fkService: StudentAPIService
  ) {
    super();
    this.title = 'Welcome';
    this.subTitles = [createBreadcrumb('Dashboard', undefined, true)];
    this.rightLinkUrl = 'quick-links';
    this.apiService
      .get<Widget[]>(ApiUrl.admin_widgets)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        for (let index = 0; index < data.length; index++) {
          const widget = data[index];
          widget.refresh = new EventEmitter<boolean>(false);
          this.widgetColsOrginal.set(widget.widgetId, widget.cols);
          if (widget.active) this.widgets.push(widget);
          this.widgetsOrginal.push(widget);
        }
        this.cdRef.detectChanges();
      });
  }
  ngAfterViewInit(): void {
    this.isViewInit = true;
  }
  drop(event: CdkDragDrop<Widget[]>) {
    moveItemInArray(this.widgets, event.previousIndex, event.currentIndex);
  }
  ngOnInit(): void {
    this.getFakeStudents();

    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(
        map((breakPointState) => {
          if (breakPointState.matches) {
            this.cols = 1;
            this.widgets.forEach((widget) => {
              widget.cols = 1;
            });
            this.disableColumnMenu = true;
          } else {
            this.cols = 2;
            this.widgets.forEach((widget) => {
              widget.cols = this.widgetColsOrginal.get(widget.widgetId) || 1;
            });
            this.disableColumnMenu = false;
          }

          return breakPointState;
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((data) => {
        this.cdRef.detectChanges();
      });
  }

  collapseWidget(rows: number, collapse: boolean): number {
    return collapse ? 1 : rows * 5;
  }

  changeCols(cols: number): number {
    if (cols > 2) {
      cols = 2;
    }
    if (cols < 1) {
      cols = 1;
    }
    //TODO call update backend API
    return cols;
  }

  changeRows(rows: number) {
    if (!this.widgetRows.includes(rows)) {
      rows = 1;
    }
    //TODO call update backend API
    return rows;
  }

  changeRefreshAfter(widget: Widget, refreshAfter: number) {
    if (!this.refreshAfterValues.includes(refreshAfter)) {
      refreshAfter = 0;
    }
    //TODO call update backend API
    widget.refreshAfter = refreshAfter;
    widget.refresh.emit(true);
    return refreshAfter;
  }

  getRefreshAfterTitle(refreshAfter: number) {
    if (refreshAfter === 0) {
      return 'None';
    } else if (refreshAfter === 1) {
      return '1 minute';
    }
    return refreshAfter + ' minutes';
  }

  removeWidget(widgetId: string) {
    this.dialogService.confirmDelete(() => {
      this.widgetsOrginal.map((widget) => {
        if (widget.widgetId == widgetId) widget.active = false;
      });
      this.widgets.map((widget, index) => {
        if (widget.widgetId == widgetId) {
          this.widgets.splice(index, 1);
        }
      });
      this.cdRef.detectChanges();
    }, 'Are you sure you want to remove this widger?');
  }

  refreshWidget(widget: Widget) {
    widget.refresh.next(true);
  }

  getCheckedIcon(value1: number, value2: number): string {
    return value1 === value2 ? 'radio_button_checked' : 'radio_button_unchecked';
  }

  getWidgetContent(widget: Widget): Portal<any> {
    let portal = this.widgetContentMap.get(widget.widgetId);
    if (!portal) {
      const injector = Injector.create({
        providers: [{ provide: 'WIDGET', useValue: widget }],
      });
      let component;
      switch (widget.widgetId) {
        case 'std_1':
          component = TodaysRemindersWidget;
          break;
        case 'std_2':
          component = TasksWidget;
          break;
        case 'std_3':
          component = MessagesWidget;
          break;
        default:
          component = DefaultWidget;
          break;
      }
      portal = new ComponentPortal(component, null, injector);
      this.widgetContentMap.set(widget.widgetId, portal);
    }

    return portal;
  }

  getFakeStudents() {
    this.fkService
      .getAll()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((students) => {
        this.fakeStudents = students;
        console.log(this.fakeStudents);
      });
  }
  deleteStudent(e: string) {
    this.fkService
      .delete(e)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((students) => {
        console.log(this.fakeStudents);
        this.getFakeStudents();
      });
  }
}
