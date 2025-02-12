import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventUrl = environment.eventUrl;
  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<any> {
    return this.http.get(`${this.eventUrl}`);
  }

  createEvent(event: any): Observable<any> {
    return this.http.post(`${this.eventUrl}`, event);
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete(`${this.eventUrl}/${eventId}`);
  }
}
