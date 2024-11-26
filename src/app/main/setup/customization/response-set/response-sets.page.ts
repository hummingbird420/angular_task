import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ResponseSetInfo } from 'src/app/models/response-set-info';
import { ApiService, ApiUrl, DictionaryService } from 'src/app/services';
import {
  DefaultTableCell,
  TableColumnInfo,
  TableDataSource,
} from '../../../components/table';
import { createBreadcrumb, DataTablePage } from '../../../page';

export class ResponseSetTableCell extends DefaultTableCell {
  getLink(column: TableColumnInfo, info: ResponseSetInfo) {
    let link: string = '';
    if (column.name === 'responseSetName') {
      link = '/setup/customization/response-set/' + info.responseSetId;
    }
    return link;
  }
}

@Component({
  templateUrl: './response-sets.page.html',
  styleUrls: ['./response-sets.page.scss'],
})
export class ResponseSetsPage
  extends DataTablePage<ResponseSetInfo>
  implements OnInit
{
  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private apiService: ApiService,
    private dictionaryServie: DictionaryService
  ) {
    super();

    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Response Sets', undefined, true),
    ];
    this.addButtonTooltip =
      this.dictionaryServie.getTranslationOrWord('New Response Set');
    this.columns = this.apiService.get<TableColumnInfo[]>(
      'response-set-datatable-columns'
    );
  }

  ngOnInit(): void {
    this.apiService
      .get<ResponseSetInfo[]>(ApiUrl.response_sets)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.dataSource = new TableDataSource(data, new ResponseSetTableCell());
        this.cdRef.detectChanges();
      });
  }
  createNew() {
    this.router.navigate(['/setup/customization/new-response-set']);
  }
}
