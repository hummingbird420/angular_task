import { Injectable, OnInit } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { first, map, switchMap, catchError } from 'rxjs/operators';
import { SortedFieldInfo } from 'src/app/models';
import {
  CartFilterState,
  UpdateCampusField,
  UpdateCategoryField,
  UpdateDepartmentField,
  UpdateLocationField,
  UpdateProgramField,
  UpdateProgramLevelField,
  UpdateSelectedCampus,
  UpdateSelectedCategory,
  UpdateSelectedDepartment,
  UpdateSelectedLocation,
  UpdateSelectedProgram,
  UpdateSelectedProgramLevel,
  UpdateSelectedSemester,
  UpdateSemesterField,
  ShoppingCartState,
} from '../cart-states';
import { CartOptions } from '../models';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { CART_URL } from '../util/constant';

@Injectable({
  providedIn: 'root',
})
export class FilterResolver implements Resolve<boolean> {
  @Select(ShoppingCartState.cartOptions)
  cartOptions$!: Observable<CartOptions>;

  @Select(CartFilterState.userSelectedCampus)
  userSelectedCampus$!: Observable<number | null>;
  userSelectedCampus: number | null = null;

  @Select(CartFilterState.userSelectedDepartment)
  userSelectedDepartment$!: Observable<number | null>;
  userSelectedDepartment: number | null = null;

  @Select(CartFilterState.userSelectedCategory)
  userSelectedCategory$!: Observable<number | null>;
  userSelectedCategory: number | null = null;

  @Select(CartFilterState.userSelectedProgram)
  userSelectedProgram$!: Observable<number | null>;
  userSelectedProgram: number | null = null;

  @Select(CartFilterState.userSelectedProgramLevel)
  userSelectedProgramLevel$!: Observable<number | null>;
  userSelectedProgramLevel: number | null = null;

  @Select(CartFilterState.userSelectedSemester)
  userSelectedSemester$!: Observable<number | null>;
  userSelectedSemester: number | null = null;

  @Select(CartFilterState.userSelectedLocation)
  userSelectedLocation$!: Observable<string | null>;
  userSelectedLocation: string | null = null;

  displayAllClassesOnTheDefaultPage: boolean = false;
  displayAllDepartmentAsDefault: boolean = false;

  constructor(private cartService: ShoppingCartService, private store: Store) {
    this.cartOptions$.subscribe((options) => {
      if (options) {
        this.displayAllClassesOnTheDefaultPage = options.displayAllClassesOnTheDefaultPage;
        this.displayAllDepartmentAsDefault = options.displayAllDepartmentAsDefault;
      }
    });
    this.userSelectedCampus$.subscribe((campusId) => (this.userSelectedCampus = campusId));
    this.userSelectedDepartment$.subscribe((depertmentId) => {
      this.userSelectedDepartment = depertmentId;
    });
    this.userSelectedCategory$.subscribe((categoryId) => (this.userSelectedCategory = categoryId));
    this.userSelectedProgram$.subscribe((programId) => (this.userSelectedProgram = programId));
    this.userSelectedProgramLevel$.subscribe((programLevelId) => {
      this.userSelectedProgramLevel = programLevelId;
    });
    this.userSelectedSemester$.subscribe((semesterId) => (this.userSelectedSemester = semesterId));
    this.userSelectedLocation$.subscribe((locationId) => (this.userSelectedLocation = locationId));
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let urls = state.url.split('/');
    let url = urls[urls.length - 2];

    return this.initCampusField().pipe(
      switchMap(() => this.initDepartmentField()),
      switchMap(() => this.initCategoryField(url)),
      switchMap(() => this.initProgramField(url)),
      switchMap(() => this.initProgramLevelField(url)),
      switchMap((): any => this.initSemesterField(url)),
      switchMap((): any => this.initLocationField(url))
    );
  }

  private initCampusField() {
    return this.cartService.getCampusDropdown().pipe(
      map((field) => {
        const campusCode = this.getNumberValue(field, this.userSelectedCampus);
        const campusField = this.copyFilterFieldObject(field);
        campusField.fieldValue = campusCode;
        this.store.dispatch([new UpdateCampusField(campusField), new UpdateSelectedCampus(campusCode)]);
      })
    );
  }

