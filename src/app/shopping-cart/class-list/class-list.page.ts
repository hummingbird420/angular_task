import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { from, Observable, Subject } from 'rxjs';
import { catchError, distinct, map, take, takeUntil } from 'rxjs/operators';
import { collapseUpDown } from 'src/app/animations/animation';
import { SortedFieldInfo } from 'src/app/models';
import { CartBasePage } from '../cart-base.page';
import { CartOptions, CartProgramInfo, ColumnInfo, CourseInfo } from '../models';
import { ShoppingCartService } from '../service/shopping-cart.service';
import {
  CartFilterState,
  UpdateProgramField,
  UpdateProgramLevelField,
  UpdateSelectedCampus,
  UpdateSelectedCategory,
  UpdateSelectedDepartment,
  UpdateSelectedEndDate,
  UpdateSelectedLocation,
  UpdateSelectedProgram,
  UpdateSelectedProgramLevel,
  UpdateSelectedSemester,
  UpdateSelectedStartDate,
  FetchCartOptions,
  ShoppingCartState,
} from '../cart-states';
import { CART_URL } from '../util/constant';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';

@Component({
  selector: 'o-class-list',
  templateUrl: './class-list.page.html',
  styleUrls: ['./class-list.page.scss'],
  animations: [collapseUpDown],
  host: {
    '(window:resize)': 'repaintClassTable(true)',
  },
})
export class ClassListPage extends CartBasePage implements OnInit, AfterViewInit, OnDestroy {
  private dead$ = new Subject();
  @Select(ShoppingCartState.cartOptions)
  cartOptions$!: Observable<CartOptions>;

  @Select(ShoppingCartState.selectedClassIds)
  selectedClassIds$!: Observable<(multiple: boolean) => number[]>;
  selectedClassIds: number[] = [];

  @Select(CartFilterState.campusField)
  campusField$!: Observable<SortedFieldInfo<number, number>>;

  @Select(CartFilterState.selectedCampus)
  selectedCampus$!: Observable<number>;

  @Select(CartFilterState.departmentField)
  departmentField$!: Observable<SortedFieldInfo<number, number>>;

  @Select(CartFilterState.selectedDepartment)
  selectedDepartment$!: Observable<number>;

  @Select(CartFilterState.categoryField)
  categoryField$!: Observable<SortedFieldInfo<number, number>>;

  @Select(CartFilterState.selectedCategory)
  selectedCategory$!: Observable<number>;

  @Select(CartFilterState.programField)
  programField$!: Observable<SortedFieldInfo<number, number>>;

  @Select(CartFilterState.selectedProgram)
  selectedProgram$!: Observable<number>;

  @Select(CartFilterState.programLevelField)
  programLevelField$!: Observable<SortedFieldInfo<number, number>>;

  @Select(CartFilterState.selectedProgramLevel)
  selectedProgramLevel$!: Observable<number>;

  @Select(CartFilterState.semesterField)
  semesterField$!: Observable<SortedFieldInfo<number, number>>;

  @Select(CartFilterState.selectedSemester)
  selectedSemester$!: Observable<number>;

  @Select(CartFilterState.locationField)
  locationField$!: Observable<SortedFieldInfo<string, number>>;

  @Select(CartFilterState.selectedLocation)
  selectedLocation$!: Observable<string>;

  @Select(CartFilterState.selectedStartDate)
  selectedStartDate$!: Observable<string>;

  @Select(CartFilterState.selectedEndDate)
  selectedEndDate$!: Observable<string>;

  @Select(CartFilterState.userSelectedFilter)
  userSelectedFilter$!: Observable<Set<string>>;

  @Select(ShoppingCartState.header)
  header$!: Observable<string>;

  @Select(ShoppingCartState.mobileView)
  mobileView$!: Observable<boolean>;

  columns: ColumnInfo[] = [];
  courseList: CourseInfo[] = [];
  programs: CartProgramInfo[] = [];
  programInstructions: string = '';
  cartCount = 0;
  hasCustomHeader: boolean = false;
  cartIcon = 'cart';
  filterSet: Set<string> = new Set<string>();
  clearFilter: EventEmitter<void> = new EventEmitter<void>();

