import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { patch, append, removeItem, updateItem } from '@ngxs/store/operators';
import {
  CartOptions,
  CartPaymentPlanMap,
  CartSummaryInfo,
  ClassInfo,
  ColumnInfo,
  ContactStudentResponse,
  FieldInfo,
  FieldSectionInfo,
  MADisplayCartStudentInfo,
  SettingInfo,
  StudentRegisterResponseInfo,
  ThankyouPageResponseInfo,
} from '../models';
import { take, tap } from 'rxjs/operators';
import { LSItemName } from '../util/constant';
import { of } from 'rxjs';

/************ Actions *********************/

export class AddCartHeader {
  static readonly type = '[ShoppingCart] AddCartHeader';
  constructor(public header: string) {}
}

export class AddCartFooter {
  static readonly type = '[ShoppingCart] AddCartFooter';
  constructor(public footer: string) {}
}

export class AddCartSettings {
  static readonly type = '[ShoppingCart] AddCartSettings';
  constructor(public settings: SettingInfo) {}
}

export class FetchCartOptions {
  static readonly type = '[ShoppingCart] FetchCartOptions';
  constructor() {}
}

export class ResetFromLocalStorage {
  static readonly type = '[ShoppingCart] ResetFromLocalStorage';
  constructor(public classIds: number[]) {}
}
export class AddToCart {
  static readonly type = '[ShoppingCart] AddToCart';
  constructor(public classIds: number[], public updateLocalStorage: boolean = true) {}
}
export class RemoveFromCart {
  static readonly type = '[ShoppingCart] RemoveFromCart';
  constructor(public classId: number) {}
}

export class RemoveAllFromCart {
  static readonly type = '[ShoppingCart] RemoveAllFromCart';
  constructor() {
    /* Intentionally left blank */
  }
}

export class LoadSelectedClasses {
  static readonly type = '[ShoppingCart] LoadSelectedClasses';
  constructor(public couponCode: string) {}
}

export class LoadSelectedClassesMultiple {
  static readonly type = '[ShoppingCart] LoadSelectedClassesMultiple';
  constructor(public couponCode: string) {}
}

export class UpdateUserCouponCode {
  static readonly type = '[ShoppingCart] UpdateUserCouponCode';
  constructor(public couponCode: string | null) {}
}

export class UpdateCurrentUserType {
  static readonly type = '[ShoppingCart] UpdateCurrentUserType';
  constructor(public currentUserType: 0 | 1 | 99) {}
}

export class UpdateRegistration {
  static readonly type = '[ShoppingCart] UpdateRegistration';
  constructor(public regType: 0 | 1 | 2, public authorizedStudentId: number, public authorizedContactId: number) {}
}
export class UpdateStudentRegistration {
  static readonly type = '[ShoppingCart] UpdateStudentRegistration';
  constructor(public regType: 0 | 1 | 2, public authorizedStudentId: number) {}
}

export class UpdateContactRegistration {
  static readonly type = '[ShoppingCart] UpdateContactRegistration';
  constructor(public regType: 0 | 1 | 2) {}
}
export class UpdateGroupStudentFields {
  static readonly type = '[ShoppingCart] UpdateGroupStudentFields';
  constructor(public fields: FieldSectionInfo[], public updateLS: boolean = true) {}
}

export class UpdateMADisplayCartStudents {
  static readonly type = '[ShoppingCart] UpdateMADisplayCartStudents';
  constructor(public maDisplayCartStudentInfo: MADisplayCartStudentInfo[], public removeExisting: boolean = false) {}
}

export class UpdateClassIdAndPaymentPlanMapFromLStorage {
  static readonly type = '[ShoppingCart] UpdateClassIdAndPaymentPlanMapFromLStorage';
  constructor(public paymentPlanMap: CartPaymentPlanMap[]) {}
}

export class UpdateClassIdAndPaymentPlanMap {
  static readonly type = '[ShoppingCart] UpdateClassIdAndPaymentPlanMap';
  constructor(public paymentPlanMap: CartPaymentPlanMap) {}
}
export class UpdateThankYouPageResponse {
  static readonly type = '[ShoppingCart] UpdateThankYouPageResponse';
  constructor(public thankyouPageResponseInfo: ThankyouPageResponseInfo) {}
}
export class UpdatePassedCodes {
  static readonly type = '[ShoppingCart] UpdatePassedCodes';
  constructor(public classId: number, public passed: boolean) {}
}

