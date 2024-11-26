import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import {
  DefaultTableCell,
  TableColumnInfo,
} from 'src/app/main/components/table';
import { CategoryTuitionRateInfo } from 'src/app/models/tuition-rate.info';
import { AlertService, ApiService, DictionaryService } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { TuitionComponent } from '../tuition.component';
import { AddEditCategoryTuitionDialog } from './add-edit-category-tuition.dialog';

export class CategoryTuitionRateTableCell extends DefaultTableCell {
  getValue(
    column: TableColumnInfo,
    info: CategoryTuitionRateInfo
  ): string | number {
    switch (column.name) {
      case 'standardRate':
        return info.tuitionRates['tuitionRate0'] || 0;
      case 'auditdRate':
        return info.tuitionRates['tuitionRate-1'] || 0;
      case 'reTakeRate':
        return info.tuitionRates['tuitionRate-2'] || 0;
      default:
        if (column.name.startsWith('tuitionRate')) {
          return info.tuitionRates[column.name] || 0;
        }
        return super.getValue(column, info);
    }
  }
}

@Component({
  selector: 'o-category-tuition',
  templateUrl: './../tuition.component.html',
})
export class CategoryTuitionRate
  extends TuitionComponent<CategoryTuitionRateInfo>
  implements OnInit
{
  constructor(
    protected apiService: ApiService,
    private dialog: MatDialog,
    private dictionaryService: DictionaryService,
    private dialogService: DialogService,
    private alertService: AlertService,
    private cdRef: ChangeDetectorRef
  ) {
    super(apiService);
    this.addButtonTooltip = this.dictionaryService.getTranslationOrWord(
      'New Tuition Rate by Category'
    );
    this.tableCell = new CategoryTuitionRateTableCell();
    this.getColumns('category-tuition-datatable-columns');
  }

  ngOnInit(): void {
    this.getTuitions('category-tuition-rates');
    this.tableCell
      .getAction()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (data.type === 'EDIT') {
          this.openAddEditDialog(
            {
              semesterId: data.info.semesterId,
              categoryTuitionRateId: data.info.categoryTuitionRateId,
              courseCategoryId: data.info.courseCategoryId,
            } as CategoryTuitionRateInfo,
            true
          );
        } else if (data.type === 'DELETE') {
          this.deleteFee(data.info.levelCourseFeeId);
        }
      });
  }

  openAddEditDialog(info: CategoryTuitionRateInfo, edit?: boolean) {
    const options = DialogService.getOptions();
    options.data = {
      semesterId: info.semesterId,
      categoryTuitionRateId: info.categoryTuitionRateId,
      courseCategoryId: info.courseCategoryId,
      edit: edit,
    };

    const dialogRef = this.dialog.open(AddEditCategoryTuitionDialog, options);
    dialogRef.componentInstance.getActionListner().subscribe((data) => {
      this.getTuitions('category-tuition-rates', this.cdRef);
      dialogRef.close();
    });
  }
  deleteFee(tuitionRateId: number) {
    this.dialogService.confirmDelete(() => {
      this.apiService
        .get(
          this.createUrl('tuition/delete-category-tuition-rates', {
            semesterId: this.semesterId,
            courseCatetoryId: tuitionRateId,
          })
        )
        .pipe(take(1))
        .subscribe((data) => {
          this.getTuitions('category-tuition-rates');
          this.alertService.showSuccessAlert(
            'Lesson tuition rate deleted successfully.'
          );
        });
    });
  }

  createNew() {
    this.openAddEditDialog({
      semesterId: this.selectedSemesterId,
      categoryTuitionRateId: 0,
      courseCategoryId: 0,
    } as CategoryTuitionRateInfo);
  }
}
