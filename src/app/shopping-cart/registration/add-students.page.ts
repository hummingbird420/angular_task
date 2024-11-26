import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { CartBasePage } from '../cart-base.page';
import { ContactStudentResponse } from '../models';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { ShoppingCartState, UpdateGroupStudents, CartFilterState } from '../cart-states';
import { AddStudentsDialog } from './add-students.dialog';

@Component({
  templateUrl: './add-students.page.html',
  styleUrls: ['./add-students.page.scss'],
})
export class AddStudentsPage extends CartBasePage implements OnInit, OnDestroy {
  private dead$ = new Subject<void>();
  @Select(ShoppingCartState.groupStudents)
  groupStudents$!: Observable<ContactStudentResponse[]>;
  students: ContactStudentResponse[] = [];
  deletedIds: number[] = [];

  @Select(CartFilterState.selectedDepartment)
  selectedDepartment$!: Observable<number>;
  levelId: number = -1;

  @Select(CartFilterState.selectedProgram)
  selectedProgram$!: Observable<number>;
  programId: number = -1;

  @Select(CartFilterState.selectedProgramLevel)
  selectedProgramLevel$!: Observable<number>;
  programLevelId: number = -1;

  @Select(ShoppingCartState.selectedClassIds)
  selectedClassIds$!: Observable<(multiple: boolean) => number[]>;
  selectedClassIds: number[] = [];
  errorMessage: string = '';
  showBackToClassButton: boolean = false;

  constructor(
    private router: Router,
    route: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
    private formBuilder: FormBuilder,
    private store: Store,
    public dialog: MatDialog
  ) {
    super(route, shoppingCartService);
    this.init();
  }
  ngOnDestroy(): void {
    this.dead$.next();
    this.dead$.complete();
  }

  ngOnInit(): void {
    this.selectedProgram$.pipe(takeUntil(this.dead$)).subscribe((id) => {
      this.programId = id;
    });
    this.selectedDepartment$.pipe(takeUntil(this.dead$)).subscribe((id) => {
      this.levelId = id;
    });
    this.selectedProgramLevel$.pipe(takeUntil(this.dead$)).subscribe((id) => {
      this.programLevelId = id;
    });
    this.selectedClassIds$
      .pipe(takeUntil(this.dead$))
      .pipe(map((fn) => fn(this.multiple)))
      .subscribe((ids) => {
        this.selectedClassIds = ids;
      });
    this.groupStudents$.pipe(take(1)).subscribe((groupStudents) => {
      for (let index = 0; index < groupStudents.length; index++) {
        this.students[index] = groupStudents[index];
      }
    });
  }

  showAddStudentDialog() {
    const options = {
      width: '400px',
      disableClose: true,
      closeOnNavigation: true,
      autoFocus: false,
      data: {},
    };
    const dialogRef = this.dialog.open(AddStudentsDialog, options);
    dialogRef
      .beforeClosed()
      .pipe(take(1))
      .subscribe((data) => {
        if (data && data.studentId) this.students.push(data);
      });
  }

  deleteStudent(deletedId: number) {
    this.students = this.students.filter((student) => student.studentId !== deletedId);
    if (!this.deletedIds.includes(deletedId)) {
      this.deletedIds.push(deletedId);
    }
  }

  enrollStudents() {
    if (this.students.length === 0) {
      this.errorMessage = this.shoppingCartService.translate('Please add at least one student.');
      return;
    } else {
      this.errorMessage = '';
    }

    const studentIds: number[] = this.students.map((student) => student.studentId);

    const payload: any = {};
    payload.levelId = this.levelId;
    payload.programId = this.programId;
    payload.programLevelId = this.programLevelId;
    payload.classIds = this.selectedClassIds;
    payload.studentIds = studentIds;
    payload.removeStudentIds = this.deletedIds;

    this.shoppingCartService.saveGroupEnrollment(payload).subscribe(
      (response) => {
        if (response.alreadyEnrolled) {
          this.errorMessage = response.message;
          this.showBackToClassButton = true;
        } else {
          this.store.dispatch(new UpdateGroupStudents(this.students));
          this.shoppingCartService.goToCheckoutPage(this.router);
        }
      },
      (errors) => this.handleError(errors)
    );
  }

  handleError(errors: any) {
    const error = errors.error.error;
    if (error.hasOwnProperty('error')) {
      const errorCode = error.error.code;
      const errorMessage = error.error.message;
      this.errorMessage = errorMessage;
    }
  }
}