export class UpdateAllPassedCodes {
  static readonly type = '[ShoppingCart] UpdateAllPassedCodes';
  constructor(public passedCodes: { [key: string]: boolean }) {}
}

export class UpdateScreenChange {
  static readonly type = '[ShoppingCart] UpdateScreenChange';
  constructor(public mobileView: boolean) {}
}

export class UpdateGroupStudents {
  static readonly type = '[ShoppingCart] UpdateGroupStudents';
  constructor(public groupStudents: ContactStudentResponse[]) {}
}

export class UpdateSingleStudentInfo {
  static readonly type = '[ShoppingCart] UpdateSingleStudentInfo';
  constructor(public singleStudentInfo: { [key: string]: any }) {}
}

/************ End of Actions *********************/

export interface CartState {
  header: string | null;
  footer: string | null;
  settings: SettingInfo | null;
  cartOptions: CartOptions | null;
  selectedClassIds: number[];
  selectedClasses: ClassInfo[];
  displayCartColumns: ColumnInfo[];
  cartSummary: CartSummaryInfo;
  couponCode?: string;
  userCouponCode: string | null;
  isInvalidCoupon?: boolean;
  currentUserRole?: number;
  passedCodes: { [key: string]: boolean };

  registration: {
    regType: 0 | 1 | 2;
    authorizedStudentId: number;
    authorizedContactId: number;
    contactStudentIds: number[];
    updatableStudentFields: FieldInfo[];
    studentRegisterResponseInfo: StudentRegisterResponseInfo;
    groupStudentFields: FieldSectionInfo[];
    currentUserType: 0 | 1 | 99;
    groupStudents: ContactStudentResponse[];
    singleStudentInfo: { [key: string]: any } | null;
  };
  classIdPaymentPlanIdMap: CartPaymentPlanMap[];
  thankyouPageResponseInfo: ThankyouPageResponseInfo;
  maDisplayCartStudents: MADisplayCartStudentInfo[];
  mobileView: boolean;
}

const defaultState: CartState = {
  header: null,
  footer: null,
  settings: null,
  cartOptions: null,
  selectedClassIds: [],
  selectedClasses: [],
  displayCartColumns: [],
  cartSummary: {} as CartSummaryInfo,
  passedCodes: {},
  userCouponCode: null,

  registration: {
    regType: 0,
    authorizedStudentId: 0,
    authorizedContactId: 0,
    contactStudentIds: [],
    updatableStudentFields: [],
    studentRegisterResponseInfo: {} as StudentRegisterResponseInfo,
    groupStudentFields: [],
    currentUserType: 0,
    groupStudents: [],
    singleStudentInfo: null,
  },
  classIdPaymentPlanIdMap: [],
  thankyouPageResponseInfo: {} as ThankyouPageResponseInfo,
  maDisplayCartStudents: [],
  mobileView: false,
};

@State<CartState>({
  name: 'shoppingcart',
  defaults: defaultState,
})
@Injectable()
export class ShoppingCartState {
  constructor(private cartService: ShoppingCartService) {}
  @Selector()
  static header(cartState: CartState): string | null {
    return cartState.header;
  }
  @Selector()
  static footer(cartState: CartState): string | null {
    return cartState.footer;
  }
  @Selector()
  static settings(cartState: CartState): SettingInfo | null {
    return cartState.settings;
  }
  @Selector()
  static cartOptions(cartState: CartState): CartOptions | null {
    return cartState.cartOptions;
  }
  @Selector()
  static cartItemCountSingle(cartState: CartState) {
    return cartState.selectedClassIds.length;
  }
  @Selector()
  static cartItemCount(cartState: CartState) {
    return (multiple: boolean) => {
      if (multiple) {
        let multipleSelectedClassIds: number[] = [];
        for (let i = 0; i < cartState.maDisplayCartStudents.length; i++) {
          multipleSelectedClassIds = Array.from(
            new Set(multipleSelectedClassIds.concat(cartState.maDisplayCartStudents[i].classIds))
          );
        }
        return multipleSelectedClassIds.length;
      } else {
        return cartState.selectedClassIds.length;
      }
    };
  }

