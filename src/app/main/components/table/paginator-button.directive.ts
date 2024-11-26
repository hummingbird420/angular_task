import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Directive,
  Host,
  Input,
  OnDestroy,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface PageInfo {
  length: number;
  pageIndex: number;
  pageSize: number;
  previousPageIndex: number;
}

@Directive({
  selector: '[oPaginatorButton]',
})
export class PaginatorButtonDirective implements AfterViewInit, OnDestroy {
  private destroyed$ = new Subject();
  private _pageGapTxt = '...';
  private _rangeStart!: number;
  private _rangeEnd!: number;
  private _buttons: MatButton[] = [];
  private _curPageInfo: PageInfo = {
    length: 0,
    pageIndex: 0,
    pageSize: 0,
    previousPageIndex: 0,
  };

  @Input()
  get showTotalPages(): number {
    return this._showTotalPages;
  }
  set showTotalPages(value: number) {
    this._showTotalPages = value;
  }
  private _showTotalPages = 2;

  get inc(): number {
    return this._showTotalPages % 2 == 0
      ? this.showTotalPages / 2
      : (this.showTotalPages - 1) / 2;
  }

  @Input() length: number = 0;
  @Input() pageSize: number = 0;

  get numOfPages(): number {
    const pageCount = this.matPaginator.getNumberOfPages();
    if (pageCount > 0) {
      return pageCount;
    }
    const nPageCount =
      this.length / this.pageSize + (this.length % this.pageSize);
    return nPageCount;
  }

  get lastPageIndex(): number {
    return this.numOfPages - 1;
  }

