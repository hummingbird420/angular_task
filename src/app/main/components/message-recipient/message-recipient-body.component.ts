import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Columns, Recipients } from 'src/app/models';
import { UpdateSelectedRecipient } from '../../states/message-state';

@Component({
  selector: 'o-message-recipient-body',
  templateUrl: './message-recipient-body.component.html',
  styleUrls: ['./message-recipient-body.component.scss'],
})
export class MessageRecipientBodyComponent implements OnInit {
  @Input() tableColumns: Columns[] = [];
  @Input() dataSource: Recipients[] = [];
  @Input() pageSize: number = 0;
  displayedColumns: string[] = ['select'];

  selectedRecipients: string[] = [];

  selection = new SelectionModel<Recipients>(true, []);
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.tableColumns.forEach((value) => {
      this.displayedColumns.push(value.name);
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  checkboxLabel(row?: Recipients): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    this.store.dispatch(new UpdateSelectedRecipient(this.selection['_selected']));
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.idNumber + 1}`;
  }
}
