import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageState } from 'src/app/main/states/message-state';
import { Recipients } from 'src/app/models';
import { AddRecipientDialog } from './add-recipient.dialog';

@Component({
  selector: 'o-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss'],
})
export class NewMessageComponent implements OnInit, OnDestroy {
  dead$ = new Subject();

  @Select(MessageState.getSelectedRecipients)
  selectedRecipient$!: Observable<Recipients[]>;
  selectedRecipient: Recipients[] = [];
  constructor(public dialog: MatDialog) {}

  ngOnDestroy(): void {
    this.dead$.next();
    this.dead$.complete();
  }
  ngOnInit(): void {
    this.selectedRecipient$.pipe(takeUntil(this.dead$)).subscribe((recipient) => {
      this.selectedRecipient = recipient;
    });
  }
  addStudents(name: string) {
    const dialogRef = this.dialog.open(AddRecipientDialog, {
      data: name,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
