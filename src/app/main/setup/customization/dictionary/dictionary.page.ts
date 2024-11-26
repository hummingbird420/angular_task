import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LanguageInfo } from 'src/app/models/LanguageInfo';
import { DictionaryService } from 'src/app/services/dictionary.service';
import {
  TableCell,
  TableColumnInfo,
  TableDataSource,
} from '../../../components/table';
import { createBreadcrumb, Page } from '../../../page';

export class LanguageTableCell extends TableCell<LanguageInfo> {
  getValue(column: TableColumnInfo, info: LanguageInfo): string {
    let value = '';
    if (column.name === 'languageName') {
      value = info.languageName;
    } else if (column.name === 'direction') {
      value = info.direction === 0 ? 'LTR' : 'RTR';
    }
    return value;
  }
  getLink(column: TableColumnInfo, info: LanguageInfo): string {
    if (column.name === 'languageName') {
      return '/setup/customization/language-info/' + info.languageId;
    }
    return '';
  }
}

@Component({
  templateUrl: './dictionary.page.html',
  styleUrls: ['./dictionary.page.scss'],
})
export class DictionaryPage extends Page implements OnInit {
  columns: Observable<TableColumnInfo[]> = of([]);
  dataSource: TableDataSource<LanguageInfo> =
    new TableDataSource<LanguageInfo>();

  constructor(
    private dictionaryService: DictionaryService,
    private router: Router
  ) {
    super();
    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Dictionary', undefined, true),
    ];
    this.rightLinkUrl = 'dictionary-right-links';
    this.columns = this.dictionaryService.getDatatableColumns();
  }

  ngOnInit(): void {
    this.dictionaryService
      .getLanguages()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((languages) => {
        this.dataSource = new TableDataSource<LanguageInfo>(
          languages,
          new LanguageTableCell()
        );
      });
  }

  createNew() {
    this.router.navigateByUrl('/setup/customization/new-language');
  }
}
