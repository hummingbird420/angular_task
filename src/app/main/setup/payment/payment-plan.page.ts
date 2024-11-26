import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { PaymentPlanInfo } from 'src/app/models';
import { AlertService, ApiService, DictionaryService } from 'src/app/services';
import { createBreadcrumb, Page } from '../../page';
import { TemplatePortal } from '@angular/cdk/portal';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AddEditDialog } from 'src/app/components/templates/dialogs/add-edit.dialog';
import { map, mergeMap, take, takeUntil } from 'rxjs/operators';
import { DialogService } from 'src/app/services/dialog.service';
import { OrbundValidators } from 'src/app/util';
import { of } from 'rxjs';

@Component({
  templateUrl: './payment-plan.page.html',
  styleUrls: ['./payment-plan.page.scss'],
})
export class PaymentPlanPage
  extends Page
  implements OnInit, OnDestroy, AfterViewInit
{
  paymentPlans: PaymentPlanInfo[] = [];
  deletedPlanIds: number[] = [];
  selectedIndex: number = -1;
  maxValue = 999;
  //Dialog
  @ViewChild('addEditTemplate') addEditTemplate!: TemplateRef<unknown>;
  addEditTemplatePortal!: TemplatePortal<any>;
  addEditFormGroup: FormGroup;

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private alertService: AlertService,
    private dictionaryService: DictionaryService,
    private formBuilder: FormBuilder,
    private viewContainerRef: ViewContainerRef,
    private dialogService: DialogService,
    private apiService: ApiService
  ) {
    super();
    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Payment Plans', undefined, true),
    ];
    this.addEditFormGroup = this.formBuilder.group({
      paymentPlanId: new FormControl(0),
      planName: new FormControl('', [
        OrbundValidators.required('Plan Name', this.dictionaryService),
        OrbundValidators.maxLength(250, this.dictionaryService),
      ]),
      payments: new FormControl('', [
        OrbundValidators.required('Number of Payments', this.dictionaryService),
        OrbundValidators.positiveNumeric(
          'Number of Payments',
          this.dictionaryService
        ),
        OrbundValidators.maxValue(127, this.dictionaryService),
      ]),
    });
  }
  ngAfterViewInit(): void {
    this.addEditTemplatePortal = new TemplatePortal(
      this.addEditTemplate,
      this.viewContainerRef
    );
  }
  ngOnDestroy(): void {
    this.destroyed();
  }

  ngOnInit(): void {
    this.apiService
      .get<PaymentPlanInfo[]>('payment-plans')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.paymentPlans = data;
        this.cdRef.detectChanges();
      });
  }
  onSelectionChange(index: number) {
    this.selectedIndex = index;
  }
  addOption() {
    const options = AddEditDialog.getOptions(
      this.addEditFormGroup,
      this.addEditTemplatePortal
    );
    const initValues = {
      paymentPlanId: 0,
      planName: '',
      payments: 1,
    };
    const dialogRef = this.dialog.open(AddEditDialog, options);
    dialogRef.afterOpened().subscribe((data) => {
      dialogRef.componentInstance.resetAddEditForm(initValues);
    });
    dialogRef.componentInstance.addEditEmitter
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result) => {
        if (dialogRef.componentInstance.hasError()) {
          return;
        }
        const values = this.addEditFormGroup.value;
        const duplicates = this.paymentPlans.filter(
          (value) => value.planName == values.planName
        );
        if (duplicates.length > 0) {
          this.alertService.showErrorAlert('Plan Name should be unique.');
        } else {
          this.paymentPlans.push(values);
          this.cdRef.detectChanges();
          dialogRef.componentInstance.onSuccess('Option added successfully.');
          dialogRef.componentInstance.resetAddEditForm(initValues);
        }
      });
  }

  editOption(selectedOptions: MatListOption[]) {
    if (this.hasSelectedOptions(selectedOptions)) {
      const options = AddEditDialog.getOptions(
        this.addEditFormGroup,
        this.addEditTemplatePortal,
        { edit: true }
      );
      const dialogRef = this.dialog.open(AddEditDialog, options);
      dialogRef.afterOpened().subscribe((data) => {
        const values = {
          paymentPlanId: selectedOptions[0].value.paymentPlanId,
          planName: selectedOptions[0].value.planName,
          payments: selectedOptions[0].value.payments,
        };
        dialogRef.componentInstance.resetAddEditForm(values);
        dialogRef.componentInstance.addEditEmitter
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            if (dialogRef.componentInstance.hasError()) {
              return;
            }
            const updatedPlan = this.addEditFormGroup.value;
            console.log(updatedPlan);

            const duplicates = this.paymentPlans.filter(
              (value, index) =>
                value.planName == updatedPlan.planName &&
                index != this.selectedIndex
            );
            if (duplicates.length > 0) {
              this.alertService.showErrorAlert('Plan Name should be unique.');
            } else {
              this.paymentPlans.map((value, index, paymentPlans) => {
                if (index == this.selectedIndex) {
                  paymentPlans[index] = updatedPlan;
                }
              });
              this.alertService.showSuccessAlert(
                'Option updated successfully.'
              );
              this.cdRef.detectChanges();
              dialogRef.close();
            }
          });
        //
      });
      //
    }
  }
  isInvalid(fieldName: string) {
    return OrbundValidators.isInvalid(this.addEditFormGroup, fieldName);
  }
  getErrorMessage(fieldName: string): string | null {
    if (this.addEditFormGroup.controls[fieldName].errors) {
      return this.addEditFormGroup.controls[fieldName].errors!.message;
    }
    return null;
  }
  private hasSelectedOptions(selectedOptions: MatListOption[]): boolean {
    if (selectedOptions.length == 0) {
      this.alertService.showAlert('Please select an option');
      return false;
    }
    return true;
  }

  removeOption(selectedOptions: MatListOption[]) {
    if (this.hasSelectedOptions(selectedOptions)) {
      this.dialogService.confirmDelete(() => {
        const deleted = this.paymentPlans.splice(this.selectedIndex, 1);
        for (let i = 0; i < deleted.length; i++) {
          this.deletedPlanIds.push(deleted[i].paymentPlanId);
        }
        this.cdRef.detectChanges();
        this.alertService.showSuccessAlert('Option removed successfully.');
      });
    }
  }

  savePaymentPlans() {
    this.apiService
      .post<any>('save-payment-plan', this.paymentPlans)
      .pipe(
        mergeMap((data) =>
          this.apiService
            .post<any>('delete-payment-plan', this.deletedPlanIds)
            .pipe(
              map((deleted) => {
                return {
                  savedPaymentPlans: data.savedPaymentPlans,
                  invalidPaymentPlans: data.invalidPaymentPlans,
                  invalidPaymentPlanIds: deleted.invalidPaymentPlanIds,
                  deletedPaymentPlanIds: deleted.deletedPaymentPlanIds,
                };
              })
            )
        ),
        take(1)
      )
      .subscribe((data) => {
        this.paymentPlans = data.savedPaymentPlans;
        this.alertService.showSuccessAlert(
          'Payment plans are saved successfully.'
        );
      });
  }

  back() {
    this.router.navigate(['/setup/customization']);
  }
}
