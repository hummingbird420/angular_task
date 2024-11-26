import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { takeUntil } from 'rxjs/operators';
import {
  TableColumnInfo,
  TableDataSource,
} from 'src/app/main/components/table';
import { DataTablePage } from 'src/app/main/page';
import { ApiService, AuthService } from 'src/app/services';
import { Widget } from '../dashboard.page';

interface ReminderInfo {
  reminderDtTm: string;
  aboutUserFullName: string;
  reminderNote: string;
}

@Component({
  selector: 'o-todays-reminders',
  templateUrl: './widget-table-template.html',
})
export class TodaysRemindersWidget
  extends DataTablePage<ReminderInfo>
  implements OnInit
{
  timer!: NodeJS.Timeout;
  constructor(
    @Inject('WIDGET') public widget: Widget,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats,
    private apiService: ApiService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) {
    super();
    this.setDateFormat(this.dateFormats, this.authService);
    this.columns = [
      { name: 'reminderDtTm', title: 'Date', type: 'DATE' } as TableColumnInfo,
      {
        name: 'aboutUserFullName',
        title: 'Person',
        type: 'TEXT',
      } as TableColumnInfo,
      { name: 'reminderNote', title: 'Note', type: 'TEXT' } as TableColumnInfo,
    ];
    this.widget.refresh
      .pipe(takeUntil(this.destroyed$))
      .subscribe((refresh) => {
        console.log('reminder refresh: ' + refresh);
        this.getTodaysReminders();
        this.runAutoRefresh();
      });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.getTodaysReminders();
    this.runAutoRefresh();
  }

  getTodaysReminders() {
    this.apiService
      .get<ReminderInfo[]>('widget/todays-reminders')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.dataSource = new TableDataSource(data);
        this.cdRef.detectChanges();
        console.log('reminders list updated...');
      });
  }

  runAutoRefresh() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.widget.refreshAfter > 0) {
      this.timer = setInterval(() => {
        this.getTodaysReminders();
      }, 1000 * 60 * this.widget.refreshAfter);
    }
  }
}
