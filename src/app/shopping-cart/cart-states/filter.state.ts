import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SortedFieldInfo } from 'src/app/models';
import { LSItemName } from '../util/constant';

export interface CartFilterStateModel {
  campus: SortedFieldInfo<number, number>;
  department: SortedFieldInfo<number, number>;
  category: SortedFieldInfo<number, number>;
  program: SortedFieldInfo<number, number>;
  programLevel: SortedFieldInfo<number, number>;
  semester: SortedFieldInfo<number, number>;
  location: SortedFieldInfo<string, number>;
  selectedCampus: number | null;
  selectedDepartment: number | null;
  selectedCategory: number | null;
  selectedProgram: number | null;
  selectedProgramLevel: number | null;
  selectedLocation: string | null;
  selectedSemester: number | null;
  selectedStartDate: string | null;
  selectedEndDate: string | null;
  userSelectedCampus: number | null;
  userSelectedDepartment: number | null;
  userSelectedCategory: number | null;
  userSelectedProgram: number | null;
  userSelectedProgramLevel: number | null;
  userSelectedLocation: string | null;
  userSelectedSemester: number | null;
}

export class UpdateCampusField {
  static readonly type = '[ShoppingCart] UpdateCampusField';
  constructor(public field: SortedFieldInfo<number, number>) {}
}

export class UpdateSelectedCampus {
  static readonly type = '[ShoppingCart] UpdateSelectedCampus';
  constructor(public campus: number | null, public isUserSelected: boolean = false) {}
}

export class UpdateDepartmentField {
  static readonly type = '[ShoppingCart] UpdateDepartmentField';
  constructor(public field: SortedFieldInfo<number, number>) {}
}

export class UpdateSelectedDepartment {
  static readonly type = '[ShoppingCart] UpdateSelectedDepartment';
  constructor(public department: number | null, public isUserSelected: boolean = false) {}
}

export class UpdateCategoryField {
  static readonly type = '[ShoppingCart] UpdateCategoryField';
  constructor(public field: SortedFieldInfo<number, number>) {}
}

export class UpdateSelectedCategory {
  static readonly type = '[ShoppingCart] UpdateSelectedCategory';
  constructor(public category: number | null, public isUserSelected: boolean = false) {}
}

export class UpdateProgramField {
  static readonly type = '[ShoppingCart] UpdateProgramField';
  constructor(public field: SortedFieldInfo<number, number>) {}
}

export class UpdateSelectedProgram {
  static readonly type = '[ShoppingCart] UpdateSelectedProgram';
  constructor(public program: number | null, public isUserSelected: boolean = false) {}
}

export class UpdateProgramLevelField {
  static readonly type = '[ShoppingCart] UpdateProgramLevelField';
  constructor(public field: SortedFieldInfo<number, number>) {}
}

export class UpdateSelectedProgramLevel {
  static readonly type = '[ShoppingCart] UpdateSelectedProgramLevel';
  constructor(public programLevel: number | null, public isUserSelected: boolean = false) {}
}

export class UpdateSemesterField {
  static readonly type = '[ShoppingCart] UpdateSemesterField';
  constructor(public field: SortedFieldInfo<number, number>) {}
}

export class UpdateSelectedSemester {
  static readonly type = '[ShoppingCart] UpdateSelectedSemester';
  constructor(public semester: number | null, public isUserSelected: boolean = false) {}
}

export class UpdateLocationField {
  static readonly type = '[ShoppingCart] UpdateLocationField';
  constructor(public field: SortedFieldInfo<string, number>) {}
}

export class UpdateSelectedLocation {
  static readonly type = '[ShoppingCart] UpdateSelectedLocation';
  constructor(public location: string | null, public isUserSelected: boolean = false) {}
}

export class UpdateSelectedStartDate {
  static readonly type = '[ShoppingCart] UpdateSelectedStartDate';
  constructor(public startDate: string) {}
}

export class UpdateSelectedEndDate {
  static readonly type = '[ShoppingCart] UpdateSelectedEndDate';
  constructor(public endDate: string) {}
}

@State<CartFilterStateModel>({
  name: 'shoppingcartfilter',
  defaults: {
    campus: {} as SortedFieldInfo<number, number>,
    department: {} as SortedFieldInfo<number, number>,
    category: {} as SortedFieldInfo<number, number>,
    program: {} as SortedFieldInfo<number, number>,
    programLevel: {} as SortedFieldInfo<number, number>,
    semester: {} as SortedFieldInfo<number, number>,
    location: {} as SortedFieldInfo<string, number>,
    selectedCampus: -1,
    selectedDepartment: -1,
    selectedCategory: -1,
    selectedProgram: -1,
    selectedProgramLevel: -1,
    selectedLocation: '',
    selectedSemester: -1,
    selectedStartDate: null,
    selectedEndDate: null,
    userSelectedCampus: null,
    userSelectedDepartment: null,
    userSelectedCategory: null,
    userSelectedProgram: null,
    userSelectedProgramLevel: null,
    userSelectedLocation: null,
    userSelectedSemester: null,
  },
})
@Injectable()
export class CartFilterState {
  @Selector()
  static campusField(cartState: CartFilterStateModel) {
    return cartState.campus;
  }
  @Selector()
  static selectedCampus(cartState: CartFilterStateModel) {
    return cartState.selectedCampus;
  }
  @Selector()
  static userSelectedCampus(cartState: CartFilterStateModel) {
    return cartState.userSelectedCampus;
  }

