import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Widget } from '../../dashboard.page';

@Component({
  selector: 'o-query',
  templateUrl: './query.widget.html',
  styleUrls: ['./query.widget.scss'],
})
export class QueryWidget implements OnInit {
  destroyed$: Subject<void> = new Subject<void>();
  type: ChartType = ChartType.PieChart;
  data = [
    ['Firefox', 45.0],
    ['IE', 26.8],
    ['Chrome', 12.8],
    ['Safari', 8.5],
    ['Opera', 6.2],
    ['Others', 0.7],
  ];
  width: number = 400;
  height: number = 200;
  constructor(
    @Inject('WIDGET') public widget: Widget,
    private cdRef: ChangeDetectorRef
  ) {
    this.width = this.widget.cols * this.width;
    this.height = this.widget.rows * this.height;
    this.widget.refresh.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      this.width = this.widget.cols * this.width;
      this.height = this.widget.rows * this.height;
      this.cdRef.detectChanges();
    });
  }

  ngOnInit(): void {}
}
