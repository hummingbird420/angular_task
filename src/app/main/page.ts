import { FormGroup, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { MatDateFormats } from '@angular/material/core';
import { ApiService, AuthService, RightLinkService } from 'src/app/services';
import { ListCodeInfo, SortedFieldInfo } from '../models';
import { takeUntil } from 'rxjs/operators';
import { TableColumnInfo } from './components/table/table-column.info';
import { TableDataSource } from './components/table';
import { FormField } from '../util/utility-funtions';

export interface BreadcrumbInfo {
  title: string;
  url?: string;
  active?: boolean;
}

export abstract class BasePage {
  protected setRightLinkUrl(
    component: any,
    rightLinkService: RightLinkService
  ) {
    if (component instanceof Page && component.rightLinkUrl.length > 0) {
      rightLinkService.setRightLinks(component.rightLinkUrl);
    } else {
      rightLinkService.setRightLinks('');
    }
  }
}

export abstract class Page {
  title: string = '';
  subTitles: BreadcrumbInfo[] = [];
  rightLinkUrl: string = '';
  dateFormat: string = 'M/D/yyyy';
  protected destroyed$ = new Subject<void>();

  protected destroyed() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  protected setDateFormat(
    dateFormats: MatDateFormats,
    authService: AuthService
  ) {
    dateFormats.display.dateInput = this.dateFormat;
    authService
      .getUser()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((user) => {
        if (user) {
          this.dateFormat = user.dateFormat;
          dateFormats.display.dateInput = this.dateFormat.replace('d', 'D');
        }
      });
  }

  protected createUrl(baseUrl: string, ...params: any[]): string {
    let url = baseUrl;
    if (baseUrl.endsWith('/')) {
      url = baseUrl.substring(0, baseUrl.length - 1);
    }
    if (params) {
      for (let i = 0; i < params.length; i++) {
        let param = params[i];
        if (typeof params === 'string') {
          param = param.trim();
        }
        if (typeof param !== undefined) url += '/' + param;
      }
    }
    return url;
  }

  protected addParams(url: string, params: { [key: string]: any }): string {
    let index = 0;
    for (const key in params) {
      const joiner = index ? '&' : '?';
      url += joiner + key + '=' + params[key];
      index++;
    }
    return url;
  }
}

export abstract class DataTablePage<T> extends Page {
  columns: Observable<TableColumnInfo[]> | TableColumnInfo[] = of([]);
  dataSource: TableDataSource<T> = new TableDataSource<T>();
  addButtonTooltip: string = 'New';
  actionColumn: string = 'N';
}

export abstract class SimpleFormPage extends Page {
  formGroup: FormGroup = new FormGroup({});
  formFields$: Observable<SortedFieldInfo<any, string | number>[]> = of([]);
  formFields: FormField<SortedFieldInfo<any, string | number>> = {};
  requiredFields: string[] = [];
  constructor() {
    super();
  }
  getValidators(field: SortedFieldInfo<any, any>): ValidatorFn[] {
    return [];
  }

  alphaIndex(n: number): string {
    const base = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
    ];
    let t = '';
    do {
      if (n < base.length) {
        t += base[n];
      } else {
        n = n - base.length;
        t += base[base.length - 1] + (n < base.length ? base[n] : '');
      }
    } while (n >= base.length);
    return t;
  }
}

export abstract class FormPage<T> extends Page {
  id: number = 0;
  info: T = {} as T;
  recordSections: Observable<ListCodeInfo[]> = of([]);
  formGroups: Map<string, FormGroup>;
  formFields: Map<string, Observable<SortedFieldInfo<any, string>[]>>;

  constructor() {
    super();
    this.formGroups = new Map<string, FormGroup>();
    this.formFields = new Map<
      string,
      Observable<SortedFieldInfo<any, string>[]>
    >();
  }

  getId(route: ActivatedRoute) {
    route.paramMap.subscribe((param) => {
      const id = param.get('id');
      this.id = id ? parseInt(id) : 0;
    });
  }

  loadFormData(
    apiService: ApiService,
    recordSectionUrl: string,
    fieldUrl: string
  ) {}

  getFormFields(
    sectionName: string
  ): Observable<SortedFieldInfo<any, string>[]> {
    return this.formFields.get(sectionName) || of([]);
  }

  getFormGroup(sectionName: string): FormGroup {
    return this.formGroups.get(sectionName) || new FormGroup({});
  }
}

export function createBreadcrumb(
  title: string,
  url?: string,
  active?: boolean
): BreadcrumbInfo {
  return { title: title, url: url, active: active } as BreadcrumbInfo;
}