  @Selector()
  static departmentField(cartState: CartFilterStateModel) {
    return cartState.department;
  }
  @Selector()
  static selectedDepartment(cartState: CartFilterStateModel) {
    return cartState.selectedDepartment;
  }
  @Selector()
  static userSelectedDepartment(cartState: CartFilterStateModel) {
    return cartState.userSelectedDepartment;
  }

  @Selector()
  static categoryField(cartState: CartFilterStateModel) {
    return cartState.category;
  }
  @Selector()
  static selectedCategory(cartState: CartFilterStateModel) {
    return cartState.selectedCategory;
  }
  @Selector()
  static userSelectedCategory(cartState: CartFilterStateModel) {
    return cartState.userSelectedCategory;
  }

  @Selector()
  static programField(cartState: CartFilterStateModel) {
    return cartState.program;
  }
  @Selector()
  static selectedProgram(cartState: CartFilterStateModel) {
    return cartState.selectedProgram;
  }
  @Selector()
  static userSelectedProgram(cartState: CartFilterStateModel) {
    return cartState.userSelectedProgram;
  }

  @Selector()
  static programLevelField(cartState: CartFilterStateModel) {
    return cartState.programLevel;
  }
  @Selector()
  static selectedProgramLevel(cartState: CartFilterStateModel) {
    return cartState.selectedProgramLevel;
  }
  @Selector()
  static userSelectedProgramLevel(cartState: CartFilterStateModel) {
    return cartState.userSelectedProgramLevel;
  }

  @Selector()
  static semesterField(cartState: CartFilterStateModel) {
    return cartState.semester;
  }
  @Selector()
  static selectedSemester(cartState: CartFilterStateModel) {
    return cartState.selectedSemester;
  }
  @Selector()
  static userSelectedSemester(cartState: CartFilterStateModel) {
    return cartState.userSelectedSemester;
  }

  @Selector()
  static locationField(cartState: CartFilterStateModel) {
    return cartState.location;
  }
  @Selector()
  static selectedLocation(cartState: CartFilterStateModel) {
    return cartState.selectedLocation;
  }
  @Selector()
  static userSelectedLocation(cartState: CartFilterStateModel) {
    return cartState.userSelectedLocation;
  }
  @Selector()
  static userSelectedFilter(cartState: CartFilterStateModel) {
    const filterSet: Set<string> = new Set<string>();
    if (cartState.userSelectedCampus) {
      filterSet.add('campus');
    }
    if (cartState.userSelectedDepartment) {
      filterSet.add('dept');
    }
    if (cartState.userSelectedProgram) {
      filterSet.add('program');
    }
    if (cartState.userSelectedProgramLevel) {
      filterSet.add('programLevel');
    }
    if (cartState.userSelectedCategory) {
      filterSet.add('category');
    }
    if (cartState.userSelectedSemester) {
      filterSet.add('semester');
    }
    if (cartState.userSelectedLocation) {
      filterSet.add('location');
    }
    if (cartState.selectedStartDate) {
      filterSet.add('startdate');
    }
    if (cartState.selectedEndDate) {
      filterSet.add('enddate');
    }
    return filterSet;
  }

  @Selector()
  static allSelectedFilter(state: CartFilterStateModel) {
    const filters: any = {};
    filters.selectedCampus = state.selectedCampus;
    filters.selectedDepartment = state.selectedDepartment;
    filters.selectedCategory = state.selectedCategory;
    filters.selectedProgram = state.selectedProgram;
    filters.selectedProgramLevel = state.selectedProgramLevel;
    filters.selectedSemester = state.selectedSemester;
    filters.selectedLocation = state.selectedLocation;
    filters.selectedStartDate = state.selectedStartDate;
    filters.selectedEndDate = state.selectedEndDate;
    return filters;
  }

  @Selector()
  static selectedStartDate(cartState: CartFilterStateModel) {
    return cartState.selectedStartDate;
  }
  @Selector()
  static selectedEndDate(cartState: CartFilterStateModel) {
    return cartState.selectedEndDate;
  }

  @Action(UpdateCampusField)
  updateCampusField(ctx: StateContext<CartFilterStateModel>, action: UpdateCampusField) {
    ctx.patchState({ campus: action.field });
  }

