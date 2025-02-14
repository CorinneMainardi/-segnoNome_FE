import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { iEvent } from '../interfaces/i-event';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventUrl = environment.eventUrl;
  private eventsSubject = new BehaviorSubject<iEvent[]>([]);
  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<any> {
    return this.http.get(`${this.eventUrl}`);
  }

  createEvent(event: any): Observable<any> {
    return this.http.post(`${this.eventUrl}`, event);
  }

  updateEvent(id: number, updatedEvent: iEvent) {
    return this.http.put<iEvent>(`${this.eventUrl}/${id}`, updatedEvent).pipe(
      tap((updatedE) => {
        const currentEvents = this.eventsSubject.getValue(); // Ottieni eventi attuali
        const updatedEvents = currentEvents.map((event) =>
          event.id === id ? updatedE : event
        );
        this.eventsSubject.next(updatedEvents); // Aggiorna lo stato
      })
    );
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete(`${this.eventUrl}/${eventId}`);
  }
}