  @Selector()
  static selectedClassIds(cartState: CartState) {
    return (multiple: boolean) => {
      if (multiple) {
        let multipleSelectedClassIds: number[] = [];
        for (let i = 0; i < cartState.maDisplayCartStudents.length; i++) {
          multipleSelectedClassIds = Array.from(
            new Set(multipleSelectedClassIds.concat(cartState.maDisplayCartStudents[i].classIds))
          );
        }
        return multipleSelectedClassIds;
      } else {
        return cartState.selectedClassIds;
      }
    };
  }

  @Selector()
  static displayCartColumns(cartState: CartState): ColumnInfo[] {
    return cartState.displayCartColumns;
  }

  @Selector()
  static selectedClasses(cartState: CartState): ClassInfo[] {
    return cartState.selectedClasses;
  }

  @Selector()
  static cartSummary(cartState: CartState): CartSummaryInfo {
    return cartState.cartSummary;
  }

  @Selector()
  static couponCode(cartState: CartState): string {
    return cartState.cartSummary.couponCode;
  }

  @Selector()
  static userCouponCode(cartState: CartState): string | null {
    return cartState.userCouponCode;
  }

  @Selector()
  static isInvalidCoupon(cartState: CartState): boolean | undefined {
    return cartState.isInvalidCoupon;
  }

  @Selector()
  static registration(cartState: CartState) {
    return cartState.registration;
  }

  @Selector()
  static currentUserType(cartState: CartState): 0 | 1 | 99 {
    return cartState.registration.currentUserType;
  }

  @Selector()
  static isAuthorized(cartState: CartState): boolean {
    return (
      cartState.registration.regType !== 0 &&
      (cartState.selectedClassIds.length > 0 || cartState.maDisplayCartStudents.length > 0)
    );
  }

  @Selector()
  static studentIds(cartState: CartState): number[] {
    let studentIds: number[] = [];
    if (cartState.registration.regType == 1) {
      studentIds.push(cartState.registration.authorizedStudentId);
    } else if (cartState.registration.regType == 2) {
      studentIds = cartState.registration.contactStudentIds;
    }
    return studentIds;
  }

  @Selector()
  static classIdAndPaymentPlanMap(cartState: CartState): CartPaymentPlanMap[] {
    if (cartState.classIdPaymentPlanIdMap.length === 0) {
      let map: CartPaymentPlanMap[] = [];
      for (let i = 0; i < cartState.selectedClassIds.length; i++) {
        map.push({ classId: cartState.selectedClassIds[i], paymentPlanId: 0, studentId: 0 });
      }
      return map;
    }
    return cartState.classIdPaymentPlanIdMap;
  }

  @Selector()
  static regType(cartState: CartState): 0 | 1 | 2 {
    return cartState.registration.regType;
  }

  @Selector()
  static groupStudentFields(cartState: CartState): FieldSectionInfo[] {
    return cartState.registration.groupStudentFields;
  }

  @Selector()
  static thankYouPageResponse(cartState: CartState): ThankyouPageResponseInfo {
    return cartState.thankyouPageResponseInfo;
  }

  @Selector()
  static maDisplayCartStudents(cartState: CartState): MADisplayCartStudentInfo[] {
    return cartState.maDisplayCartStudents;
  }

  @Selector()
  static passedCodes(cartState: CartState): { [key: string]: boolean } {
    return cartState.passedCodes;
  }

  @Selector()
  static mobileView(cartState: CartState): boolean {
    return cartState.mobileView;
  }

  @Selector()
  static groupStudents(cartState: CartState): ContactStudentResponse[] {
    return cartState.registration.groupStudents;
  }

  @Selector()
  static singleStudentInfo(cartState: CartState): { [key: string]: any } | null {
    return cartState.registration.singleStudentInfo;
  }

  @Action(UpdateScreenChange)
  updateScreenChange(ctx: StateContext<CartState>, action: UpdateScreenChange) {
    ctx.patchState({ mobileView: action.mobileView });
  }

  @Action(UpdateGroupStudents)
  updateGroupStudent(ctx: StateContext<CartState>, action: UpdateGroupStudents) {
    const state = ctx.getState();
    ctx.patchState({ registration: { ...state.registration, groupStudents: action.groupStudents } });
  }

