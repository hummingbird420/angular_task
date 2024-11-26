import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WordInfo } from 'src/app/models';
import { ApiService } from 'src/app/services';
import { TableColumnInfo, TableDataSource } from '../../../components/table';
import { createBreadcrumb, Page } from '../../../page';

@Component({
  templateUrl: './phrases.page.html',
  styleUrls: ['./phrases.page.scss'],
})
export class PhrasesPage extends Page implements OnInit {
  currentLetter: string = 'A';
  columns: Observable<TableColumnInfo[]> = of([]);
  dataSource: TableDataSource<WordInfo> = new TableDataSource<WordInfo>();
  constructor(private apiService: ApiService) {
    super();
    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Dictionary', '/setup/customization/dictionary'),
      createBreadcrumb('Phrases', undefined, true),
    ];
    this.rightLinkUrl = 'phrases-right-links';
    this.columns = this.apiService.get<TableColumnInfo[]>(
      'phrases-table-columns'
    );
  }

  ngOnInit(): void {
    this.apiService
      .get<WordInfo[]>(this.createUrl('words', this.currentLetter))
      .pipe(takeUntil(this.destroyed$))
      .subscribe((words) => {
        this.dataSource = new TableDataSource(words);
      });
  }

  createNew() {}
}
