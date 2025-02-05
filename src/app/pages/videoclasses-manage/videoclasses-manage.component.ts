import { Component } from '@angular/core';
import { iUser } from '../../interfaces/iuser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { VideoclassesService } from '../../services/videoclasses.service';
import { iVideoClass } from '../../interfaces/i-video-class';

@Component({
  selector: 'app-videoclasses-manage',
  templateUrl: './videoclasses-manage.component.html',
  styleUrl: './videoclasses-manage.component.scss',
})
export class VideoclassesManageComponent {
  user!: iUser;
  validateForm: FormGroup;

  constructor(
    private authSvc: AuthService,
    private fb: FormBuilder,
    private videoClassSvc: VideoclassesService
  ) {
    this.validateForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      videoClassUrl: ['', [Validators.required]],
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
      const newVideoClass: iVideoClass = {
        title: this.validateForm.value.title,
        description: this.validateForm.value.description,
        videoClassUrl: this.validateForm.value.videoClassUrl,
      };

      // Chiamata al servizio per aggiungere la storia
      this.videoClassSvc.createVideoClass(newVideoClass).subscribe({
        next: (response) => {
          console.log('Video aggiunto con successo', response);
          this.validateForm.reset();
        },
        error: (error) => {
          console.error("Errore durante l'aggiunta del video", error);
        },
      });
    } else {
      console.log('Il form non è valido');
    }
  }

  // Funzione per resettare il form
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }
}
