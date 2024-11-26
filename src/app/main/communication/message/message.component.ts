import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StudentAPIService } from 'src/app/fake-backend/services/student-api.service';
export interface messageBody {
  id: number;
  from: string;
  title: string;
  date: string;
}

const ELEMENT_DATA: messageBody[] = [
  { id: 1, from: 'Hydrogen', title: 'Please come by the student finance office', date: '7:30 PM' },
  { id: 2, from: 'Helium', title: 'Please come by the student finance office', date: '8:20 PM' },
  { id: 3, from: 'Lithium', title: 'Please come by the student finance office', date: '8 Sept' },
  { id: 4, from: 'Beryllium', title: 'Please come by the student finance office', date: '10 Aug' },
  { id: 5, from: 'Boron', title: 'Please come by the student finance office', date: '8 Aug' },
  { id: 6, from: 'Carbon', title: 'Please come by the student finance office', date: '8 Aug' },
  { id: 7, from: 'Nitrogen', title: 'Please come by the student finance office', date: '8 Aug' },
  { id: 8, from: 'Oxygen', title: 'Please come by the student finance office', date: '8 Aug' },
  { id: 9, from: 'Fluorine', title: 'Please come by the student finance office', date: '8 Aug' },
  { id: 10, from: 'Neon', title: 'Please come by the student finance office', date: '8 Aug' },
];
@Component({
  selector: 'o-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnDestroy {
  messageOptions: any = [];
  messageContentTypes: number = -2;
  private dead$ = new Subject();
  displayedColumns: string[] = ['id', 'from', 'title', 'date'];
  dataSource = ELEMENT_DATA;
  constructor(private fakeService: StudentAPIService) {}
  ngOnDestroy(): void {
    this.dead$.next();
    this.dead$.complete();
  }
  ngOnInit(): void {
    this.fakeService
      .getMessageOptions()
      .pipe(takeUntil(this.dead$))
      .subscribe((options: any) => {
        this.messageOptions = options;
      });
  }
  goMessageFolderPage() {}
  getOptionsContents(option: number) {
    this.messageContentTypes = option;
  }
}
