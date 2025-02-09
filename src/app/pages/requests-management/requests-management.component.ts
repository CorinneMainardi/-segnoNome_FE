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

  /** ✅ Conferma eliminazione */
  confirmDeleteRequest(id: number) {
    this.confirmDeleteId = id;
  }

  /** ✅ Alterna la modalità modifica */
  toggleEditMode(id: number) {
    this.editModes[id] = !this.editModes[id];
  }

  /** ✅ Aggiorna una richiesta */
  updateRequest(request: iLessonInterest) {
    this.lessonInterestSvc
      .updateRequest(request.id!, {
        contacted: Boolean(request.contacted),
        interested: Boolean(request.interested),
        toBeRecontacted: Boolean(request.toBeRecontacted),
        handled: Boolean(request.handled),
        note: request.note || '',
      })
      .subscribe({
        next: (response) => {
          const updatedRequest = response as iLessonInterest; // ✅ Cast esplicito

          this.editModes[request.id!] = false;

          // ✅ Rimuove la richiesta da pendingRequests se è stata gestita
          if (updatedRequest.handled) {
            this.pendingRequests = this.pendingRequests.filter(
              (r) => r.id !== request.id
            );
            this.handledRequests.push(updatedRequest);
          } else {
            // ✅ Se non è gestita, aggiorna l'array delle richieste da gestire
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
  deleteRequest() {
    if (this.confirmDeleteId === null) return;

    this.lessonInterestSvc.deleteRequest(this.confirmDeleteId).subscribe({
      next: () => {
        this.loadRequests();
        this.showNotification('success', 'Richiesta eliminata con successo');
      },
      error: () =>
        this.showNotification(
          'error',
          "Errore durante l'eliminazione della richiesta"
        ),
    });

    this.confirmDeleteId = null;
  }
}
