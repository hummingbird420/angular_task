import { Component, Inject, OnInit } from '@angular/core';
import { Widget } from '../../dashboard.page';

@Component({
  selector: 'o-default',
  templateUrl: './default.widget.html',
  styleUrls: ['./default.widget.scss'],
})
export class DefaultWidget implements OnInit {
  constructor(@Inject('WIDGET') public widget: Widget) {
    this.widget.refresh.subscribe((refresh) => {
      console.log('refresh: ' + refresh);
    });
  }

  ngOnInit(): void {}
}
