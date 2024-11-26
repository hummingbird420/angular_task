import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StudentAPIService } from 'src/app/fake-backend/services/student-api.service';

@Component({
  selector: 'o-message-body',
  templateUrl: './message-body.component.html',
  styleUrls: ['./message-body.component.scss'],
})
export class MessageBodyComponent implements OnInit {
  @Input() listTypes!: number;
  displayedColumns: string[] = [];
  displayedHeader: any[] = [];
  dataSource = [];
  dead$ = new Subject();
  constructor(private fakeService: StudentAPIService) {}
  ngOnDestroy(): void {
    this.dead$.next();
    this.dead$.complete();
  }

  ngOnInit(): void {
    console.log(this.listTypes);
    this.fakeService
      .getMessages()
      .pipe(takeUntil(this.dead$))
      .subscribe((options: any) => {
        this.displayedHeader = options.columns;
        this.displayedHeader.forEach((element: any) => {
          this.displayedColumns.push(element.name);
        });
        this.dataSource = options.messages;
        console.log(this.displayedHeader);
        console.log(this.displayedColumns);
        console.log(this.dataSource);
      });
  }
}
