import { formatDate } from '@angular/common';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';
import * as moment from 'moment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, delay, first, map, retryWhen, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { SortedFieldInfo } from 'src/app/models';
import { CartFilterState } from '../cart-states/filter.state';

import {
  CartBillingResponseInfo,
  CartClassResponse,
  CartOptions,
  CartProgramResponse,
  CartSummaryInfo,
  ClassInfo,
  ClassInvoiceFirstInstallmentInfo,
  CollectPaymentInfo,
  ColumnInfo,
  ContactStudentResponse,
  CourseDetailsInfo,
  FieldInfo,
  FieldSectionInfo,
  ForgotPasswordResponse,
  HeaderFooterInfo,
  MADisplayCartStudentInfo,
  PaymentProcessRequestInfo,
  SettingInfo,
  StudentRegisterResponseInfo,
  ThankyouPageResponseInfo,
} from '../models';
import { CART_URL } from '../util/constant';

const _selectedClasses: BehaviorSubject<ClassInfo[]> = new BehaviorSubject<ClassInfo[]>([]);

const _selectedClassIds: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
export const translatedWords: Map<string, string> = new Map<string, string>();

type classFilter = { [key: string]: string | number | null };

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  @Select(CartFilterState.selectedProgram)
  selectedProgram$!: Observable<number | null>;

  private _adminId: number = 0;
  private _multiple: boolean = false;

  private _header: BehaviorSubject<string | null>;
  private _footer: BehaviorSubject<string | null>;

  private _cartClassResponse: BehaviorSubject<CartClassResponse | null>;
  private _cartProgramResponse: BehaviorSubject<CartProgramResponse | null>;

  private _displayCartColumns: BehaviorSubject<ColumnInfo[]>;
  private _cartSummary: BehaviorSubject<CartSummaryInfo>;
  private _settingInfo: BehaviorSubject<SettingInfo>;
  couponCode = '';
  isInvalidCoupon: BehaviorSubject<boolean>;
  classListPage = CART_URL.course_link;
  cartOptions: BehaviorSubject<CartOptions>;
  private _currentUserType: number = 0;
  courseDesc: string | null = null;

  private _selectedCampus: number | null = -1;
  private _selectedDepartment: number | null = -1;
  private _selectedCategory: number | null = -1;
  private _selectedProgram: number | null = null;
  private _selectedProgramLevel: number | null = null;
  private _selectedSemester: number | null = null;
  private _selectedLocation: string | null = null;
  private _selectedStartDate: string | null = null;
  private _selectedEndDate: string | null = null;

  private _updatableStudentFields: BehaviorSubject<FieldInfo[]> = new BehaviorSubject<FieldInfo[]>([]);

  private _studentRegisterResponseInfo: StudentRegisterResponseInfo = {} as StudentRegisterResponseInfo;

  private _classIdPaymenPlanIdMap: BehaviorSubject<Map<number, number>> = new BehaviorSubject<Map<number, number>>(
    new Map()
  );

  constructor(private http: HttpClient) {
    this._header = new BehaviorSubject<string | null>(null);
    this._footer = new BehaviorSubject<string | null>(null);

    this._cartClassResponse = new BehaviorSubject<CartClassResponse | null>(null);
    this._cartProgramResponse = new BehaviorSubject<CartProgramResponse | null>(null);

    this._displayCartColumns = new BehaviorSubject<ColumnInfo[]>([]);
    this._cartSummary = new BehaviorSubject<CartSummaryInfo>({} as CartSummaryInfo);
    this._settingInfo = new BehaviorSubject<SettingInfo>({
      color: 'cartblue',
      currencySign: '$',
      dateFormat: 'M/d/yyyy',
      languageId: 0,
      timeZone: 'EST',
    });

    this.cartOptions = new BehaviorSubject<CartOptions>({});
    this.isInvalidCoupon = new BehaviorSubject<boolean>(false);
  }

  get adminId(): number {
    return this._adminId;
  }

  set adminId(adminId: number) {
    this._adminId = adminId;
  }

  get multiple(): boolean {
    return this._multiple;
  }

  set multiple(multiple: boolean) {
    this._multiple = multiple;
  }

  get currentUserType() {
    return this._currentUserType;
  }

  set currentUserType(userType: number) {
    this._currentUserType = userType;
  }

  get selectedCampus() {
    return this._selectedCampus;
  }

  set selectedCampus(campus: number | null) {
    this._selectedCampus = campus;
  }

  get selectedDepartment() {
    return this._selectedDepartment;
  }

  set selectedDepartment(department: number | null) {
    this._selectedDepartment = department;
  }

  get selectedCategory() {
    return this._selectedCategory;
  }

  set selectedCategory(category: number | null) {
    this._selectedCategory = category;
  }

  get selectedProgram() {
    return this._selectedProgram;
  }

  set selectedProgram(program: number | null) {
    this._selectedProgram = program;
  }

  get selectedProgramLevel() {
    return this._selectedProgramLevel;
  }

  set selectedProgramLevel(programLevel: number | null) {
    this._selectedProgramLevel = programLevel;
  }

  get selectedSemester() {
    return this._selectedSemester;
  }

  set selectedSemester(semester: number | null) {
    this._selectedSemester = semester;
  }

  get selectedLocation() {
    return this._selectedLocation;
  }

  set selectedLocation(location: string | null) {
    this._selectedLocation = location;
  }

  get selectedStartDate() {
    return this._selectedStartDate;
  }

  set selectedStartDate(startDate: string | null) {
    this._selectedStartDate = startDate;
  }

  get selectedEndDate() {
    return this._selectedEndDate;
  }

  set selectedEndDate(endDate: string | null) {
    this._selectedEndDate = endDate;
  }

  getSettingInfo() {
    return this._settingInfo.asObservable();
  }

  getSelectedClasses$() {
    return _selectedClasses.asObservable();
  }
  getSelectedClassIds() {
    return _selectedClassIds.asObservable();
  }

  header$ = () => {
    return this._header.asObservable();
  };

  footer$ = () => {
    return this._footer.asObservable();
  };

  cartClassResponse$ = () => {
    return this._cartClassResponse.asObservable();
  };
  getDisplayCartColumns() {
    return this._displayCartColumns.asObservable();
  }
  cartProgramResponse$ = () => {
    return this._cartProgramResponse.asObservable();
  };

  getCartSummary() {
    return this._cartSummary.asObservable();
  }

  get updatableStudentFields$() {
    return this._updatableStudentFields.asObservable();
  }

  get studentRegisterResponseInfo() {
    return this._studentRegisterResponseInfo;
  }

  get classIdPaymenPlanIdMap() {
    return this._classIdPaymenPlanIdMap;
  }

  addClassToCart(classId: number) {
    const classIds = _selectedClassIds.getValue();

    if (!classIds.includes(classId)) {
      _selectedClassIds.next(classIds.concat(classId));
    }
  }

  removeClassFromCart(classId: number) {
    const classIds = _selectedClassIds.getValue();
    const index = classIds.indexOf(classId);

    if (index > -1) {
      classIds.splice(index, 1);
      _selectedClassIds.next(classIds);
    }
  }

  isSelected(classId: number) {
    return _selectedClassIds.getValue().includes(classId);
  }

  translate(word: string) {
    return translatedWords.get(word) || word;
  }

  fetchTranslatedWords(words: string[]) {
    if (!words || words.length < 1) {
      return of({});
    }
    return this.http.post<{ [key: string]: string }>(`public/translated-words`, words).pipe(
      map((translations) => {
        for (const word in translations) {
          if (Object.prototype.hasOwnProperty.call(translations, word)) {
            translatedWords.set(word, translations[word]);
          }
        }

        return translations;
      }),
      take(1)
    );
  }

  isProgramLink() {
    return this.classListPage.startsWith(CART_URL.program_link);
  }
  isCourseLink() {
    return this.classListPage.startsWith(CART_URL.course_link);
  }
  isSearchProgramLink() {
    return this.classListPage.startsWith(CART_URL.search_program_link);
  }
  isSearchCourseLink() {
    return this.classListPage.startsWith(CART_URL.search_course_link);
  }

  getHeaderFooter() {
    return this.http.get<HeaderFooterInfo>('cart/header-footer').pipe(take(1), shareReplay());
  }

  //Dropdowns
  getCampusDropdown() {
    return this.http.get<SortedFieldInfo<any, any>>('cart/filter/campus').pipe(take(1), shareReplay());
  }

  getDepartmentDropdown() {
    return this.http.get<SortedFieldInfo<any, any>>('cart/filter/department').pipe(take(1), shareReplay());
  }

  getCategoryDropdown() {
    return this.http.get<SortedFieldInfo<any, any>>('cart/filter/course-category').pipe(take(1), shareReplay());
  }

  getProgramDropdown() {
    let url = `cart/filter/program?levelId=${this._selectedDepartment}`;
    if (this._selectedDepartment == null || this._selectedDepartment <= 0) {
      url = `cart/filter/program`;
    }

    return this.http.get<SortedFieldInfo<any, any>>(url).pipe(take(1), shareReplay());
  }

  getProgramLevelDropdown() {
    if (this._selectedProgram == null) {
      this.selectedProgram$.pipe(take(1)).subscribe((programId) => (this._selectedProgram = programId));
    }
    if (this._selectedProgram == null) {
      this._selectedProgram = 0;
    }
    const url = `cart/filter/program-level?programId=${this._selectedProgram}`;
    return this.http.get<SortedFieldInfo<any, any>>(url).pipe(take(1), shareReplay());
  }

  getSemesterDropdown() {
    return this.http.get<SortedFieldInfo<any, any>>('cart/filter/semester').pipe(take(1), shareReplay());
  }

  getLocationDropdown() {
    return this.http.get<SortedFieldInfo<any, any>>('cart/filter/location').pipe(take(1), shareReplay());
  }

  fatchSettings() {
    let retryCount = 0;
    return this.http
      .get<CartOptions>('cart/options')
      .pipe(take(1))
      .pipe(
        retryWhen((error) =>
          error.pipe(
            delay(1000),
            concatMap((err) => {
              retryCount++;
              if (retryCount < 2) return of(err);
              throw err;
            })
          )
        )
      );
  }

  //Start of Class list pages functions
  resetFilterValues() {
    this._selectedCampus = null;
    this._selectedDepartment = null;
    this._selectedCategory = null;
    this._selectedProgram = null;
    this._selectedProgramLevel = null;
    this._selectedSemester = null;
    this._selectedLocation = null;
    this._selectedStartDate = null;
    this._selectedEndDate = null;
  }
  private prepareClassFilters(): classFilter {
    const filter: classFilter = {};
    filter.levelId = this._selectedDepartment;
    filter.campusType = this._selectedCampus;

    if (this.isCourseLink() || this.isSearchCourseLink()) {
      filter.courseCategoryId = this._selectedCategory;
    } else if (this.isProgramLink() || this.isSearchProgramLink()) {
      filter.programId = this._selectedProgram;
      filter.semesterId = this._selectedSemester;
      filter.programLevelId = this._selectedProgramLevel;
    }

    if (this.isSearchProgramLink() || this.isSearchCourseLink()) {
      filter.programId = this._selectedProgram;
      filter.semesterId = this._selectedSemester;
      filter.programLevelId = this._selectedProgramLevel;
      filter.location = this._selectedLocation;

      if (this._selectedStartDate) {
        filter.startDate = formatDate(this._selectedStartDate, 'yyyy-MM-dd', 'en-US');
      }

      if (this._selectedEndDate) {
        filter.endDate = formatDate(this._selectedEndDate, 'yyyy-MM-dd', 'en-US');
      }
    }

    return filter;
  }

  prepareClassListUrl(): {
    url: string;
    method: 'get' | 'post';
    filter: classFilter;
  } {
    let url = 'cart/';
    if (this.multiple) {
      url += 'multiple/';
    }
    let method: 'get' | 'post' = 'get';
    if (this.classListPage.startsWith(CART_URL.program_link)) {
      url += 'program-list-with-courses';
    } else if (this.classListPage.startsWith(CART_URL.search_course_link)) {
      url += 'search-course-list-with-available-classes';
    } else if (this.classListPage.startsWith(CART_URL.search_program_link)) {
      url += 'search-program-list-with-courses';
    } else {
      url += 'course-list-with-available-classes';
    }

    const filter = this.prepareClassFilters();

    if (this.courseDesc) {
      filter.courseDescription = this.courseDesc;
    }
    if (
      this.classListPage.startsWith(CART_URL.program_link) ||
      this.classListPage.startsWith(CART_URL.search_program_link)
    ) {
      if (!filter.hasOwnProperty('programId')) {
        filter.programId = -1;
      } else if (filter.programId === 0) {
        filter.programId = -1;
      }
    }
    if (filter && Object.keys(filter).length !== 0) {
      const params = [];
      for (const key in filter) {
        if (filter[key] !== null && filter[key] !== undefined) {
          params.push(key + '=' + filter[key]);
        }
      }
      const queryParam = params.join('&');
      if (params.length) url = url + '?' + queryParam;
    }

    return { url: url, method: method, filter: filter };
  }

  fetchAvailableClasses(): Observable<CartClassResponse | CartProgramResponse | null> {
    let url = this.prepareClassListUrl();

    if (this.isCourseLink() || this.isSearchCourseLink()) {
      return this.http.get<CartClassResponse>(url.url).pipe(
        tap((cartResponse) => {
          this._cartClassResponse.next(cartResponse);
        }),
        take(1),
        shareReplay()
      );
    } else if (this.isProgramLink() || this.isSearchProgramLink()) {
      return this.http.get<CartProgramResponse>(url.url).pipe(
        tap((cartResponse) => {
          this._cartProgramResponse.next(cartResponse);
        }),
        take(1),
        shareReplay()
      );
    }
    return of(null).pipe(take(1));
  }

  fetchCourseDetails(courseId: number) {
    if (this.adminId <= 0 || courseId <= 0) {
      return;
    }
    const multiple = this.multiple ? 'multiple/' : '';
    const url = `cart/${multiple}view-description?courseId=${courseId}`;
    return this.http.get<CourseDetailsInfo>(url).pipe(take(1), shareReplay());
  }
  //End of class list pages functions

  //// Display cart functions
  checkClassPassCode(classId: number, passCode: string) {
    const url = `cart/check-passcode?classId=${classId}&passCode=${passCode}`;
    return this.http.get<any>(url).pipe(take(1), shareReplay());
  }

  fetchDisplayCartClasses(classIds: number[], couponCode: string) {
    const requestBody = {
      classIds: classIds.filter((classId) => classId > 0),
      couponCode: couponCode,
    };

    type returnType = {
      datatableColumns: ColumnInfo[];
      classes: ClassInfo[];
      cartSummary: CartSummaryInfo;
    };

    const multiple = this.multiple ? 'multiple/' : '';
    const url = `cart/${multiple}display-cart`;
    return this.http.post<returnType>(url, requestBody).pipe(take(1), shareReplay());
  }

  fetchDisplayCartClassesMultiple(displayCartStudents: MADisplayCartStudentInfo[], couponCode: string) {
    const requestBody = {
      displayCartStudents: displayCartStudents,
      couponCode: couponCode,
    };

    type returnType = {
      datatableColumns: ColumnInfo[];
      classes: ClassInfo[];
      cartSummary: CartSummaryInfo;
    };

    const url = `cart/multiple/display-cart`;
    return this.http.post<returnType>(url, requestBody).pipe(
      switchMap((response) => {
        if (response.classes.length > 0) {
          return of(response);
        }
        return this.http.post<returnType>(url, requestBody);
      }),
      take(1),
      shareReplay()
    );
  }

  shareCourse(payload: any) {
    const multiple = this.multiple ? 'multiple/' : '';
    const url = `cart/${multiple}share-course`;
    return this.http.post<any>(url, payload).pipe(first(), shareReplay());
  }

  /********** Registration and login functions **************/
  login(formValues: any) {
    const multiple = this.multiple ? 'multiple/' : '';
    const url = `cart/registration/${multiple}student/login`;
    return this.http.post<any>(url, formValues).pipe(
      tap((response) => this._updatableStudentFields.next(response)),
      take(1),
      shareReplay()
    );
  }
  loginContact(formValues: any) {
    const multiple = this.multiple ? 'multiple/' : '';
    const url = `cart/registration/${multiple}contact/login`;
    return this.http.post<any>(url, formValues).pipe(
      tap((response) => this._updatableStudentFields.next(response)),
      take(1),
      shareReplay()
    );
  }
  updatableStudentInfo(formValues: any) {
    if (!formValues) {
      formValues = {};
    }
    const multiple = this.multiple ? 'multiple/' : '';
    const url = `cart/registration/${multiple}student/login/save`;
    return this.http.post<any>(url, formValues).pipe(
      tap((response) => (this._studentRegisterResponseInfo = response)),
      take(1),
      shareReplay()
    );
  }
  getStudentFields() {
    const multiple = this.multiple ? 'multiple/' : '';
    const url = `cart/registration/${multiple}student/fields`;
    return this.http.get<FieldSectionInfo[]>(url).pipe(take(1), shareReplay());
  }
  getContactFields() {
    const multiple = this.multiple ? 'multiple/' : '';
    const url = `cart/registration/${multiple}contact/fields`;
    return this.http.get<FieldSectionInfo[]>(url).pipe(take(1), shareReplay());
  }
  registerStudent(payLoad: any) {
    const multiple = this.multiple ? 'multiple/' : '';
    const url = `cart/registration/${multiple}student/register`;
    return this.http.post<any>(url, payLoad).pipe(take(1), shareReplay());
  }

  registerContact(payLoad: any) {
    const multiple = this.multiple ? 'multiple/' : '';
    const url = `cart/registration/${multiple}contact/register`;
    return this.http.post<any>(url, payLoad).pipe(take(1), shareReplay());
  }

  fetchGroupStudentFields() {
    const url = 'cart/registration/contact/student-registration-fields';
    return this.http.get<any>(url).pipe(take(1), shareReplay());
  }

  saveGroupStudent(payLoad: any) {
    const url = 'cart/registration/contact/save-student';
    return this.http.post<ContactStudentResponse>(url, payLoad).pipe(take(1), shareReplay());
  }

  saveGroupEnrollment(payLoad: any) {
    const multiple = this.multiple ? 'multiple/' : '';
    const url = `cart/registration/${multiple}contact/save-group-enrollment`;
    return this.http.post<any>(url, payLoad).pipe(take(1), shareReplay());
  }

  requestPassword(payload: any, userType: 1 | 99) {
    const multiple = this.multiple ? 'multiple/' : '';
    const user = userType === 1 ? 'student' : 'contact';
    const url = `cart/registration/${user}/forgot-password`;
    return this.http.post<ForgotPasswordResponse>(url, payload).pipe(take(1), shareReplay());
  }

  checkStudentEmailExist(email: string) {
    const url = 'cart/registration/check-student-email-exist';
    const options = { params: { email: email } };
    return this.http.get<{ isExist: boolean }>(url, options).pipe(take(1), shareReplay());
  }

  checkContactEmailExist(email: string) {
    const url = 'cart/registration/check-contact-email-exist';
    const options = { params: { email: email } };
    return this.http.get<{ isExist: boolean }>(url, options).pipe(take(1), shareReplay());
  }

  checkStudentUsernameExist(username: string) {
    const url = 'cart/registration/check-student-username-exist';
    const options = { params: { username: username } };
    return this.http.get<{ isExist: boolean }>(url, options).pipe(take(1), shareReplay());
  }

  checkContactUsernameExist(username: string) {
    const url = 'cart/registration/check-contact-username-exist';
    const options = { params: { username: username } };
    return this.http.get<{ isExist: boolean }>(url, options).pipe(take(1), shareReplay());
  }

  getAge(dateOfBirth: string) {
    if (!dateOfBirth) throw new Error('Invalid date.');

    const url = 'cart/multiple/calculate-age';
    const options = { params: { dateOfBirth: dateOfBirth } };
    return this.http.get<{ age: number }>(url, options).pipe(take(1), shareReplay());
  }

  /************** Payments ********************/

  getCollectPaymentInfo() {
    const regType = this.currentUserType == 99 ? 2 : 1;
    const multiple = this.multiple ? 'multiple/' : '';
    const url = `cart/payment/${multiple}collect-payment-info?regType=${regType}`;
    return this.http.get<CollectPaymentInfo>(url).pipe(
      tap((data) => {
        const map = new Map();
        data.classes.every((clazz) => map.set(clazz.classId, 0));
        this._classIdPaymenPlanIdMap.next(map);
      }),
      take(1),
      shareReplay()
    );
  }

  fetchPaymentScheduleByClass(classId: number, paymentPlanId: number, studentId: number) {
    const payload = {
      classId: classId,
      paymentPlanId: paymentPlanId,
      studentId: studentId,
    };
    const multiple = this.multiple ? 'multiple/' : '';
    const url = `cart/payment/${multiple}class-invoice-installments`;
    return this.http.post<ClassInvoiceFirstInstallmentInfo>(url, payload).pipe(take(1), shareReplay());
  }
  updateClassIdPaymentPlanMap(classId: number, paymentPlanId: number) {
    this._classIdPaymenPlanIdMap.next(this._classIdPaymenPlanIdMap.value.set(classId, paymentPlanId));
  }
  addRemoveIndividualFee(payLoad: any) {
    const multiple = this.multiple ? 'multiple/' : '';
    const url = `cart/payment/${multiple}add-delete-individual-fee`;
    return this.http.post(url, payLoad).pipe(take(1), shareReplay());
  }

  fetchBillingInfo(regType: number, paymentMethod: string) {
    const multiple = this.multiple ? 'multiple/' : '';
    const url = `cart/payment/${multiple}billing-info?regType=${regType}&paymentMethod=${paymentMethod}`;
    return this.http.get<CartBillingResponseInfo>(url).pipe(take(1), shareReplay());
  }

  fetchStates(countryCode: string) {
    const url = 'public/states';
    const options = { params: { countryCode: countryCode } };
    return this.http.get<any>('public/states', options).pipe(take(1), shareReplay());
  }

  fetchCayanWebApiKey() {
    const multiple = this.multiple ? 'multiple/' : '';
    const url = `cart/payment/${multiple}cayan-web-api-key`;
    return this.http.get<{ cayanWebApiKey: string }>(url).pipe(take(1), shareReplay());
  }

  processPayment(payLoad: PaymentProcessRequestInfo) {
    const multiple = this.multiple ? 'multiple/' : '';
    const url = `cart/payment/${multiple}process-payment`;
    return this.http.post<ThankyouPageResponseInfo>(url, payLoad).pipe(take(1), shareReplay());
  }

  fetchThankYouInfo(isMultiple: boolean) {
    const multiple = isMultiple ? 'multiple/' : '';
    const url = `cart/${multiple}thankyou`;
    return this.http.get<ThankyouPageResponseInfo>(url).pipe(take(1), shareReplay());
  }

  /*************** end of payments ************************/
  // Navigation functions
  getClassListPage() {
    return `${this.getBaseUrl()}${this.classListPage}/${this.adminId}`;
  }

  getBaseUrl() {
    return CART_URL.cart_root + (this.multiple ? 'multiple/' : '');
  }

  goRegistrationPage(router: Router) {
    let url = this.getBaseUrl() + CART_URL.registration;
    router.navigateByUrl(`${url}/${this.adminId}`);
  }
  goLoginPage(router: Router) {
    const url = this.getBaseUrl() + CART_URL.login;
    router.navigateByUrl(`${url}/${this.adminId}`);
  }
  goToUpdateStudentPage(router: Router) {
    const url = this.getBaseUrl() + CART_URL.update_student;
    router.navigateByUrl(`${url}/${this.adminId}`);
  }
  goCreateAccountPage(router: Router) {
    const url = this.getBaseUrl() + CART_URL.create_account;
    router.navigateByUrl(`${url}/${this.adminId}`);
  }
  goToGroupRegisterPage(router: Router) {
    const url = this.getBaseUrl() + CART_URL.group_register;
    router.navigateByUrl(`${url}/${this.adminId}`);
  }
  goToRequestPasswordPage(router: Router) {
    const url = this.getBaseUrl() + CART_URL.request_password;
    router.navigateByUrl(`${url}/${this.adminId}`);
  }
  goToCheckoutPage(router: Router) {
    const url = this.getBaseUrl() + CART_URL.checkout;
    router.navigateByUrl(`${url}/${this.adminId}`);
  }
  goToBillingPage(router: Router) {
    const url = this.getBaseUrl() + CART_URL.billing;
    router.navigateByUrl(`${url}/${this.adminId}`);
  }
  goToThankyouPage(router: Router) {
    const url = this.getBaseUrl() + CART_URL.thankyou;
    router.navigateByUrl(`${url}/${this.adminId}`);
  }

  required(title: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      let hasNoValue = control.value === undefined || control.value === null;

      if (typeof control.value === 'string') {
        hasNoValue = hasNoValue || control.value.trim() === '';
      }
      return hasNoValue ? { message: title + ' ' + this.translate('is required.') } : null;
    };
  }

  checkboxRequired(message: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value ? null : { message: this.translate(message) };
    };
  }

  number(minLength: number = Number.MIN_SAFE_INTEGER, maxLength: number = Number.MAX_SAFE_INTEGER) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        const regexNumber: RegExp = new RegExp(/^-?[0-9]\d*$/gim);
        const stringValue = String(control.value);
        let message = '';

        if (stringValue.match(regexNumber) === null) {
          message = this.translate('Please enter only number.');
        } else if (stringValue.length < minLength) {
          const minMsg = this.translate('Please enter at least');
          message = `${minMsg} ${minLength} ${this.translate('digits.')}`;
        } else if (stringValue.length > maxLength) {
          const maxMsg = this.translate('Please enter no more than');
          message = `${maxMsg} ${minLength} ${this.translate('digits.')}`;
        }

        if (message) {
          return { message: message };
        }
      }

      return null;
    };
  }

  positiveNumber(minLength: number, maxLength: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        const regexPositive: RegExp = new RegExp(/^[0-9]\d*$/);
        const stringValue = String(control.value);
        let message = '';

        if (stringValue.match(regexPositive) === null) {
          message = this.translate('Please enter only positive number.');
        } else if (stringValue.length < minLength) {
          const minMsg = this.translate('Please enter at least');
          message = `${minMsg} ${minLength} ${this.translate('digits.')}`;
        } else if (stringValue.length > maxLength) {
          const maxMsg = this.translate('Please enter no more than');
          message = `${maxMsg} ${minLength} ${this.translate('digits.')}`;
        }

        if (message) {
          return { message: message };
        }
      }

      return null;
    };
  }

  asyncUsername(userType: 0 | 1 | 99) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (control.value) {
        const message = this.translate('Username exist, please try another one.');
        if (userType === 1) {
          return this.checkStudentUsernameExist(control.value).pipe(
            map((response) => (response.isExist ? { message: message } : null))
          );
        }

        if (userType === 99) {
          return this.checkContactUsernameExist(control.value).pipe(
            map((response) => (response.isExist ? { message: message } : null))
          );
        }
      }
      return of(null);
    };
  }

  password() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value.length < 8) {
        let message = 'Password must be at least 8 characters long.';
        return { message: this.translate(message) };
      }
      return null;
    };
  }

  letter(minLength: number = 0, maxLength: number = 250) {
    return (control: AbstractControl): ValidationErrors | null => {
      const regex: RegExp = new RegExp(/^[ña-z\s]*$/gi);
      const stringValue = String(control.value);
      let message = '';
      if (stringValue.match(regex) === null) {
        message = this.translate('Please enter letters including ñ and space only.');
      } else if (stringValue.length < minLength) {
        const minMsg = this.translate('Please enter at least');
        message = `${minMsg} ${minLength} ${this.translate('letters including ñ and space.')}`;
      } else if (stringValue.length > maxLength) {
        const maxMsg = this.translate('Please enter no more than');
        message = `${maxMsg} ${maxLength} ${this.translate('letters including ñ and space.')}`;
      }

      if (message) {
        return { message: message };
      }

      return null;
    };
  }

  asyncEmailMultiple(exEmails: string[], formGroups: FormGroup[]) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const message = 'This email already exists. Please use another email.';
      if (exEmails.includes(control.value)) {
        return of({ message: this.translate(message) });
      }
      let count = 0;
      const length = formGroups.length;
      for (let i = 0; i < length; i++) {
        const formGroup: FormGroup = formGroups[i];
        if (formGroup.controls['email'].value === control.value) {
          count++;
        }
      }
      if (count > 1) {
        return of({ message: this.translate(message) });
      }
      if (control.value) {
        return this.checkStudentEmailExist(control.value)
          .pipe(
            switchMap((response) => {
              if (response.isExist) {
                return of({ message: this.translate(message) });
              }

              return this.checkStudentUsernameExist(control.value).pipe(
                map((response) => (response.isExist ? { message: this.translate(message) } : null))
              );
            })
          )
          .pipe(take(1));
      }
      return of(null);
    };
  }

  email(title: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const regex: RegExp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.[a-zA-Z]{2,6})+$/gi);

      if (value && value.trim().length && String(value).match(regex) === null) {
        return { message: title + ' ' + this.translate('is invalid.') };
      }
      return null;
    };
  }

  asyncMinimumAge(minimumAge: number | null | undefined) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      let dateOfBirth = control.value;
      console.log(dateOfBirth);

      if (minimumAge && dateOfBirth) {
        if (typeof dateOfBirth !== 'string') {
          dateOfBirth = dateOfBirth.format('yyyy-MM-DD');
        }
        return this.getAge(dateOfBirth).pipe(
          map(
            (response) => {
              if (response.age < minimumAge) {
                const part1 = this.translate('Student must be');
                const part2 = this.translate('years old to attend this class.');
                return { message: `${part1} ${minimumAge} ${part2}` };
              }
              return null;
            },
            (errors: any) => of(null)
          )
        );
      }
      return of(null);
    };
  }

  minimumAge(minimumAge: number | null | undefined, dateFormat: string = 'YYYY-MM-DD') {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value || !minimumAge) {
        return null;
      }
      let m: moment.Moment | null = null;
      if (typeof value === 'string' && moment(value, dateFormat, true).isValid()) {
        m = moment(value, dateFormat, true);
      }

      if (value && moment.isMoment(value)) {
        m = value;
      }
      if (m) {
        const age = Number(moment().diff(m, 'years', true).toFixed(2));
        if (age < minimumAge) {
          return {
            message: `Student must be ${minimumAge} years old to attend this class`,
          };
        }
      }
      return null;
    };
  }
}