  @Action(UpdatePassedCodes)
  updatePassedCodes(ctx: StateContext<CartState>, action: UpdatePassedCodes) {
    const newPassedCodes: { [key: string]: boolean } = {};
    const passedCodes = ctx.getState().passedCodes;
    for (const key of Object.keys(passedCodes)) {
      newPassedCodes[key] = passedCodes[key];
    }
    newPassedCodes['classId' + action.classId] = action.passed;
    ctx.patchState({ passedCodes: newPassedCodes });
    localStorage.setItem(LSItemName.SCART_PASSED_CODES, JSON.stringify(newPassedCodes));
  }

  @Action(UpdateAllPassedCodes)
  updateAllPassedCodes(ctx: StateContext<CartState>, action: UpdateAllPassedCodes) {
    ctx.patchState({ passedCodes: action.passedCodes });
  }

  @Action(AddCartHeader)
  addCartHeader(ctx: StateContext<CartState>, action: AddCartHeader) {
    ctx.patchState({ header: action.header });
  }

  @Action(AddCartFooter)
  addCartFooter(ctx: StateContext<CartState>, action: AddCartFooter) {
    ctx.patchState({ footer: action.footer });
  }

  @Action(AddCartSettings)
  addCartSettings(ctx: StateContext<CartState>, action: AddCartSettings) {
    ctx.patchState({ settings: action.settings });
  }

  @Action(FetchCartOptions)
  fetchCartOptions(ctx: StateContext<CartState>) {
    return this.cartService.fatchSettings().pipe(
      tap((options) => {
        if (options) {
          const settingInfo: SettingInfo = {
            color: options.color,
            currencySign: options.currencySign,
            dateFormat: options.dateFormat,
            languageId: options.languageId,
            timeZone: options.timeZone,
          };
          ctx.patchState({ cartOptions: options, settings: settingInfo });
        }
      })
    );
  }

  @Action(ResetFromLocalStorage)
  resetFromLocalStorage(ctx: StateContext<CartState>, action: ResetFromLocalStorage) {
    ctx.setState(patch({ selectedClassIds: action.classIds }));
  }

  @Action(AddToCart)
  addToCart(ctx: StateContext<CartState>, action: AddToCart) {
    const exClassIds = ctx.getState().selectedClassIds;
    const newClassIds = action.classIds.filter((classId) => exClassIds.includes(classId) === false);
    if (newClassIds.length) {
      ctx.setState(patch({ selectedClassIds: append(newClassIds) }));

      if (action.updateLocalStorage) {
        const cartState = ctx.getState();
        this.updateLStorageSelectedClassIds(cartState.selectedClassIds);
      }
    }
  }

  @Action(RemoveFromCart)
  removeFromClass(ctx: StateContext<CartState>, action: RemoveFromCart) {
    ctx.setState(patch({ selectedClassIds: removeItem<number>((classId) => classId == action.classId) }));
    const cartState = ctx.getState();
    this.updateLStorageSelectedClassIds(cartState.selectedClassIds);
  }

  @Action(RemoveAllFromCart)
  removeAllFromCart(ctx: StateContext<CartState>, action: RemoveAllFromCart) {
    ctx.setState(defaultState);

    this.updateLStorageSelectedClassIds([]);
    localStorage.setItem(LSItemName.SCART_GROUP_REG_STD_FIELDS, JSON.stringify([]));
  }

  @Action(LoadSelectedClasses)
  loadSelectedClasses(ctx: StateContext<CartState>, action: LoadSelectedClasses) {
    const classIds = ctx.getState().selectedClassIds;
    if (classIds.length <= 0) {
      return of(null);
    }
    return this.cartService.fetchDisplayCartClasses(classIds, action.couponCode).pipe(
      tap(
        (response) => {
          if (response) {
            this.updateDisplayCartData(ctx, response.classes, response.datatableColumns, response.cartSummary);
            this.updateCouponCode(ctx, action.couponCode, response.cartSummary);
          }
        },
        (errors) => this.handleSelectedClassFetchError(ctx, errors)
      )
    );
  }

