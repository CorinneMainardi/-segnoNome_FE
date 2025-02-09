import { Component } from '@angular/core';
import { iLessonInterest } from '../../interfaces/i-lesson-interest';
import { LessonInterestService } from '../../services/lesson-interest.service';

@Component({
  selector: 'app-lesson-interests',
  templateUrl: './lesson-interests.component.html',
  styleUrl: './lesson-interests.component.scss',
})
export class LessonInterestsComponent {
  request: iLessonInterest = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    lessonType: 'ONLINE',
    preferredDays: '',
    preferredTimes: '',
    city: '',
  };

  constructor(private lessonService: LessonInterestService) {}

  // ✅ Controlla se la lezione è "IN_PERSON" per mostrare il campo "Città"
  isInPerson(): boolean {
    return this.request.lessonType === 'IN_PERSON';
  }

  // ✅ Controlla se il form è valido
  isFormValid(): boolean {
    return !!(
      this.request.firstName &&
      this.request.lastName &&
      this.request.email &&
      this.request.phoneNumber &&
      this.request.preferredDays && // ✅ Controllo valido
      this.request.preferredTimes && // ✅ Controllo valido
      (this.request.lessonType === 'ONLINE' ||
        (this.request.lessonType === 'IN_PERSON' && this.request.city))
    );
  }

  // ✅ Invia la richiesta
  submitRequest() {
    if (!this.isFormValid()) {
      alert('❌ Compila tutti i campi obbligatori!');
      return;
    }

    // ✅ Forza `preferredTimes` a essere una stringa
    this.request.preferredTimes = String(this.request.preferredTimes);

    console.log('📤 Inviando richiesta:', this.request);

    this.lessonService.createRequest(this.request).subscribe({
      next: () => {
        alert('✅ Richiesta inviata con successo!');
        this.resetForm();
      },
      error: (error) => {
        console.error('❌ Errore:', error);
        alert(
          "❌ Errore durante l'invio della richiesta! Guarda la console per i dettagli."
        );
      },
    });
  }

  // ✅ Reset del form
  resetForm() {
    this.request = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      lessonType: 'ONLINE',
      preferredDays: '',
      preferredTimes: '',
      city: '',
    };
  }
}