  private initDepartmentField() {
    return this.cartService.getDepartmentDropdown().pipe(
      map((field) => {
        let departmentId = field.options[0].value;
        if (this.displayAllDepartmentAsDefault) {
          departmentId = -1;
        }
        if (this.userSelectedDepartment) {
          departmentId = this.userSelectedDepartment;
        }
        const departmentField = this.copyFilterFieldObject(field);
        departmentField.fieldValue = departmentId;
        this.store.dispatch([new UpdateDepartmentField(departmentField), new UpdateSelectedDepartment(departmentId)]);
      })
    );
  }

  private initProgramField(url: string) {
    if (url.startsWith(CART_URL.program_link) || url.startsWith(CART_URL.search_program_link)) {
      return this.cartService.getProgramDropdown().pipe(
        map((field) => {
          const programId = this.getNumberValue(field, this.userSelectedProgram);
          const programField = this.copyFilterFieldObject(field);
          programField.fieldValue = programId;
          this.store.dispatch([new UpdateProgramField(programField), new UpdateSelectedProgram(programId)]);
        })
      );
    } else {
      return of(null);
    }
  }

  private initProgramLevelField(url: string) {
    if (url.startsWith(CART_URL.program_link) || url.startsWith(CART_URL.search_program_link)) {
      return this.cartService
        .getProgramLevelDropdown()
        .pipe(
          catchError(() => {
            const programLevelField: any = {};
            this.store.dispatch([new UpdateProgramLevelField(programLevelField), new UpdateSelectedProgramLevel(null)]);
            return of(null);
          })
        )
        .pipe(
          map((field) => {
            if (field) {
              const programLevelId = this.getNumberValue(field, this.userSelectedProgramLevel);
              const programLevelField = this.copyFilterFieldObject(field);
              programLevelField.fieldValue = programLevelId;
              this.store.dispatch([
                new UpdateProgramLevelField(programLevelField),
                new UpdateSelectedProgramLevel(programLevelId),
              ]);
            }
          })
        );
    } else {
      return of(null);
    }
  }
  private initCategoryField(url: string) {
    if (url.startsWith(CART_URL.course_link) || url.startsWith(CART_URL.search_course_link)) {
      return this.cartService.getCategoryDropdown().pipe(
        map((field) => {
          const categoryId = this.getNumberValue(field, this.userSelectedCategory);
          const categoryField = this.copyFilterFieldObject(field);
          categoryField.fieldValue = categoryId;
          this.store.dispatch([new UpdateCategoryField(categoryField), new UpdateSelectedCategory(categoryId)]);
        })
      );
    } else {
      return of(null);
    }
  }

  private initSemesterField(url: string) {
    if (url.startsWith(CART_URL.program_link) || url.startsWith(CART_URL.search_program_link)) {
      return this.cartService.getSemesterDropdown().pipe(
        map((field) => {
          const semesterId = this.getNumberValue(field, this.userSelectedSemester);
          const semesterField = this.copyFilterFieldObject(field);
          semesterField.fieldValue = semesterId;
          this.store.dispatch([new UpdateSemesterField(semesterField), new UpdateSelectedSemester(semesterId)]);
        })
      );
    } else {
      return of(null);
    }
  }

  private initLocationField(url: string) {
    if (url.startsWith(CART_URL.search_course_link) || url.startsWith(CART_URL.search_program_link)) {
      return this.cartService.getLocationDropdown().pipe(
        map((field) => {
          this.store.dispatch(new UpdateLocationField(field));
          let location = field.options[0].value;
          if (this.displayAllClassesOnTheDefaultPage) {
            location = '';
          }
          if (this.userSelectedLocation) {
            location = this.userSelectedLocation;
          }
          const locationField = this.copyFilterFieldObject(field);
          locationField.fieldValue = location;
          this.store.dispatch([new UpdateLocationField(locationField), new UpdateSelectedLocation(location)]);
        })
      );
    } else {
      return of(null);
    }
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

  private getNumberValue(field: SortedFieldInfo<any, any>, userSelectedValue: number | null) {
    const options = field.options;
    let value = options.length ? options[0].value : null;
    if (this.displayAllClassesOnTheDefaultPage) {
      value = -1;
    }
    if (userSelectedValue) {
      value = userSelectedValue;
    }
    return value;
  }
}