  dropdown = (title: string) => ({ fieldTitle: title } as SortedFieldInfo<any, any>);

  campusFilterField: SortedFieldInfo<number, number>;
  departmentFilterField: SortedFieldInfo<number, number>;
  categoryFilterField: SortedFieldInfo<number, number>;
  programFilterField: SortedFieldInfo<number, number>;
  semesterFilterField: SortedFieldInfo<number, number>;
  programLevelFilterField: SortedFieldInfo<number, number>;
  locationFilterField: SortedFieldInfo<string, number>;
  locationAllOption = { value: '', title: 'All' };
  numberAllOption = { value: -1, title: 'All' };

  startDate: string | null = null;
  endDate: string | null = null;

  showFilter: boolean = true;
  showCampusFilter: boolean = false;
  showDepartmentFilter: boolean = false;
  showCategoryFilter: boolean = false;
  showProgramFilter: boolean = false;
  showProgramLevelFilter: boolean = false;
  showSemesterFilter: boolean = false;
  showLocationFilter: boolean = false;
  showStartDateFilter: boolean = false;
  showEndDateFilter: boolean = false;
  allowSearchClasses: boolean = true;
  allowSearchProgramClasses: boolean = true;
  allowFilterClasses: boolean = true;

  startDateControl = new FormControl();
  endDateControl = new FormControl();
  filterControl = new FormControl();

  campusValueEmitter: EventEmitter<any> = new EventEmitter<any>();
  departmentValueEmitter: EventEmitter<any> = new EventEmitter<any>();
  categoryValueEmitter: EventEmitter<any> = new EventEmitter<any>();
  programValueEmitter: EventEmitter<any> = new EventEmitter<any>();
  programLevelValueEmitter: EventEmitter<any> = new EventEmitter<any>();
  semesterValueEmitter: EventEmitter<any> = new EventEmitter<any>();
  locationValueEmitter: EventEmitter<any> = new EventEmitter<any>();

  displayAllClassesOnTheDefaultPage: boolean = true;
  displayAllDepartmentAsDefault: boolean = true;
  classTableWidth: number = 0;