  @Action(LoadSelectedClassesMultiple)
  loadSelectedClassesMultiple(ctx: StateContext<CartState>, action: LoadSelectedClassesMultiple) {
    const displayCartStudents = ctx.getState().maDisplayCartStudents;
    if (!displayCartStudents.length) {
      ctx.dispatch(new RemoveAllFromCart());
      return of(null);
    }
    return this.cartService.fetchDisplayCartClassesMultiple(displayCartStudents, action.couponCode).pipe(
      tap(
        (response) => {
          if (response) {
            this.updateDisplayCartData(ctx, response.classes, response.datatableColumns, response.cartSummary);
            this.updateCouponCode(ctx, action.couponCode, response.cartSummary);
          }
        },
        (errors) => this.handleSelectedClassFetchError(ctx, errors)
      )
    );
  }

  private updateDisplayCartData(
    ctx: StateContext<CartState>,
    classes: ClassInfo[],
    cols: ColumnInfo[],
    summary: CartSummaryInfo
  ) {
    ctx.patchState({ selectedClasses: classes, displayCartColumns: cols, cartSummary: summary });
  }

  private updateCouponCode(ctx: StateContext<CartState>, userCouponCode: string, cartSummary: CartSummaryInfo) {
    if (cartSummary) {
      if (userCouponCode === undefined || userCouponCode === null || userCouponCode.trim() === '') {
        ctx.patchState({ couponCode: cartSummary.couponCode });
      } else if (cartSummary.discount <= 0) {
        ctx.patchState({ userCouponCode: null, couponCode: '', isInvalidCoupon: true });
        localStorage.removeItem(LSItemName.SCART_USER_COUPON_CODE);
      } else {
        const code = cartSummary.couponCode;
        ctx.patchState({ couponCode: code, userCouponCode: code, isInvalidCoupon: false });
        localStorage.setItem(LSItemName.SCART_USER_COUPON_CODE, code);
      }
    }
  }

  private handleSelectedClassFetchError(ctx: StateContext<CartState>, errors: any) {
    const error = errors.error.error;
    let isInvalidCoupon = false;
    if (error.hasOwnProperty('error')) {
      const errorCode = error.error.code;
      const errorField = error.error.fieldName;
      isInvalidCoupon = errorCode === 103 && errorField && errorField === 'couponCode';
    }
    if (isInvalidCoupon) {
      ctx.patchState({ userCouponCode: null, couponCode: '', isInvalidCoupon: true });
      localStorage.removeItem(LSItemName.SCART_USER_COUPON_CODE);
    } else {
      ctx.patchState({ selectedClassIds: [], maDisplayCartStudents: [], passedCodes: {} });
      this.updateLStorageSelectedClassIds([]);
      localStorage.setItem(LSItemName.SCART_PASSED_CODES, JSON.stringify({}));
      localStorage.setItem(LSItemName.SCART_MA_DISPLAY_CART_STUDENTS, JSON.stringify([]));
    }
  }

  @Action(UpdateUserCouponCode)
  updateUserCouponCode(ctx: StateContext<CartState>, action: UpdateUserCouponCode) {
    ctx.patchState({ userCouponCode: action.couponCode, couponCode: action.couponCode || '' });
    localStorage.setItem(LSItemName.SCART_USER_COUPON_CODE, action.couponCode || '');
  }

  @Action(UpdateRegistration)
  updateRegistration(ctx: StateContext<CartState>, action: UpdateRegistration) {
    const state = ctx.getState();
    ctx.patchState({
      registration: {
        ...state.registration,
        regType: action.regType,
        authorizedStudentId: action.authorizedStudentId,
        authorizedContactId: action.authorizedContactId,
      },
    });
  }

  @Action(UpdateCurrentUserType)
  updateCurrentUserType(ctx: StateContext<CartState>, action: UpdateCurrentUserType) {
    const state = ctx.getState();
    ctx.patchState({ registration: { ...state.registration, currentUserType: action.currentUserType } });
    localStorage.setItem(LSItemName.SCART_CURRENT_USER_TYPE, JSON.stringify(action.currentUserType));
  }

  @Action(UpdateStudentRegistration)
  updateStudentRegistration(ctx: StateContext<CartState>, action: UpdateStudentRegistration) {
    const state = ctx.getState();
    ctx.patchState({
      registration: {
        ...state.registration,
        regType: action.regType,
        authorizedStudentId: action.authorizedStudentId,
      },
    });
    this.updateLStorageRegistration({ regType: action.regType, id: action.authorizedStudentId });
  }

