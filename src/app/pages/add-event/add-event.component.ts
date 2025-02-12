import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../auth/auth.service';
import { iUser } from '../../interfaces/iuser';
import { iEvent } from '../../interfaces/i-event';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss',
})
export class AddEventComponent {
  user!: iUser;
  validateForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private authSvc: AuthService,
    private fb: FormBuilder,
    private eventSvc: EventService
  ) {
    this.validateForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      eventDate: ['', [Validators.required]], // ✅ Corretto eventDate
      location: ['', [Validators.required]],
      availableSeats: [1, [Validators.required, Validators.min(1)]], // ✅ Minimo 1 posto
    });
  }

  ngOnInit(): void {
    this.authSvc.user$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('Form values:', this.validateForm.value); // ✅ DEBUG: Verifica il valore del form

      const newEvent: iEvent = {
        title: this.validateForm.value.title,
        description: this.validateForm.value.description,
        eventDate: this.validateForm.value.eventDate,
        location: this.validateForm.value.location,
        availableSeats: Number(this.validateForm.value.availableSeats), // ✅ Convertito in numero
      };

      this.eventSvc.createEvent(newEvent).subscribe({
        next: () => {
          this.successMessage = '✅ Evento aggiunto con successo!';
          this.errorMessage = null;
          this.validateForm.reset(); // ✅ Reset dopo il successo

          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (error) => {
          console.error("❌ Errore durante l'aggiunta dell'evento", error);
          this.errorMessage = "❌ Errore durante l'aggiunta dell'evento.";
          this.successMessage = null;

          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        },
      });
    } else {
      console.log('❌ Il form non è valido', this.validateForm.errors);
    }
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }
}
