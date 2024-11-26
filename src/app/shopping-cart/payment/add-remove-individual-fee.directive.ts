import { Directive, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TextBookOrOtherChargeInfo } from '../models';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { ShoppingCartState } from '../cart-states';

@Directive({
  selector: '[addRemoveIndividualFee]',
})
export class AddRemoveIndividualFeeDirective implements OnInit, OnDestroy {
  private dead$ = new Subject<void>();

  @Input()
  addRemoveIndividualFee!: TextBookOrOtherChargeInfo;

  @Select(ShoppingCartState.studentIds)
  studentIds$!: Observable<number[]>;
  studentIds: number[] = [];
  constructor(private cartService: ShoppingCartService) {}
  ngOnDestroy(): void {
    this.dead$.next();
    this.dead$.complete();
  }
  ngOnInit(): void {
    this.studentIds$.pipe(takeUntil(this.dead$)).subscribe((studentIds) => (this.studentIds = studentIds));
  }
  @HostListener('change', ['$event']) onClick(event: MatCheckboxChange) {
    console.log('check individual fee ', event.checked);
    const isDelete = event.checked ? 0 : 1;
    console.log(this.addRemoveIndividualFee);
    const payLoad = {
      classId: this.addRemoveIndividualFee.classId,
      feeId: this.addRemoveIndividualFee.id,
      feeType: this.addRemoveIndividualFee.type,
      isDelete: isDelete,
      studentIds: this.studentIds,
      campus: -1,
    };

    this.cartService.addRemoveIndividualFee(payLoad).subscribe();
  }
}
