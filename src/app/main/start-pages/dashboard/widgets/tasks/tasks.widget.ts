import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { TableDataSource } from 'src/app/main/components/table';
import { DataTablePage } from 'src/app/main/page';
import { ApiService } from 'src/app/services';
import { Widget } from '../../dashboard.page';

interface TaskInfo {
  aboutUserId: number;
  aboutUserType: number;
  aboutUserName: string;
  staffNote: string;
}
@Component({
  selector: 'o-tasks',
  templateUrl: './tasks.widget.html',
  styleUrls: [
    './tasks.widget.scss',
    './../widget-table/widget-table.widget.scss',
  ],
})
export class TasksWidget extends DataTablePage<TaskInfo> implements OnInit {
  displayedColumns: string[] = ['completed', 'note', 'view'];
  timer!: NodeJS.Timeout;
  constructor(
    @Inject('WIDGET') public widget: Widget,
    private apiService: ApiService,
    private cdRef: ChangeDetectorRef
  ) {
    super();
    this.widget.refresh
      .pipe(takeUntil(this.destroyed$))
      .subscribe((refresh) => {
        console.log('tasks refresh: ' + refresh);
        this.getTasks();
        this.runAutoRefresh();
      });
  }

  ngOnInit(): void {
    this.getTasks();
    this.runAutoRefresh();
  }

  getTasks() {
    this.apiService
      .get<TaskInfo[]>('widget/tasks')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((tasks) => {
        this.dataSource = new TableDataSource(tasks);
      });
  }

  getRelationLink(taskInfo: TaskInfo) {
    return [];
  }
  runAutoRefresh() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.widget.refreshAfter > 0) {
      this.timer = setInterval(() => {
        this.getTasks();
      }, 1000 * 60 * this.widget.refreshAfter);
    }
  }
}
