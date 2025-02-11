import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { iPaymentMethod } from '../interfaces/i-payment-method';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private paymentUrl = environment.paymentUrl;

  constructor(private http: HttpClient, private authSvc: AuthService) {}

  createPayment(): Observable<string> {
    const token = localStorage.getItem('accessData'); // ✅ Recupera il token

    if (!token) {
      console.error('❌ Nessun token JWT trovato nel localStorage!');
      return throwError(() => new Error('Utente non autenticato'));
    }

    console.log('📡 Token inviato nella richiesta:', token); // 🔍 Controllo

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(
      `${this.paymentUrl}/create-payment`,
      {}, // Corpo vuoto
      { responseType: 'text', headers } // ✅ Invia il token nel Bearer
    );
  }

  // 🔹 2. Imposta l'utente come "ha pagato"
  setUserHasPaid(): Observable<void> {
    return this.http.put<void>(`${this.paymentUrl}/setHasPaid`, {});
  }

  // 🔹 3. Controlla se l'utente ha già pagato
  getUserHasPaid(): Observable<boolean> {
    return this.http.get<boolean>(`${this.paymentUrl}/hasPaid`);
  }
}
