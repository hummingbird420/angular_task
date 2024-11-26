import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ERROR_CODE } from 'src/app/constants/api-error-code';
import { AlertService, AuthService } from 'src/app/services';

@Component({
  selector: 'o-agreement-policy',
  templateUrl: './agreement-policy.page.html',
  styleUrls: ['./agreement-policy.page.scss'],
})
export class AgreementPolicyPage implements OnInit, AfterViewInit, OnDestroy {
  constructor(private authService: AuthService, private alertSevice: AlertService, private router: Router) {}
  ngOnDestroy(): void {
    const agreementContent = document.querySelector('.card-auth');
    agreementContent!.classList.remove('agreement');
  }
  ngAfterViewInit(): void {
    const agreementContent = document.querySelector('.card-auth');
    agreementContent!.classList.add('agreement');
  }
  ngOnInit(): void {}
  agree() {
    this.authService
      .aggrementPolicy()
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.alertSevice.showErrorAlert(ERROR_CODE.genric_error);
          this.router.navigate(['/auth/login']);
        },
      });
  }
}
