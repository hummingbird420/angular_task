import { Directive, HostListener, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { from, Observable, of, Subject } from 'rxjs';
import { concatMap, map, take, takeUntil, takeWhile } from 'rxjs/operators';
import { AddToCart, ShoppingCartState, UpdateMADisplayCartStudents, UpdatePassedCodes } from '../cart-states';
import { AddStudentMultiplePage } from '../display-cart/add-student-multiple.page';
import { CartOptions, ClassInfo, CourseInfo, MADisplayCartStudentInfo } from '../models';
import { PassCodeDialog } from '../pass-code/pass-code.dialog';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { ConfirmDialog } from './confirm/confirm.dialog';

@Directive({
  selector: '[addAllCartItem]',
})
export class AddAllCartItemDirective {
  private dead$ = new Subject<void>();
  @Input() addAllCartItem: CourseInfo[] = [];
  @Input() hasPassCode: boolean = false;
  @Input() minimumAge: number = 0;
  @Input() enrollAsWaiting: boolean = false;

  @Select(ShoppingCartState.cartOptions)
  cartOptions$!: Observable<CartOptions>;

  @Select(ShoppingCartState.selectedClassIds)
  selectedClassIds$!: Observable<(multiple: boolean) => number[]>;
  selectedClassIdset: number[] = [];

  @Select(ShoppingCartState.maDisplayCartStudents)
  maDisplayCartStudents$!: Observable<MADisplayCartStudentInfo[]>;
  maDisplayCartStudents: MADisplayCartStudentInfo[] = [];

  @Select(ShoppingCartState.passedCodes)
  passedCodes$!: Observable<{ [key: string]: boolean }>;
  passedCodes: { [key: string]: boolean } = {};
  showWaitingConfirmMessage: boolean = true;
  enrollAllStudentAsWaiting: boolean = false;

  soldOutClassWaitingMessage: string;
  normalClassWaitingMessage: string;
  multiple: boolean;

  classListArray: ClassInfo[] = [];
  public addItemArray: number[] = [];

  constructor(
    route: ActivatedRoute,
    public dialog: MatDialog,
    public shoppingCartService: ShoppingCartService,
    private store: Store
  ) {
    this.soldOutClassWaitingMessage = this.shoppingCartService.translate(
      'This class is full. You will be placed in waiting list.'
    );
    this.multiple = route.parent?.snapshot.data['multiple'];

    this.normalClassWaitingMessage = this.shoppingCartService.translate('You will be placed in waiting list.');
  }
  ngOnDestroy(): void {
    this.dead$.next();
    this.dead$.complete();
  }
  ngOnInit(): void {
    this.selectedClassIds$
      .pipe(takeUntil(this.dead$))
      .pipe(map((fn) => fn(this.multiple)))
      .subscribe((classIds) => {
        this.selectedClassIdset = classIds;
      });
    this.passedCodes$.pipe(takeUntil(this.dead$)).subscribe((passedCodes) => {
      this.passedCodes = passedCodes;
    });
    this.cartOptions$.pipe(takeUntil(this.dead$)).subscribe((options) => {
      if (options) {
        this.showWaitingConfirmMessage = !options.dontShowWaitingConfirmation;
        this.enrollAllStudentAsWaiting = options.enrollAllStudentAsWaiting;
      }
    });
    this.maDisplayCartStudents$.pipe(takeUntil(this.dead$)).subscribe((students) => {
      this.maDisplayCartStudents = students;
    });
  }

  @HostListener('click') onClick() {
    this.addAllCartItem.forEach((value) => {
      value.classes.forEach((val) => {
        this.classListArray.push(val);
        this.addItemArray.push(val.classId);
      });
    });
    if (this.enrollAsWaiting && this.showWaitingConfirmMessage) {
      const dialogRef = this.openWaitingConfirmDialog();
      dialogRef
        .beforeClosed()
        .pipe(take(1))
        .subscribe((confirm) => {
          if (confirm) {
            if (this.multiple) {
              this.addToCartMultipleAttendee();
            } else {
              this.addToCartSingleAttendee();
            }
          }
        });
    } else {
      if (this.multiple) {
        this.addToCartMultipleAttendee();
      } else {
        this.addToCartSingleAttendee();
      }
    }
  }

  private isPassedCode(value: number) {
    const key = 'classId' + value;
    return this.passedCodes.hasOwnProperty(key) && this.passedCodes[key];
  }

  private addToCartSingleAttendee() {
    this.classListArray.forEach((value) => {
      if (this.selectedClassIdset.includes(value.classId)) {
      } else if (value.hasPassCode && this.isPassedCode(value.classId) === false) {
        this.openPassCodeDialog(false, value.classId, -1);
      } else {
        this.store.dispatch(new AddToCart([value.classId], true));
      }
    });
  }

  private addToCartMultipleAttendee() {
    from(this.classListArray)
      .pipe(
        concatMap((classInfo, index) => {
          if (classInfo.hasPassCode && this.isPassedCode(classInfo.classId) == false) {
            return this.openPassCodeDialog(true, classInfo.classId, index);
          } else {
            if (index == 0) {
              return this.openAddStudentDialog(classInfo.classId);
            } else {
              return this.addStudentMultiple(classInfo.classId);
            }
          }
        }),
        takeWhile(Boolean)
      )
      .subscribe();
  }
  private openPassCodeDialog(multiple: boolean, classId: number, index: number) {
    const dialogRef = this.dialog.open(PassCodeDialog, {
      maxWidth: 'calc(100vw - 8px)',
      disableClose: true,
      closeOnNavigation: true,
      autoFocus: false,
      data: {},
    });
    dialogRef.componentInstance.onSubmit().subscribe((passCode) => {
      this.shoppingCartService.checkClassPassCode(classId, passCode).subscribe((response) => {
        if (response.isPassCodeSuccess) {
          dialogRef.close();
          this.store.dispatch(new UpdatePassedCodes(classId, true));
          if (multiple) {
            if (index == 0) {
              this.openAddStudentDialog(classId);
            } else {
              this.addStudentMultiple(classId);
            }
          } else this.store.dispatch(new AddToCart([classId]));
        } else {
          dialogRef.componentInstance.invalidate();
        }
      });
    });
    return this.classListArray;
  }
  private openAddStudentDialog(value: number) {
    return this.dialog
      .open(AddStudentMultiplePage, {
        maxWidth: 'calc(100vw - 8px)',
        maxHeight: 'calc(100vh - 64px)',
        disableClose: true,
        closeOnNavigation: true,
        autoFocus: false,
        data: {
          classId: value,
          minimumAge: this.minimumAge,
        },
      })
      .afterClosed()
      .pipe(take(1));
  }
  private addStudentMultiple(value: number) {
    let classId: number[] = [];
    const maStudents: MADisplayCartStudentInfo[] = [];
    for (let i = 0; i < this.maDisplayCartStudents.length; i++) {
      classId = [];
      for (let j = 0; j < this.maDisplayCartStudents[i].classIds.length; j++) {
        classId.push(this.maDisplayCartStudents[i].classIds[j]);
      }
      const newClassIds = classId.filter((classId) => classId == value);
      if (!newClassIds.length) {
        classId.push(value);
      }
      let val: MADisplayCartStudentInfo = {
        index: this.maDisplayCartStudents[i].index,
        firstName: this.maDisplayCartStudents[i].firstName,
        lastName: this.maDisplayCartStudents[i].lastName,
        email: this.maDisplayCartStudents[i].email,
        dateOfBirth: this.maDisplayCartStudents[i].dateOfBirth,
        classIds: classId,
      };
      maStudents.push(val);
    }
    return this.store.dispatch([new UpdateMADisplayCartStudents(maStudents)]);
  }
  private openWaitingConfirmDialog(): MatDialogRef<ConfirmDialog, boolean> {
    let message = this.soldOutClassWaitingMessage;
    if (this.enrollAllStudentAsWaiting) {
      message = this.normalClassWaitingMessage;
    }
    return this.dialog.open(ConfirmDialog, {
      maxWidth: 'calc(100vw - 8px)',
      disableClose: true,
      closeOnNavigation: true,
      autoFocus: false,
      data: {
        message: message,
      },
    });
  }
}
