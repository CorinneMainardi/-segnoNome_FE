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
  telefono: number = +393807137674;
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
    // this.userId = this.authSvc.getUserId();
  }

  ngOnInit(): void {
    this.userId = this.getUserIdSafely();
    console.log('🟡 User ID recuperato in HomeComponent:', this.userId);
    this.eventSvc.getAllEvents().subscribe((events) => {
      this.groupEventsByMonth(events);
      events.forEach((event: any) => {
        // ✅ Cast manuale per evitare l'errore
        if (event.id !== undefined) {
          this.selectedSeats[event.id] = 1; //  Inizializza per ogni evento
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
    this.userId = this.authSvc.getUserId(); // ✅ Recuperiamo userId come numero
    console.log('🟡 Tentativo di prenotazione:', {
      eventId,
      seatCount,
      availableSeats,
      userId: this.userId,
    });

    if (seatCount > 0 && seatCount <= availableSeats && this.userId) {
      this.reservationSvc
        .reserveSeat({ eventId, userId: Number(this.userId), seatCount }) // ✅ Convertiamo userId in numero
        .subscribe({
          next: () => {
            alert(`✅ Prenotazione di ${seatCount} posti confermata!`);
            this.updateAvailableSeats(eventId, seatCount);
          },
          error: (err) => {
            console.error('❌ Errore nella prenotazione:', err);
            alert('❌ Errore durante la prenotazione. Riprova.');
          },
        });
    } else {
      console.error('❌ ERRORE: Condizione non rispettata', {
        seatCount,
        availableSeats,
        userId: this.userId,
      });
      alert('❌ Numero di posti non valido o utente non autenticato.');
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
  getUserIdSafely(): number | null {
    let userId = this.authSvc.getUserId();
    if (!userId) {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        userId = user.id || null;
      }
    }
    return userId;
  }
}