  minDate: Date;
  maxDate: Date;
  dateFormat: string = 'M/D/yyyy';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private store: Store,
    route: ActivatedRoute,
    cartService: ShoppingCartService,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats
  ) {
    super(route, cartService);
    this.init();
    this.campusFilterField = this.dropdown('Campus');
    this.departmentFilterField = this.dropdown('Department');
    this.categoryFilterField = this.dropdown('Category');
    this.programFilterField = this.dropdown('Program');
    this.semesterFilterField = this.dropdown('Semester');
    this.programLevelFilterField = this.dropdown('Program Level');
    this.locationFilterField = this.dropdown('Location');
    this.dateFormats.display.dateInput = 'M/D/yyyy';
    this.dateFormats.parse.dateInput = 'M/d/yyyy';
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 10, 0, 1);
    this.maxDate = new Date(currentYear + 10, 11, 31);
  }
  ngOnDestroy(): void {
    this.dead$.next();
    this.dead$.complete();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initFilterFieldValues();
    }, 500);
  }
  ngOnInit(): void {
    this.cartService
      .cartClassResponse$()
      .pipe(takeUntil(this.dead$))
      .subscribe((response) => {
        if (response) {
          this.columns = response.datatableColumns;
          this.courseList = response.courses;
        }
      });

    this.cartService
      .cartProgramResponse$()
      .pipe(takeUntil(this.dead$))
      .subscribe((response) => {
        if (response) {
          this.columns = response.datatableColumns;
          this.programInstructions = response.programInstructions;
          const newPrograms: CartProgramInfo[] = []        
          from(response.programs).pipe(distinct((e) => e.programId)).subscribe((program) => {
            newPrograms.push(program);
          });
          this.programs = newPrograms;
        }
      });

    this.cartOptions$.pipe(takeUntil(this.dead$)).subscribe((options: CartOptions) => {
      if (options) {
        this.setOptions(options);
        this.campusField$.pipe(takeUntil(this.dead$)).subscribe((field) => {
          this.initCampusField(field);
        });

        this.departmentField$.pipe(takeUntil(this.dead$)).subscribe((field) => this.initDepartmentField(field));

        //program and program level
        this.programField$.pipe(takeUntil(this.dead$)).subscribe((field) => {
          this.initProgramField(field);
        });

        this.programLevelField$.pipe(takeUntil(this.dead$)).subscribe((field) => {
          this.programLevelFilterField = this.copyFilterFieldObject(field);
          this.cartService.selectedProgramLevel = this.programLevelFilterField.fieldValue;
          this.showProgramLevelFilter =
            this.programLevelFilterField.options && this.programLevelFilterField.options.length > 0;
        });

        //course category
        if (this.cartService.isCourseLink() || this.cartService.isSearchCourseLink()) {
          this.categoryField$.pipe(takeUntil(this.dead$)).subscribe((field) => this.initCourseCategoryField(field));
        }
      } else {
        this.store.dispatch(new FetchCartOptions());
      }

      //end of cartOptions$
    });

    if (this.cartService.isProgramLink() || this.cartService.isSearchProgramLink()) {
      this.semesterField$.pipe(takeUntil(this.dead$)).subscribe((field) => {
        if (field) {
          this.semesterFilterField = this.copyFilterFieldObject(field);
          this.cartService.selectedSemester = this.semesterFilterField.fieldValue;
          this.showSemesterFilter = this.semesterFilterField.options && this.semesterFilterField.options.length > 0;
        }
      });
    }

    if (this.cartService.isSearchCourseLink() || this.cartService.isSearchProgramLink()) {
      this.locationField$.pipe(takeUntil(this.dead$)).subscribe((field) => {
        if (field) {
          this.locationFilterField = this.copyFilterFieldObject(field);
          this.cartService.selectedLocation = this.locationFilterField.fieldValue;
          this.showLocationFilter = this.locationFilterField.options && this.locationFilterField.options.length > 0;
        }
      });

      this.showStartDateFilter = true;
      this.showEndDateFilter = true;
    }

    this.selectedClassIds$
      .pipe(takeUntil(this.dead$))
      .pipe(map((fn) => fn(this.multiple)))
      .subscribe((classIds) => {
        this.selectedClassIds = classIds;
        this.cartCount = classIds.length;
        this.cdRef.detectChanges();
      });

    this.header$.pipe(takeUntil(this.dead$)).subscribe((customHeader) => {
      if (customHeader) {
        this.hasCustomHeader = true;
      }
    });

    this.startDateControl.valueChanges.subscribe((value) => {
      if (!this.startDateControl.errors) this.onChangeStartDate(value);
    });

    this.endDateControl.valueChanges.subscribe((value) => {
      if (!this.endDateControl.errors) this.onChangeEndDate(value);
    });

    const onlySelf = { onlySelf: true };
    this.selectedStartDate$.pipe(take(1)).subscribe((date) => {
      if (date) {
        this.startDateControl.setValue(new Date(date), onlySelf);
      }
    });

    this.selectedEndDate$.pipe(take(1)).subscribe((date) => {
      if (date) {
        this.endDateControl.setValue(new Date(date), onlySelf);
      }
    });

    this.userSelectedFilter$.pipe(takeUntil(this.dead$)).subscribe((filter) => (this.filterSet = filter));

    this.onViewChange();
  } //end of ngOnInit

  private setOptions(options: CartOptions) {
    this.allowFilterClasses = options.allowFilterClasses;
    this.displayAllClassesOnTheDefaultPage = options.displayAllClassesOnTheDefaultPage;
    this.displayAllDepartmentAsDefault = options.displayAllDepartmentAsDefault;

    if (!options.allowSearchClasses && this.cartService.isCourseLink()) {
      this.allowSearchClasses = false;
    } else {
      this.allowSearchClasses = true;
    }

    if (!options.allowSearchClasses && this.cartService.isProgramLink()) {
      this.allowSearchProgramClasses = false;
    } else {
      this.allowSearchProgramClasses = true;
    }
    let dateFormat: string = options.dateFormat;
    if (dateFormat) {
      this.dateFormats.display.dateInput = dateFormat.toUpperCase();
      this.dateFormats.parse.dateInput = dateFormat.toUpperCase();
      this.dateFormat = dateFormat.toUpperCase();
    }
  }

  private initCampusField(field: SortedFieldInfo<any, any>) {
    this.campusFilterField = this.copyFilterFieldObject(field);
    this.cartService.selectedCampus = this.campusFilterField.fieldValue;
    const optionsSize = this.campusFilterField.options ? this.campusFilterField.options.length : 0;
    this.showCampusFilter = optionsSize > 1;
  }

  private initDepartmentField(field: SortedFieldInfo<any, any>) {
    this.departmentFilterField = this.copyFilterFieldObject(field);
    this.cartService.selectedDepartment = this.departmentFilterField.fieldValue;
    const optionsSize = this.departmentFilterField.options ? this.departmentFilterField.options.length : 0;
    this.showDepartmentFilter = optionsSize > 1;
  }

  private initCourseCategoryField(field: SortedFieldInfo<any, any>) {
    this.categoryFilterField = this.copyFilterFieldObject(field);
    this.cartService.selectedCategory = this.categoryFilterField.fieldValue;
    const optionsSize = this.categoryFilterField.options ? this.categoryFilterField.options.length : 0;
    this.showCategoryFilter = optionsSize > 1;
  }

  private initProgramField(field: SortedFieldInfo<any, any>) {
    this.programFilterField = this.copyFilterFieldObject(field);
    this.cartService.selectedProgram = this.programFilterField.fieldValue;
    const optionsSize = this.programFilterField.options ? this.programFilterField.options.length : 0;
    this.showProgramFilter = optionsSize > 1;
  }

  private copyFilterFieldObject(field: SortedFieldInfo<any, any>) {
    return {
      sortId: field.sortId,
      fieldTitle: field.fieldTitle,
      fieldName: field.fieldName,
      fieldValue: field.fieldValue,
      fieldType: field.fieldType,
      customFieldId: field.customFieldId,
      hints: field.hints,
      options: field.options,
      maxLength: field.maxLength,
    };
  }

  private emitAction(action: any) {
    if (action) {
      this.store.dispatch(action);
    }
  }

  initFilterFieldValues() {
    let isInitState = true;
    if (isInitState) {
      this.fetchClasses();
      isInitState = false;
    }
  }
  onViewChange() {
    this.breakpointObserver
      .observe(['(max-width: 799px)'])
      .pipe(takeUntil(this.dead$))
      .subscribe((result) => {
        if (result.matches) {
          this.showFilter = false;
        } else {
          this.mobileView$.pipe(takeUntil(this.dead$)).subscribe((mobileView) => {
            this.showFilter = !mobileView;
          });
        }

        this.cdRef.detectChanges();
      });
  }

  updateProgramDropdown() {
    if (this.cartService.isProgramLink() || this.cartService.isSearchProgramLink()) {
      this.cartService
        .getProgramDropdown()
        .pipe(map((field) => this.emitAction(new UpdateProgramField(field))))
        .subscribe(() => this.updateProgramLevelDropdown());
    }
  }

  updateProgramLevelDropdown() {
    this.cartService.getProgramLevelDropdown().subscribe(
      (field) => {
        this.emitAction(new UpdateProgramLevelField(field));
      },
      (error) => {
        const field = {} as SortedFieldInfo<number, number>;
        this.emitAction(new UpdateProgramLevelField(field));
      }
    );
  }

  resetStartDate() {
    this.startDateControl.setValue(null, { onlySelf: true, emitEvent: false });
  }
  resetEndDate() {
    this.endDateControl.setValue(null, { onlySelf: true, emitEvent: false });
  }

  getValue(classInfo: any, propertyName: string) {
    return classInfo.hasOwnProperty(propertyName) ? classInfo[propertyName] : '';
  }

  displayCart() {
    const url = '/shopping-cart/display-cart/' + this.cartService.adminId;
    this.router.navigateByUrl(url);
  }

  getCartIcon(classId: number) {
    return this.selectedClassIds.includes(classId) ? 'cartSelected' : 'cart';
  }

  getCourseDetailsPageUrl(courseId: number) {
    const multiple = this.multiple ? 'multiple/' : '';
    return `/${CART_URL.cart_root}${multiple}${CART_URL.course_description}/${this.cartService.adminId}/${courseId}`;
  }

  onChangeCampus(campusCode: number) {
    this.cartService.selectedCampus = campusCode;
    this.store.dispatch(new UpdateSelectedCampus(campusCode, true));
  }

  onChangeDepartment(departmentId: number) {
    this.cartService.selectedDepartment = departmentId;
    this.store.dispatch(new UpdateSelectedDepartment(departmentId, true));
    this.updateProgramDropdown();
  }

  onChangeCategory(categoryId: number) {
    this.cartService.selectedCategory = categoryId;
    this.store.dispatch(new UpdateSelectedCategory(categoryId, true));
  }

  onChangeProgram(programId: number) {
    this.cartService.selectedProgram = programId;
    this.store.dispatch(new UpdateSelectedProgram(programId, true));
    this.updateProgramLevelDropdown();
  }

  onChangeProgramLevel(programLevelId: number) {
    this.cartService.selectedProgramLevel = programLevelId;
    this.store.dispatch(new UpdateSelectedProgramLevel(programLevelId, true));
  }

  onChangeSemester(semesterId: number) {
    this.cartService.selectedSemester = semesterId;
    this.store.dispatch(new UpdateSelectedSemester(semesterId, true));
  }

  onChangeLocation(location: string) {
    this.cartService.selectedLocation = location;
    this.store.dispatch(new UpdateSelectedLocation(location, true));
  }
  onChangeStartDate(startDate: string) {
    this.cartService.selectedStartDate = startDate;
    this.store.dispatch(new UpdateSelectedStartDate(startDate));
  }
  onChangeEndDate(endDate: string) {
    this.cartService.selectedEndDate = endDate;
    this.store.dispatch(new UpdateSelectedEndDate(endDate));
  }
  clearAllFilter() {
    this.store.dispatch(new UpdateSelectedCampus(null, true));
    this.store.dispatch(new UpdateSelectedDepartment(null, true));
    this.store.dispatch(new UpdateSelectedCategory(null, true));
    this.store.dispatch(new UpdateSelectedProgram(null, true));
    this.store.dispatch(new UpdateSelectedProgramLevel(null, true));
    this.store.dispatch(new UpdateSelectedSemester(null, true));
    this.store.dispatch(new UpdateSelectedLocation(null, true));
    this.store.dispatch(new UpdateSelectedStartDate(''));
    this.store.dispatch(new UpdateSelectedEndDate(''));

    this.filterSet.clear();
    this.resetStartDate();
    this.resetEndDate();
    this.cartService.resetFilterValues();
    this.resetStoreValues();
  }
  resetStoreValues() {
    this.campusField$.pipe(takeUntil(this.dead$)).subscribe((field) => {
      let campusCode = field.options[0].value;
      if (this.displayAllClassesOnTheDefaultPage) {
        campusCode = -1;
      }
      this.campusValueEmitter.emit(campusCode);
      this.cartService.selectedCampus = campusCode;
      this.store.dispatch(new UpdateSelectedCampus(campusCode));
    });

    this.departmentField$.pipe(takeUntil(this.dead$)).subscribe((field) => {
      let departmentId = field.options[0].value;
      if (this.displayAllDepartmentAsDefault) {
        departmentId = -1;
      }
      this.departmentValueEmitter.emit(departmentId);
      this.cartService.selectedDepartment = departmentId;
      this.store.dispatch(new UpdateSelectedDepartment(departmentId));
      this.updateProgramDropdown();
    });

    this.programField$.pipe(takeUntil(this.dead$)).subscribe((field) => {
      let programId = field.options[0].value;
      if (this.displayAllClassesOnTheDefaultPage) {
        programId = -1;
      }
      this.programValueEmitter.emit(programId);
      this.cartService.selectedProgram = programId;
      this.store.dispatch(new UpdateSelectedProgram(programId));
    });

    this.programLevelField$.pipe(takeUntil(this.dead$)).subscribe(() => {
      this.programLevelValueEmitter.emit(null);
      this.store.dispatch(new UpdateSelectedProgramLevel(null));
    });

    if (this.cartService.isCourseLink() || this.cartService.isSearchCourseLink()) {
      this.categoryField$.pipe(takeUntil(this.dead$)).subscribe((field) => {
        let categoryId = field.options[0].value;
        if (this.displayAllClassesOnTheDefaultPage) {
          categoryId = -1;
        }
        this.categoryValueEmitter.emit(categoryId);
        this.cartService.selectedCategory = categoryId;
        this.store.dispatch(new UpdateSelectedCategory(categoryId));
      });
    }

    if (this.cartService.isProgramLink() || this.cartService.isSearchProgramLink()) {
      this.semesterField$.pipe(takeUntil(this.dead$)).subscribe((field) => {
        let semister = field.options[0].value;
        if (this.displayAllClassesOnTheDefaultPage) {
          semister = -1;
        }
        this.semesterValueEmitter.emit(semister);
        this.cartService.selectedSemester = semister;
        this.store.dispatch(new UpdateSelectedSemester(semister));
      });
    }

    if (this.cartService.isSearchCourseLink() || this.cartService.isSearchProgramLink()) {
      this.locationField$.pipe(takeUntil(this.dead$)).subscribe((field) => {
        let location = field.options[0].value;
        if (this.displayAllClassesOnTheDefaultPage) {
          location = '';
        }
        this.locationValueEmitter.emit(location);
        this.cartService.selectedLocation = location;
        this.store.dispatch(new UpdateSelectedLocation(location));
      });
    }

    this.fetchClasses();
  }

  fetchClasses() {
    this.cartService.fetchAvailableClasses().subscribe((response) => {
      setTimeout(() => {
        this.repaintClassTable();
      }, 50);
    });
  }

  public repaintClassTable(displayResize: boolean = false) {
    const mainContainer = document.querySelector('#main-container');
    const filterContent = document.querySelector('.filter-row');
    let clientWidth =
      (mainContainer ? mainContainer.clientWidth : 0) > (filterContent ? filterContent.clientWidth : 0)
        ? mainContainer
          ? mainContainer.clientWidth
          : 0
        : filterContent
        ? filterContent.clientWidth
        : 0;
    if (clientWidth < 800) return;
    const classTable = document.querySelector('.class-table');
    mainContainer!.classList.remove('mobile');
    mainContainer!.classList.add('desktop');
    this.showFilter = true;
    clientWidth = mainContainer ? mainContainer.clientWidth : 0;
    if (displayResize) {
      this.classTableWidth = classTable ? classTable.clientWidth : 0;
    } else {
      this.classTableWidth = Math.max(classTable ? classTable.clientWidth : 0, this.classTableWidth);
    }

    if (clientWidth + 3 < this.classTableWidth) {
      mainContainer!.classList.remove('desktop');
      mainContainer!.classList.add('mobile');
      this.showFilter = false;
    }
  }

  countBreak(text: string) {
    let values: string[] = (text.split(new RegExp('<br/>', 'g')) || []).filter((v, i) => v.length > 0);

    values.push(...(text.split(new RegExp('<br>', 'g')) || []).filter((v, i) => v.length > 0));
    return values;
  }
}