  constructor(
    @Host() @Self() @Optional() private readonly matPaginator: MatPaginator,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2,
    protected breakpointObserver: BreakpointObserver
  ) {
    //to rerender buttons on items per page change and first, last, next and prior buttons
    this.matPaginator.page.subscribe((pageInfo: PageInfo) => {
      if (
        this._curPageInfo.pageSize != pageInfo.pageSize &&
        this._curPageInfo.pageIndex != 0
      ) {
        pageInfo.pageIndex = 0;
        this._rangeStart = 0;
        this._rangeEnd = this._showTotalPages - 1;
      }
      this._curPageInfo = pageInfo;

      this.initPageRange();
    });
    // this.matPaginator._changePageSize.s
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private buildPageNumbers() {
    const actionContainer =
      this.viewContainerRef.element.nativeElement.querySelector(
        'div.mat-paginator-range-actions'
      );
    const nextPageNode =
      this.viewContainerRef.element.nativeElement.querySelector(
        'button.mat-paginator-navigation-next'
      );
    const prevButtonCount = this._buttons.length;

    // remove buttons before creating new ones
    if (this._buttons.length > 0) {
      this._buttons.forEach((button) => {
        this.renderer.removeChild(actionContainer, button);
      });
      //Empty state array
      this._buttons.length = 0;
    }

    for (let i = 0; i < this.numOfPages; i++) {
      if (i >= this._rangeStart && i <= this._rangeEnd) {
        this.renderer.insertBefore(
          actionContainer,
          this.createButton(i, this.matPaginator.pageIndex),
          nextPageNode
        );
      }

      if (i == this._rangeEnd) {
        this.renderer.insertBefore(
          actionContainer,
          this.createButton(this._pageGapTxt, this._rangeEnd),
          nextPageNode
        );
      }
    }
  }

  private createButton(index: any, pageIndex: number): any {
    const linkBtn: MatButton = this.renderer.createElement('button');

    this.renderer.addClass(linkBtn, 'mat-icon-button');
    this.renderer.addClass(linkBtn, 'mat-button-base');
    this.renderer.setStyle(linkBtn, 'margin', '2px');
    this.renderer.setStyle(linkBtn, 'border-radius', '50%');
    this.renderer.setStyle(linkBtn, 'min-height', '1px');
    this.renderer.setStyle(linkBtn, 'min-width', '1px');

    const pagingTxt = isNaN(index) ? this._pageGapTxt : +(index + 1);
    const text = this.renderer.createText(pagingTxt + '');

    switch (index) {
      case pageIndex:
        this.renderer.setAttribute(linkBtn, 'disabled', 'disabled');
        this.renderer.addClass(linkBtn, 'mat-button-disabled');
        break;
      case this._pageGapTxt:
        let newIndex = this._curPageInfo.pageIndex + this._showTotalPages;

        if (newIndex >= this.numOfPages) newIndex = this.lastPageIndex;

        if (pageIndex != this.lastPageIndex) {
          this.renderer.listen(linkBtn, 'click', () => {
            console.log('working: ', pageIndex);
            this.switchPage(newIndex);
          });
        }

        if (pageIndex == this.lastPageIndex) {
          this.renderer.setAttribute(linkBtn, 'disabled', 'disabled');
          this.renderer.addClass(linkBtn, 'mat-button-disabled');
        }
        break;
      default:
        this.renderer.listen(linkBtn, 'click', () => {
          this.switchPage(index);
        });
        break;
    }

    this.renderer.appendChild(linkBtn, text);
    //Add button to private array for state
    this._buttons.push(linkBtn);
    return linkBtn;
  }

  private initPageRange(): void {
    const middleIndex = (this._rangeStart + this._rangeEnd) / 2;

    this._rangeStart = this.calcRangeStart(middleIndex);
    this._rangeEnd = this.calcRangeEnd(middleIndex);

    this.buildPageNumbers();
  }

  //Helper function To calculate start of button range
  private calcRangeStart(middleIndex: number): number {
    switch (true) {
      case this._curPageInfo.pageIndex == 0 && this._rangeStart != 0:
        return 0;
      case this._curPageInfo.pageIndex > this._rangeEnd:
        return this._curPageInfo.pageIndex + this.inc > this.lastPageIndex
          ? this.lastPageIndex - this.inc * 2
          : this._curPageInfo.pageIndex - this.inc;
      case this._curPageInfo.pageIndex > this._curPageInfo.previousPageIndex &&
        this._curPageInfo.pageIndex > middleIndex &&
        this._rangeEnd < this.lastPageIndex:
        return this._rangeStart + 1;
      case this._curPageInfo.pageIndex < this._curPageInfo.previousPageIndex &&
        this._curPageInfo.pageIndex < middleIndex &&
        this._rangeStart > 0:
        return this._rangeStart - 1;
      default:
        return this._rangeStart;
    }
  }
  //Helpter function to calculate end of button range
  private calcRangeEnd(middleIndex: number): number {
    switch (true) {
      case this._curPageInfo.pageIndex == 0 &&
        this._rangeEnd != this._showTotalPages:
        return this._showTotalPages - 1;
      case this._curPageInfo.pageIndex > this._rangeEnd:
        return this._curPageInfo.pageIndex + this.inc > this.lastPageIndex
          ? this.lastPageIndex
          : this._curPageInfo.pageIndex + 1;
      case this._curPageInfo.pageIndex > this._curPageInfo.previousPageIndex &&
        this._curPageInfo.pageIndex > middleIndex &&
        this._rangeEnd < this.lastPageIndex:
        return this._rangeEnd + 1;
      case this._curPageInfo.pageIndex < this._curPageInfo.previousPageIndex &&
        this._curPageInfo.pageIndex < middleIndex &&
        this._rangeStart >= 0 &&
        this._rangeEnd > this._showTotalPages - 1:
        return this._rangeEnd - 1;
      default:
        return this._rangeEnd;
    }
  }
  //Helper function to switch page on non first, last, next and previous buttons only.
  private switchPage(index: number): void {
    const previousPageIndex = this.matPaginator.pageIndex;
    this.matPaginator.pageIndex = index;
    this.matPaginator['_emitPageEvent'](previousPageIndex);
    this.initPageRange();
  }
  //Initialize default state after view init
  public ngAfterViewInit(): void {
    console.log('total pages ' + this._showTotalPages);
    if (this.breakpointObserver) {
      this.breakpointObserver
        .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
        .pipe(takeUntil(this.destroyed$))
        .subscribe((state) => {
          if (
            state.breakpoints[Breakpoints.Small] ||
            state.breakpoints[Breakpoints.XSmall]
          ) {
            this.showTotalPages = 3;
          } else if (state.breakpoints[Breakpoints.Medium]) {
            this.showTotalPages = 5;
          } else {
            this.showTotalPages = 10;
          }
          this.initPageRange();
        });
    }
    this._rangeStart = 0;
    this._rangeEnd = this._showTotalPages - 1;
    this.initPageRange();
  }
}
