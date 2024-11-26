import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CartPaymentPlanMap, FieldSectionInfo, MADisplayCartStudentInfo } from '../models';
import {
  UpdateSelectedCampus,
  UpdateSelectedCategory,
  UpdateSelectedDepartment,
  UpdateSelectedEndDate,
  UpdateSelectedLocation,
  UpdateSelectedProgram,
  UpdateSelectedProgramLevel,
  UpdateSelectedSemester,
  UpdateSelectedStartDate,
  AddToCart,
  UpdateAllPassedCodes,
  UpdateClassIdAndPaymentPlanMapFromLStorage,
  UpdateCurrentUserType,
  UpdateGroupStudentFields,
  UpdateMADisplayCartStudents,
  UpdateRegistration,
  UpdateUserCouponCode,
} from '../cart-states';
import { LSItemName } from '../util/constant';
@Injectable({
  providedIn: 'root',
})
export class LocalStorageResolver implements Resolve<boolean> {
  isLocalStorageData: boolean = false;
  constructor(private store: Store) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.initLocalStorageData(route.data['multiple']);
  }

  private initLocalStorageData(multiple: boolean | undefined | null): Observable<any> {
    const selectedClassIds = this.getSelectedClassIds();
    const registrationInfo = this.getRegistrationInfo();
    const regType = registrationInfo.regType;
    const authorizedStudentId = regType == 1 ? registrationInfo.id : 0;
    const authorizedContactId = regType == 2 ? registrationInfo.id : 0;
    const classIdPayPlanMap = this.getClassIdAndPayPlanMap();
    const startDate = this.getLSStringValue(LSItemName.SELECTED_START_DATE, '');
    const endDate = this.getLSStringValue(LSItemName.SELECTED_END_DATE, '');

    let localStorageActions: any = [
      new UpdateSelectedCampus(this.getLSNumberValue(LSItemName.SELECTED_CAMPUS, -1), this.isLocalStorageData),
      new UpdateSelectedDepartment(this.getLSNumberValue(LSItemName.SELECTED_DEPARTMENT, -1), this.isLocalStorageData),
      new UpdateSelectedCategory(this.getLSNumberValue(LSItemName.SELECTED_CATEGORY, -1), this.isLocalStorageData),
      new UpdateSelectedProgram(this.getLSNumberValue(LSItemName.SELECTED_PROGRAM, -1), this.isLocalStorageData),
      new UpdateSelectedProgramLevel(
        this.getLSNumberValue(LSItemName.SELECTED_PROGRAM_LEVEL, -1),
        this.isLocalStorageData
      ),
      new UpdateSelectedSemester(this.getLSNumberValue(LSItemName.SELECTED_SEMESTER, -1), this.isLocalStorageData),
      new UpdateSelectedLocation(this.getLSStringValue(LSItemName.SELECTED_LOCATION, ''), this.isLocalStorageData),

      new UpdateAllPassedCodes(this.getPassedCodes()),
      new UpdateUserCouponCode(this.getUserCouponCode()),

      new UpdateRegistration(regType, authorizedStudentId, authorizedContactId),
      new UpdateGroupStudentFields(this.getGroupRegStdFields(), false),
      new UpdateCurrentUserType(this.getCurrentUserType()),
      new UpdateClassIdAndPaymentPlanMapFromLStorage(classIdPayPlanMap),
    ];
    if (startDate) {
      localStorageActions.push(new UpdateSelectedStartDate(startDate));
    }
    if (endDate) {
      localStorageActions.push(new UpdateSelectedEndDate(endDate));
    }
    if (selectedClassIds.length) {
      localStorageActions.push(new AddToCart(selectedClassIds, false));
    }
    if (multiple) {
      localStorageActions.push(new UpdateMADisplayCartStudents(this.getMADisplayCartStudents()));
    }
    return this.store.dispatch(localStorageActions);
  }

  private getSelectedClassIds() {
    const ids = localStorage.getItem(LSItemName.SCART_SELECTED_CLASS_IDS);
    let classIds: number[] = [];
    if (ids !== undefined && ids !== null) {
      try {
        classIds = JSON.parse(ids);
      } catch (eerr) {
        //Just skip if fail to parse
      }
    }
    return classIds;
  }
  private getRegistrationInfo() {
    const localReg = localStorage.getItem(LSItemName.SCART_REGISTRATION);
    let reg: { regType: 0 | 1 | 2; id: number } = { regType: 0, id: 0 };
    if (localReg !== undefined && localReg !== null) {
      try {
        reg = JSON.parse(localReg);
      } catch (eerr) {
        //Just skip if fail to parse
      }
    }
    return reg;
  }
  private getClassIdAndPayPlanMap() {
    const idsMap = localStorage.getItem(LSItemName.SCART_CLASSID_PAYPLANID_MAP);
    let newMap: CartPaymentPlanMap[] = [];
    if (idsMap !== undefined && idsMap !== null) {
      try {
        newMap = JSON.parse(idsMap);
      } catch (eerr) {
        //Just skip if fail to parse
      }
    }
    return newMap;
  }
  private getLSNumberValue(itemName: string, defaultValue: number) {
    this.isLocalStorageData = false;
    const value = localStorage.getItem(itemName);
    let nValue = defaultValue;
    if (value !== undefined && value !== null) {
      try {
        nValue = parseInt(value);
        this.isLocalStorageData = true;
      } catch (error) {
        //Just skip if fail to parse
      }
    }
    return nValue;
  }
  private getLSStringValue(itemName: string, defaultValue: string) {
    this.isLocalStorageData = false;
    const value = localStorage.getItem(itemName);
    let sValue = defaultValue;
    if (value !== undefined && value !== null) {
      try {
        sValue = value;
        this.isLocalStorageData = true;
      } catch (error) {
        //Just skip if fail to parse
      }
    }
    return sValue;
  }
  private getGroupRegStdFields() {
    const lsItem = localStorage.getItem(LSItemName.SCART_GROUP_REG_STD_FIELDS);
    let fields: FieldSectionInfo[] = [];
    if (lsItem !== undefined && lsItem !== null) {
      try {
        fields = JSON.parse(lsItem);
      } catch (err) {
        console.log(err);

        //Just skip if fail to parse
      }
    }

    return fields;
  }
  private getCurrentUserType() {
    const lsItem = localStorage.getItem(LSItemName.SCART_CURRENT_USER_TYPE);
    let userType: 0 | 1 | 99 = 0;
    if (lsItem !== undefined && lsItem !== null) {
      try {
        userType = JSON.parse(lsItem);
      } catch (err) {
        console.log(err);
        //Just skip if fail to parse
      }
    }

    return userType;
  }
  private getPassedCodes() {
    const lsItem = localStorage.getItem(LSItemName.SCART_PASSED_CODES);
    let passedCodes: { [key: string]: boolean } = {};
    if (lsItem !== undefined && lsItem !== null) {
      try {
        passedCodes = JSON.parse(lsItem);
      } catch (err) {
        console.log(err);
        //Just skip if fail to parse
      }
    }

    return passedCodes;
  }
  private getMADisplayCartStudents() {
    const lsItem = localStorage.getItem(LSItemName.SCART_MA_DISPLAY_CART_STUDENTS);
    let students: MADisplayCartStudentInfo[] = [];
    if (lsItem !== undefined && lsItem !== null) {
      try {
        students = JSON.parse(lsItem);
      } catch (err) {
        console.log(err);
        //Just skip if fail to parse
      }
    }

    return students;
  }

  private getUserCouponCode() {
    return localStorage.getItem(LSItemName.SCART_USER_COUPON_CODE);
  }
}
