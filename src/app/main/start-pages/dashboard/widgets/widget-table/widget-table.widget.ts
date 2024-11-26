import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TableComponent } from 'src/app/main/components/table';

@Component({
  selector: 'o-widget-table',
  templateUrl: './widget-table.widget.html',
  styleUrls: ['./widget-table.widget.scss'],
})
export class WidgetTableWidget<T>
  extends TableComponent<T>
  implements OnInit, OnDestroy
{
  constructor(protected cdRef: ChangeDetectorRef) {
    super(cdRef);
  }
}
