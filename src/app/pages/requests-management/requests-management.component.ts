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

  constructor(private lessonInterestSvc: LessonInterestService) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.lessonInterestSvc
      .getPendingRequests()
      .subscribe((data) => (this.pendingRequests = data));
    this.lessonInterestSvc
      .getHandledRequests()
      .subscribe((data) => (this.handledRequests = data));
  }

  showNotification(type: 'success' | 'error', message: string) {
    this.notificationType = type;
    this.notificationMessage = message;
    this.showNotificationFlag = true;
    setTimeout(() => (this.showNotificationFlag = false), 3000);
  }
  confirmDeleteRequest(id: number) {
    this.confirmDeleteId = id;
  }

  updateRequest(request: iLessonInterest) {
    this.lessonInterestSvc
      .updateRequest(request.id!, {
        contacted: Boolean(request.contacted), // Converte il valore selezionato in booleano
        interested: Boolean(request.interested),
        toBeRecontacted: Boolean(request.toBeRecontacted),
        handled: Boolean(request.handled),
        note: request.note || '', // Evita undefined nelle note
      })
      .subscribe({
        next: () => {
          this.loadRequests();
          this.showNotification('success', 'Richiesta aggiornata con successo');
        },
        error: (error) => {
          console.error('Errore aggiornamento richiesta:', error);
          this.showNotification('error', "Errore durante l'aggiornamento");
        },
      });
  }
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

    this.confirmDeleteId = null; // Reset conferma
  }
}
