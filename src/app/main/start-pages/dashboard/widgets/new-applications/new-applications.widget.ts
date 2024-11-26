import { Component, Inject, OnInit } from '@angular/core';
import { Widget } from '../../dashboard.page';

@Component({
  selector: 'o-new-applications',
  templateUrl: './new-applications.widget.html',
  styleUrls: ['./new-applications.widget.scss'],
})
export class NewApplicationsWidget implements OnInit {
  constructor(@Inject('WIDGET') public widget: Widget) {
    this.widget.refresh.subscribe((refresh) => {
      console.log('new application refresh: ' + refresh);
    });
  }

  ngOnInit(): void {}
}
