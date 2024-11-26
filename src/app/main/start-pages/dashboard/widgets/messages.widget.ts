import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { takeUntil } from 'rxjs/operators';
import {
  TableColumnInfo,
  TableDataSource,
} from 'src/app/main/components/table';
import { DataTablePage } from 'src/app/main/page';
import { ApiService, AuthService } from 'src/app/services';
import { Widget } from '../dashboard.page';

interface MessageInfo {
  messageId: number;
  originalMessageId: number;
  subject: string;
  fromUserName: string;
  creationDtTm: string;
}

@Component({
  selector: 'o-messages',
  templateUrl: './widget-table-template.html',
})
export class MessagesWidget
  extends DataTablePage<MessageInfo>
  implements OnInit, OnDestroy
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
      { name: 'creationDtTm', title: 'Date', type: 'DATE' } as TableColumnInfo,
      { name: 'subject', title: 'Title', type: 'TEXT' } as TableColumnInfo,
      { name: 'fromUserName', title: 'From', type: 'TEXT' } as TableColumnInfo,
    ];
    this.widget.refresh
      .pipe(takeUntil(this.destroyed$))
      .subscribe((refresh) => {
        console.log('message refresh: ' + refresh);
        this.getMessages();
        this.runAutoRefresh();
      });
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.getMessages();
    this.runAutoRefresh();
  }

  getMessages() {
    this.apiService
      .get<MessageInfo[]>('widget/messages')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.dataSource = new TableDataSource(data);
        this.cdRef.detectChanges();
      });
  }
  runAutoRefresh() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.widget.refreshAfter > 0) {
      this.timer = setInterval(() => {
        this.getMessages();
      }, 1000 * 60 * this.widget.refreshAfter);
    }
  }
}
