import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentPlanInfo } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PaymentPlanService {
  constructor(private http: HttpClient) {}

  getPaymentPlans() {
    return this.http.get<PaymentPlanInfo[]>('payment-plans');
  }

  getPaymentPlansBySubject(subjectId: number) {
    return this.http.get<PaymentPlanInfo[]>(
      'payment-plans-by-subject/' + subjectId
    );
  }

  getPaymentPlansByClass(classId: number) {
    return this.http.get<PaymentPlanInfo[]>(
      'payment-plans-by-class/' + classId
    );
  }
}
