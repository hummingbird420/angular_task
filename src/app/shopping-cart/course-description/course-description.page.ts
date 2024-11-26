import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { CartBasePage } from '../cart-base.page';
import { CartOptions, ColumnInfo, CourseDetailsInfo } from '../models';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { FetchCartOptions, ShoppingCartState } from '../cart-states';
import { CART_URL } from '../util/constant';
import { ShareCourseDialog } from './share-course.dialog';

@Component({
  templateUrl: './course-description.page.html',
  styleUrls: ['./course-description.page.scss'],
})
export class CourseDescriptionPage extends CartBasePage implements OnInit, OnDestroy {
  private dead$: Subject<void> = new Subject<void>();

  @Select(ShoppingCartState.cartOptions)
  cartOptions$!: Observable<CartOptions>;
  websiteLink: string = '';

  @Select(ShoppingCartState.selectedClassIds)
  selectedClassIds$!: Observable<(multiple: boolean) => number[]>;
  selectedClassIds: number[] = [];
  columns: ColumnInfo[] = [];
  course: CourseDetailsInfo = {} as CourseDetailsInfo;
  courseUrl: string = '';
  constructor(
    private cdRef: ChangeDetectorRef,
    route: ActivatedRoute,
    cartService: ShoppingCartService,
    private dialog: MatDialog,
    private router: Router,
    private store: Store
  ) {
    super(route, cartService);
    this.init();
    this.courseUrl = this.router['location']._platformLocation.location.href;
  }
  ngOnDestroy(): void {
    this.dead$.next();
    this.dead$.complete();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      const courseId = parseInt(params.get('courseId') || '0');
      this.cartService.fetchCourseDetails(courseId)?.subscribe((data) => {
        this.course = data;
        this.columns = data.datatableColumns;
      });
    });
    this.selectedClassIds$
      .pipe(takeUntil(this.dead$))
      .pipe(map((fn) => fn(this.multiple)))
      .subscribe((classIds) => {
        this.selectedClassIds = classIds;
        this.cdRef.detectChanges();
      });
    this.cartOptions$.pipe(takeUntil(this.dead$)).subscribe((options) => {
      if (options) {
        this.websiteLink = options.websiteLink;
      } else {
        this.store.dispatch(new FetchCartOptions());
      }
    });
  }

  getCourseDetailsPageUrl(courseId: number) {
    const multiple = this.multiple ? 'multiple/' : '';
    return `/${CART_URL.cart_root}${multiple}${CART_URL.course_description}/${this.cartService.adminId}/${courseId}`;
  }
  getCartIcon(classId: number) {
    return this.selectedClassIds.includes(classId) ? 'cartSelected' : 'cart';
  }
  shareCourse() {
    const options = {
      disableClose: true,
      closeOnNavigation: true,
      autoFocus: false,
      data: {
        course: this.course.courseNumber + ' ' + this.course.courseName,
        courseUrl: `Hi, checkout this course:\t\n${this.courseUrl}`,
      },
    };
    this.dialog.open(ShareCourseDialog, options);
  }
}
