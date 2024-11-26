import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DefaultTableCell, TableColumnInfo, TableDataSource } from 'src/app/main/components/table';
import { MessageState } from 'src/app/main/states/message-state';
import { Columns, NavigationField, RecipientInfo, Recipients, SortedFieldInfo } from 'src/app/models';
import { DropDownModel } from 'src/app/models/filter-dropdown';
import { AlertService, DictionaryService } from 'src/app/services';

export class RecipientTableCell extends DefaultTableCell {
  constructor(private dictionaryService: DictionaryService) {
    super();
  }
  // getLink(column: TableColumnInfo, info: Recipients): string {
  //   if (column.name === 'campusName') {
  //     return '/setup/customization/campus-info/' + info.campusId;
  //   }
  //   return '';
  // }
  getValue(column: TableColumnInfo, info: any): string | number {
    if (column.name == 'statusText') {
      return info.isActive == 1
        ? this.dictionaryService.getTranslationOrWord('Active')
        : info.isActive == 2
        ? this.dictionaryService.getTranslationOrWord('Archived')
        : '';
    } else {
      return super.getValue(column, info);
    }
  }
}

@Component({
  selector: 'add-recipient.dialog',
  templateUrl: './add-recipient.dialog.html',
  styleUrls: ['./add-recipient.dialog.scss'],
})
export class AddRecipientDialog implements OnInit, OnDestroy {
  dead$ = new Subject();
  @Select(MessageState.getRecipientNavigation)
  recipientNavigation$!: Observable<NavigationField>;
  navigationSource!: NavigationField;

  @Select(MessageState.getRecipientColumns)
  recipientTableColumns$!: Observable<TableColumnInfo[]>;
  recipientTableColumns!: TableColumnInfo[];

  @Select(MessageState.getRecipientRow)
  recipientTableContents$!: Observable<Recipients[]>;
  recipientTableContents!: Recipients[];

  @Select(MessageState.getSelectedRecipients)
  selectedRecipient$!: Observable<Recipients[]>;
  selectedRecipient: Recipients[] = [];

  @Select(MessageState.getCampusField)
  recipientCampusField$!: Observable<DropDownModel>;
  recipientCampusField!: DropDownModel;

  dataSource: TableDataSource<Recipients> = new TableDataSource<Recipients>();
  tableCell: RecipientTableCell = new RecipientTableCell(this.dictionaryService);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private dictionaryService: DictionaryService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<AddRecipientDialog>
  ) {}

  ngOnInit(): void {
    this.recipientNavigation$.pipe(takeUntil(this.dead$)).subscribe((nav) => (this.navigationSource = nav));
    this.recipientTableColumns$
      .pipe(takeUntil(this.dead$))
      .subscribe((columns) => (this.recipientTableColumns = columns));

    this.recipientTableContents$.pipe(takeUntil(this.dead$)).subscribe((contents) => {
      this.recipientTableContents = contents;
      this.dataSource = new TableDataSource(contents, this.tableCell);
    });
    this.selectedRecipient$.pipe(takeUntil(this.dead$)).subscribe((recipient) => {
      this.selectedRecipient = recipient;
    });
    this.recipientCampusField$.pipe(takeUntil(this.dead$)).subscribe((campus) => {
      this.recipientCampusField = campus;
    });
  }

  ngOnDestroy(): void {
    this.dead$.next();
    this.dead$.complete();
  }
  addRecipient() {
    if (this.selectedRecipient.length == 0) {
      this.alertService.showWarnAlert('Select minimum one recipient!');
    } else {
      this.dialogRef.close();
    }
  }
}