  @Action(UpdateContactRegistration)
  updateContactRegistration(ctx: StateContext<CartState>, action: UpdateContactRegistration) {
    const state = ctx.getState();
    ctx.patchState({ registration: { ...state.registration, regType: action.regType, authorizedStudentId: 0 } });
    this.updateLStorageRegistration({ regType: action.regType, id: 0 });
  }

  @Action(UpdateGroupStudentFields)
  updateGroupStudentFields(ctx: StateContext<CartState>, action: UpdateGroupStudentFields) {
    const state = ctx.getState();
    ctx.patchState({ registration: { ...state.registration, groupStudentFields: action.fields } });
    if (action.updateLS) {
      localStorage.setItem(LSItemName.SCART_GROUP_REG_STD_FIELDS, JSON.stringify(action.fields));
    }
  }

  @Action(UpdateClassIdAndPaymentPlanMapFromLStorage)
  updateClassIdAndPaymentPlanMapFromLStorage(
    ctx: StateContext<CartState>,
    action: UpdateClassIdAndPaymentPlanMapFromLStorage
  ) {
    ctx.patchState({ classIdPaymentPlanIdMap: action.paymentPlanMap });
  }

  @Action(UpdateClassIdAndPaymentPlanMap)
  updateClassIdAndPaymentPlanMap(ctx: StateContext<CartState>, action: UpdateClassIdAndPaymentPlanMap) {
    const classIdPaymentPlanIdMap = ctx.getState().classIdPaymentPlanIdMap;
    const classId = action.paymentPlanMap.classId;
    const studentId = action.paymentPlanMap.studentId;
    const isExist =
      classIdPaymentPlanIdMap.filter((item) => item.classId === classId && item.studentId === studentId).length > 0;
    if (isExist) {
      ctx.setState(
        patch({
          classIdPaymentPlanIdMap: updateItem<CartPaymentPlanMap>(
            (item) => item !== undefined && item.classId === classId && item.studentId === studentId,
            action.paymentPlanMap
          ),
        })
      );
    } else {
      ctx.setState(patch({ classIdPaymentPlanIdMap: append([action.paymentPlanMap]) }));
    }
    const map = ctx.getState().classIdPaymentPlanIdMap;
    this.updateLStorageClassIdAndPaymentPlanMap(map);
  }

  @Action(UpdateThankYouPageResponse)
  updateThankYouPageResponse(ctx: StateContext<CartState>, action: UpdateThankYouPageResponse) {
    ctx.patchState({ thankyouPageResponseInfo: action.thankyouPageResponseInfo });
  }

  @Action(UpdateMADisplayCartStudents)
  updateMADisplayCartStudents(ctx: StateContext<CartState>, action: UpdateMADisplayCartStudents) {
    const maDisplayCartStudents: MADisplayCartStudentInfo[] = [];
    if (!action.removeExisting) {
      ctx.getState().maDisplayCartStudents.map((student) => {
        maDisplayCartStudents[student.index] = student;
      });
    }

    let lastIndex = maDisplayCartStudents.length;
    action.maDisplayCartStudentInfo.map((student) => {
      if (student.index === undefined || student.index === null || action.removeExisting) {
        student.index = lastIndex++;
      }
      maDisplayCartStudents[student.index] = student;
    });
    ctx.patchState({ maDisplayCartStudents: maDisplayCartStudents });
    localStorage.setItem(LSItemName.SCART_MA_DISPLAY_CART_STUDENTS, JSON.stringify(maDisplayCartStudents));
  }

  private updateLStorageClassIdAndPaymentPlanMap(map: CartPaymentPlanMap[]) {
    localStorage.setItem('SCART_CLASSID_PAYPLANID_MAP', JSON.stringify(map));
  }
  private updateLStorageSelectedClassIds(classIds: number[]) {
    localStorage.setItem('SCART_SELECTED_CLASS_IDS', JSON.stringify(classIds));
  }
  private updateLStorageRegistration(registration: { regType: 0 | 1 | 2; id: number }) {
    localStorage.setItem('SCART_REGISTRATION', JSON.stringify(registration));
  }
}
