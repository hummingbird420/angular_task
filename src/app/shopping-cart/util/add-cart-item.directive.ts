import { Directive, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { AddStudentMultiplePage } from '../display-cart/add-student-multiple.page';
import { CartOptions } from '../models';
import { PassCodeDialog } from '../pass-code/pass-code.dialog';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { AddToCart, ShoppingCartState, UpdatePassedCodes } from '../cart-states';
import { ConfirmDialog } from './confirm/confirm.dialog';

@Directive({
  selector: '[addCartItem]',
})
export class AddCartItemDirective implements OnInit, OnDestroy {
  private dead$ = new Subject<void>();
  @Input() addCartItem: number = 0;
  @Input() hasPassCode: boolean = false;
  @Input() minimumAge: number = 0;
  @Input() enrollAsWaiting: boolean = false;

  @Select(ShoppingCartState.cartOptions)
  cartOptions$!: Observable<CartOptions>;

  @Select(ShoppingCartState.selectedClassIds)
  selectedClassIds$!: Observable<(multiple: boolean) => number[]>;
  selectedClassIdset: number[] = [];

  @Select(ShoppingCartState.passedCodes)
  passedCodes$!: Observable<{ [key: string]: boolean }>;
  passedCodes: { [key: string]: boolean } = {};
  showWaitingConfirmMessage: boolean = true;
  enrollAllStudentAsWaiting: boolean = false;

  soldOutClassWaitingMessage: string;
  normalClassWaitingMessage: string;
  multiple: boolean;

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
  }

  @HostListener('click') onClick() {
    if (this.enrollAsWaiting && this.showWaitingConfirmMessage) {
      const dialogRef = this.openWaitingConfirmDialog();
      dialogRef
        .beforeClosed()
        .pipe(take(1))
        .subscribe((confirm) => {
          if (confirm) {
            if (this.shoppingCartService.multiple) {
              this.addToCartMultipleAttendee();
            } else {
              this.addToCartSingleAttendee();
            }
          }
        });
    } else {
      if (this.shoppingCartService.multiple) {
        this.addToCartMultipleAttendee();
      } else {
        this.addToCartSingleAttendee();
      }
    }
  }

  private isPassedCode() {
    const key = 'classId' + this.addCartItem;
    return this.passedCodes.hasOwnProperty(key) && this.passedCodes[key];
  }

  private addToCartSingleAttendee() {
    if (this.selectedClassIdset.includes(this.addCartItem)) {
      return;
    }
    if (this.hasPassCode && this.isPassedCode() === false) {
      this.openPassCodeDialog(false);
    } else {
      this.store.dispatch(new AddToCart([this.addCartItem], true));
    }
  }

  private addToCartMultipleAttendee() {
    if (this.hasPassCode && this.isPassedCode() === false) {
      this.openPassCodeDialog(true);
    } else {
      this.openAddStudentMultipleDialog();
    }
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

  private openPassCodeDialog(multiple: boolean) {
    const dialogRef = this.dialog.open(PassCodeDialog, {
      maxWidth: 'calc(100vw - 8px)',
      disableClose: true,
      closeOnNavigation: true,
      autoFocus: false,
      data: {},
    });
    dialogRef.componentInstance.onSubmit().subscribe((passCode) => {
      this.shoppingCartService.checkClassPassCode(this.addCartItem, passCode).subscribe((response) => {
        if (response.isPassCodeSuccess) {
          dialogRef.close();
          this.store.dispatch(new UpdatePassedCodes(this.addCartItem, true));
          if (multiple) this.openAddStudentMultipleDialog();
          else this.store.dispatch(new AddToCart([this.addCartItem]));
        } else {
          dialogRef.componentInstance.invalidate();
        }
      });
    });
  }

  private openAddStudentMultipleDialog() {
    const dialogRef = this.dialog.open(AddStudentMultiplePage, {
      maxWidth: 'calc(100vw - 8px)',
      maxHeight: 'calc(100vh - 64px)',
      disableClose: true,
      closeOnNavigation: true,
      autoFocus: false,
      data: {
        classId: this.addCartItem,
        minimumAge: this.minimumAge,
      },
    });
    dialogRef
      .beforeClosed()
      .pipe(take(1))
      .subscribe((data) => {
        if (data) {
          //TODO listen to the close.
        }
      });
  }
}
