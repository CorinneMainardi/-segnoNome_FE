import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../auth/auth.service';
import { iEvent } from '../../interfaces/i-event';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  [x: string]: any;
  eventsByMonth: { [key: string]: iEvent[] } = {};
  userId: number | null = null;
  dotPosition = 'bottom';
  selectedSeats: { [key: number]: number } = {};
  constructor(
    private eventSvc: EventService,
    private reservationSvc: ReservationService,
    private authSvc: AuthService
  ) {
    this.userId = this.authSvc.getUserId();
  }

  ngOnInit(): void {
    this.eventSvc.getAllEvents().subscribe((events) => {
      this.groupEventsByMonth(events);
      events.forEach((event: any) => {
        // ✅ Cast manuale per evitare l'errore
        if (event.id !== undefined) {
          this.selectedSeats[event.id] = 1; // ✅ Inizializza per ogni evento
        }
      });
    });
  }
  groupEventsByMonth(events: iEvent[]): void {
    this.eventsByMonth = {};
    events.forEach((event) => {
      const month = new Date(event.eventDate).toLocaleString('default', {
        month: 'long',
      });
      if (!this.eventsByMonth[month]) {
        this.eventsByMonth[month] = [];
      }
      this.eventsByMonth[month].push(event);
    });
  }
  get months(): string[] {
    return Object.keys(this.eventsByMonth);
  }
  reserveSeat(
    eventId: number,
    seatCount: number,
    availableSeats: number
  ): void {
    if (seatCount > 0 && seatCount <= availableSeats && this.userId) {
      this.reservationSvc
        .reserveSeat({ eventId, userId: this.userId, seatCount })
        .subscribe(
          () => {
            alert(`Prenotazione di ${seatCount} posti confermata!`);
            this.updateAvailableSeats(eventId, seatCount);
          },
          () => alert('Errore nella prenotazione.')
        );
    } else {
      alert('Numero di posti non valido o utente non autenticato.');
    }
  }
  updateAvailableSeats(eventId: number, seatCount: number): void {
    for (let month in this.eventsByMonth) {
      let event = this.eventsByMonth[month].find((e) => e.id === eventId);
      if (event) {
        event.availableSeats -= seatCount; // 🔹 Riduce i posti disponibili dell'evento
        break;
      }
    }
  }
}
