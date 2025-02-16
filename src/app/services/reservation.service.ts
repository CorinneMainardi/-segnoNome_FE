import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  reservationUrl = environment.reservationUrl;
  constructor(private http: HttpClient) {}

  getUserReservations(userId: number): Observable<any> {
    return this.http.get(`${this.reservationUrl}/user/${userId}`);
  }

  reserveSeat(reservationData: {
    eventId: number;
    userId: number;
    seatCount: number;
  }): Observable<any> {
    return this.http.post(`${this.reservationUrl}`, reservationData);
  }

  deleteReservation(userId: number, eventId: number): Observable<any> {
    return this.http.delete(`${this.reservationUrl}/${userId}/${eventId}`);
  }
}
