import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { iPaymentMethod } from '../interfaces/i-payment-method';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private paymentUrl = environment.paymentUrl;

  constructor(private http: HttpClient) {}

  addPaymentMethod(payment: iPaymentMethod): Observable<iPaymentMethod> {
    return this.http.post<iPaymentMethod>(
      `${this.paymentUrl}/addPayment`,
      payment
    );
  }

  getUserPayments(userId: number): Observable<iPaymentMethod[]> {
    return this.http.get<iPaymentMethod[]>(`${this.paymentUrl}/user/${userId}`);
  }
}
