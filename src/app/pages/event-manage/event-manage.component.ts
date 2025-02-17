import { ChangeDetectorRef, Component } from '@angular/core';
import { iEvent } from '../../interfaces/i-event';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { iVideoClass } from '../../interfaces/i-video-class';

@Component({
  selector: 'app-event-manage',
  templateUrl: './event-manage.component.html',
  styleUrl: './event-manage.component.scss',
})
export class EventManageComponent {
  events: iEvent[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  editingEvent: iEvent | null = null; // Variabile per gestire l'evento in modifica
  validateForm!: FormGroup;

  confirmDeleteVisible = false; //  Controlla se il popup sia visibile
  eventToDelete: iEvent | null = null; // Salva il video selezionato per l'eliminazione
  confirmPopupVisible = false;
  confirmMessage: string = ''; // Messaggio nel popup
  confirmAction: (() => void) | null = null; // Azione da eseguire dopo la conferma

  constructor(
    private eventSvc: EventService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.eventSvc.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
      },
      error: (err) => {
        console.error('Errore durante il recupero degli eventi', err);
        this.errorMessage = 'Errore durante il recupero degli eventi';
      },
    });

    // Inizializzare il form
    this.validateForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      date: ['', [Validators.required]],
    });
  }

  // deleteEvent(id: number | undefined): void {
  //   if (id !== undefined) {
  //     this.eventSvc.deleteEvent(id).subscribe({
  //       next: () => {
  //         this.events = this.events.filter((event) => event.id !== id);
  //         this.successMessage = '✅ Evento eliminato con successo!';
  //       },
  //       error: (err) => {
  //         console.error("❌ Errore durante l'eliminazione dell'evento", err);
  //         this.errorMessage = "Errore durante l'eliminazione dell'evento";
  //       },
  //     });
  //   } else {
  //     console.error('❌ Evento id is undefined!');
  //   }
  // }

  editEvent(event: iEvent): void {
    this.editingEvent = event;
    this.validateForm.patchValue(event); // Precompila il form con i dati dell'evento
  }

  submitForm(): void {
    if (this.validateForm.valid && this.editingEvent) {
      const updatedEvent: iEvent = {
        ...this.editingEvent, // Mantiene l'ID e altre proprietà esistenti
        ...this.validateForm.value, // Aggiorna solo i valori modificati
      };

      if (this.editingEvent.id !== undefined) {
        this.eventSvc
          .updateEvent(this.editingEvent.id, updatedEvent)
          .subscribe({
            next: () => {
              this.showSuccessMessage('✅ Evento aggiornato con successo!');
              this.errorMessage = null;
              this.editingEvent = null; // Reset dell'evento in modifica
              this.validateForm.reset(); // Reset del form
              this.refreshEvents(); // Aggiorna l'elenco degli eventi
            },
            error: (err) => {
              console.error(
                "❌ Errore durante l'aggiornamento dell'evento",
                err
              );
              this.showErrorMessage(
                "❌ Errore durante l'aggiornamento dell'evento"
              );
              this.successMessage = null;
            },
          });
      } else {
        console.error("❌ ID dell'evento non valido");
      }
    } else {
      console.log('❌ Il form non è valido');
    }
  }

  // confirmDelete(event: iEvent) {
  //   if (confirm(`Sei sicuro di voler eliminare l'evento "${event.title}"?`)) {
  //     this.deleteEvent(event.id);
  //   }
  // }

  // Metodo per aggiornare la lista degli eventi dopo una modifica
  refreshEvents(): void {
    this.eventSvc.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
      },
      error: (err) => {
        console.error('❌ Errore durante il recupero degli eventi', err);
        this.errorMessage = 'Errore durante il recupero degli eventi';
      },
    });
  }

  // Metodo per resettare il form
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    this.editingEvent = null;
  }
  showSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => (this.successMessage = null), 3000); // Nasconde il messaggio dopo 3 sec
  }

  showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = null), 3000); // Nasconde il messaggio dopo 3 sec
  }
  showConfirmPopup(message: string, action: () => void) {
    this.confirmMessage = message;
    this.confirmAction = action;
    this.confirmPopupVisible = true;
    this.cdr.detectChanges(); // Forza l'aggiornamento della UI
  }

  /** ✅ Esegue l'azione confermata e chiude il popup */
  confirmActionExecution() {
    if (this.confirmAction) {
      this.confirmAction(); // Esegue l'azione salvata (es. eliminazione)
    }
    this.closeConfirmPopup(); // Chiude il popup
  }

  /** ✅ Funzione per chiudere il popup e resettare i dati */
  closeConfirmPopup() {
    console.log('Chiusura popup conferma');
    this.confirmPopupVisible = false;
    this.confirmMessage = '';
    this.confirmAction = null;
    this.cdr.detectChanges();
  }

  /** ✅ Mostra il popup di conferma per eliminare un video */
  confirmDelete(event: iEvent) {
    this.showConfirmPopup(
      `❗ Sei sicuro di voler eliminare "${event.title}"?`,
      () => this.deleteVideo(event.id)
    );
  }

  /** ✅ Elimina un video */
  deleteVideo(id: number | undefined): void {
    if (id !== undefined) {
      this.eventSvc.deleteEvent(id).subscribe({
        next: () => {
          this.events = this.events.filter((vc) => vc.id !== id);
          console.log(`✅ Video con ID ${id} eliminato con successo.`);
        },
        error: (err) => {
          console.error("❌ Errore durante l'eliminazione del video", err);
          this.errorMessage = "Errore durante l'eliminazione del video";
        },
      });
    } else {
      console.error('❌ Video id is undefined!');
    }
  }
  onPopupVisibilityChange(visible: boolean) {
    console.log('NzModal ha cambiato visibilità:', visible);
  }
}
