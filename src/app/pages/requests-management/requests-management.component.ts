import { Component } from '@angular/core';
import { iLessonInterest } from '../../interfaces/i-lesson-interest';
import { LessonInterestService } from '../../services/lesson-interest.service';

@Component({
  selector: 'app-requests-management',
  templateUrl: './requests-management.component.html',
  styleUrl: './requests-management.component.scss',
})
export class RequestsManagementComponent {
  pendingRequests: iLessonInterest[] = [];
  handledRequests: iLessonInterest[] = [];
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  showNotificationFlag: boolean = false;
  confirmDeleteId: number | null = null;

  //per il popup di conferma
  confirmPopupVisible = false; // Stato per il popup di conferma
  confirmAction: (() => void) | null = null; // Funzione da eseguire dopo conferma
  confirmMessage: string = ''; // Messaggio dinamico da mostrare

  /** ✅ Oggetto per gestire lo stato di modifica */
  editModes: { [key: number]: boolean } = {}; // ID della richiesta → modalità modifica

  constructor(private lessonInterestSvc: LessonInterestService) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.lessonInterestSvc.getPendingRequests().subscribe((data) => {
      this.pendingRequests = data;
      this.initEditModes(data);
    });

    this.lessonInterestSvc.getHandledRequests().subscribe((data) => {
      this.handledRequests = data;
    });
  }

  /** ✅ Inizializza editModes per ogni richiesta */
  initEditModes(requests: iLessonInterest[]) {
    this.editModes = {};
    requests.forEach((req) => {
      this.editModes[req.id!] = false;
    });
  }

  /** ✅ Mostra una notifica personalizzata */
  showNotification(type: 'success' | 'error', message: string) {
    this.notificationType = type;
    this.notificationMessage = message;
    this.showNotificationFlag = true;
    setTimeout(() => (this.showNotificationFlag = false), 3000);
  }

  /** ✅ Alterna la modalità modifica */
  toggleEditMode(id: number) {
    this.editModes[id] = !this.editModes[id];
  }

  /** ✅ Aggiorna una richiesta */
  updateRequest(request: iLessonInterest) {
    this.lessonInterestSvc
      .updateRequest(request.id!, {
        contacted: request.contacted || false, // ✅ Evita valori `undefined`
        interested: request.interested || false,
        toBeRecontacted: request.toBeRecontacted || false,
        handled: request.handled || false,
        note: request.note ? request.note.trim() : '', // ✅ Assicurati che `note` non sia null
      })
      .subscribe({
        next: (response) => {
          const updatedRequest = response as iLessonInterest; // ✅ Cast esplicito

          this.editModes[request.id!] = false;

          if (updatedRequest.handled) {
            this.pendingRequests = this.pendingRequests.filter(
              (r) => r.id !== request.id
            );
            this.handledRequests.push(updatedRequest);
          } else {
            const index = this.pendingRequests.findIndex(
              (r) => r.id === request.id
            );
            if (index !== -1) this.pendingRequests[index] = updatedRequest;
          }

          this.showNotification('success', 'Richiesta aggiornata con successo');
        },
        error: (error) => {
          console.error('Errore aggiornamento richiesta:', error);
          this.showNotification('error', "Errore durante l'aggiornamento");
        },
      });
  }

  /** ✅ Elimina una richiesta */
  // deleteRequest() {
  //   if (this.confirmDeleteId === null) return;

  //   this.lessonInterestSvc.deleteRequest(this.confirmDeleteId).subscribe({
  //     next: () => {
  //       this.loadRequests();
  //       this.showNotification('success', 'Richiesta eliminata con successo');
  //     },
  //     error: () =>
  //       this.showNotification(
  //         'error',
  //         "Errore durante l'eliminazione della richiesta"
  //       ),
  //   });

  //   this.confirmDeleteId = null;
  // }
  confirmDeleteRequest(id: number) {
    this.confirmDeleteId = id; // ✅ Memorizza l'ID correttamente
    this.showConfirmPopup(
      '❗ Sei sicuro di voler eliminare questa richiesta?',
      () => this.deleteRequest() // ✅ Non passa `id`, usa `confirmDeleteId`
    );
  }

  deleteRequest() {
    if (this.confirmDeleteId === null) return; // ✅ Evita errori se ID non è impostato

    this.lessonInterestSvc.deleteRequest(this.confirmDeleteId).subscribe({
      next: () => {
        this.loadRequests();
        this.showNotification('success', 'Richiesta eliminata con successo');
        this.confirmPopupVisible = false;
      },
      error: () =>
        this.showNotification(
          'error',
          "Errore durante l'eliminazione della richiesta"
        ),
    });

    this.confirmDeleteId = null; // ✅ Reset dell'ID dopo eliminazione
  }

  /**
   * Mostra il popup di conferma con un messaggio personalizzato
   */
  showConfirmPopup(message: string, action: () => void) {
    this.confirmMessage = message;
    this.confirmAction = action;
    this.confirmPopupVisible = true;
  }

  /**
   * Esegue l'azione confermata e chiude il popup
   */
  confirmActionExecution() {
    if (this.confirmAction) {
      this.confirmAction(); // Esegue l'azione salvata
    }
    this.confirmPopupVisible = false; // Chiude il popup
    this.confirmAction = null; // Reset
  }
}