  @Action(UpdateSelectedCampus)
  updateSelectedCampus(ctx: StateContext<CartFilterStateModel>, action: UpdateSelectedCampus) {
    if (action.isUserSelected) {
      ctx.patchState({ userSelectedCampus: action.campus });
      localStorage.setItem(LSItemName.SELECTED_CAMPUS, action.campus + '');
    }
    ctx.patchState({ selectedCampus: action.campus });
  }

  @Action(UpdateDepartmentField)
  updateDepartmentField(ctx: StateContext<CartFilterStateModel>, action: UpdateDepartmentField) {
    ctx.patchState({ department: action.field });
  }
  @Action(UpdateSelectedDepartment)
  updateSelectedDepartment(ctx: StateContext<CartFilterStateModel>, action: UpdateSelectedDepartment) {
    if (action.isUserSelected) {
      ctx.patchState({ userSelectedDepartment: action.department });
      localStorage.setItem(LSItemName.SELECTED_DEPARTMENT, action.department + '');
    }
    ctx.patchState({ selectedDepartment: action.department });
  }

  @Action(UpdateCategoryField)
  updateCategoryField(ctx: StateContext<CartFilterStateModel>, action: UpdateCategoryField) {
    ctx.patchState({ category: action.field });
  }

  @Action(UpdateSelectedCategory)
  updateSelectedCategory(ctx: StateContext<CartFilterStateModel>, action: UpdateSelectedCategory) {
    if (action.isUserSelected) {
      ctx.patchState({ userSelectedCategory: action.category });
      localStorage.setItem(LSItemName.SELECTED_CATEGORY, action.category + '');
    }
    ctx.patchState({ selectedCategory: action.category });
  }

  @Action(UpdateProgramField)
  updateProgramField(ctx: StateContext<CartFilterStateModel>, action: UpdateProgramField) {
    ctx.patchState({ program: action.field });
  }

  @Action(UpdateSelectedProgram)
  updateSelectedProgram(ctx: StateContext<CartFilterStateModel>, action: UpdateSelectedProgram) {
    if (action.isUserSelected) {
      ctx.patchState({ userSelectedProgram: action.program });
      localStorage.setItem(LSItemName.SELECTED_PROGRAM, action.program + '');
    }
    ctx.patchState({ selectedProgram: action.program });
  }

  @Action(UpdateProgramLevelField)
  updateProgramLevelField(ctx: StateContext<CartFilterStateModel>, action: UpdateProgramLevelField) {
    ctx.patchState({ programLevel: action.field });
  }

  @Action(UpdateSelectedProgramLevel)
  updateSelectedProgramLevel(ctx: StateContext<CartFilterStateModel>, action: UpdateSelectedProgramLevel) {
    if (action.isUserSelected) {
      ctx.patchState({ userSelectedProgramLevel: action.programLevel });
      localStorage.setItem(LSItemName.SELECTED_PROGRAM_LEVEL, action.programLevel + '');
    }
    ctx.patchState({ selectedProgramLevel: action.programLevel });
  }

  @Action(UpdateSemesterField)
  updateSemesterField(ctx: StateContext<CartFilterStateModel>, action: UpdateSemesterField) {
    ctx.patchState({ semester: action.field });
  }

  @Action(UpdateSelectedSemester)
  updateSelectedSemester(ctx: StateContext<CartFilterStateModel>, action: UpdateSelectedSemester) {
    if (action.isUserSelected) {
      ctx.patchState({ userSelectedSemester: action.semester });
      localStorage.setItem(LSItemName.SELECTED_SEMESTER, action.semester + '');
    }
    ctx.patchState({ selectedSemester: action.semester });
  }

  @Action(UpdateLocationField)
  updateLocationField(ctx: StateContext<CartFilterStateModel>, action: UpdateLocationField) {
    ctx.patchState({ location: action.field });
  }

  @Action(UpdateSelectedLocation)
  updateSelectedLocation(ctx: StateContext<CartFilterStateModel>, action: UpdateSelectedLocation) {
    if (action.isUserSelected) {
      ctx.patchState({ userSelectedLocation: action.location });
      localStorage.setItem(LSItemName.SELECTED_LOCATION, action.location ? action.location : '');
    }
    ctx.patchState({ selectedLocation: action.location });
  }

  @Action(UpdateSelectedStartDate)
  updateSelectedStartDate(ctx: StateContext<CartFilterStateModel>, action: UpdateSelectedStartDate) {
    ctx.patchState({ selectedStartDate: action.startDate });
    localStorage.setItem(LSItemName.SELECTED_START_DATE, action.startDate);
  }

  @Action(UpdateSelectedEndDate)
  updateSelectedEndDate(ctx: StateContext<CartFilterStateModel>, action: UpdateSelectedEndDate) {
    ctx.patchState({ selectedEndDate: action.endDate });
    localStorage.setItem(LSItemName.SELECTED_END_DATE, action.endDate);
  }
}
