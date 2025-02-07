import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { iDictionary } from '../../interfaces/i-dictionary';
import { iUser } from '../../interfaces/iuser';
import { DictionaryService } from '../../services/dictionary.service';
import { VideoclassesService } from '../../services/videoclasses.service';
import { iVideoClass } from '../../interfaces/i-video-class';

@Component({
  selector: 'app-add-videoclass',
  templateUrl: './add-videoclass.component.html',
  styleUrl: './add-videoclass.component.scss',
})
export class AddVideoclassComponent {
  user!: iUser;
  validateForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private authSvc: AuthService,
    private fb: FormBuilder,
    private videoClassesSvc: VideoclassesService
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

      console.log('📤 Payload inviato:', JSON.stringify(newVideoClass)); // 🔍 DEBUG

      this.videoClassesSvc.createVideoClass(newVideoClass).subscribe({
        next: (response) => {
          this.successMessage = '✅ Video aggiunto con successo!';
          this.errorMessage = null; // Resetta il messaggio di errore
          this.validateForm.reset();

          // Nasconde il messaggio dopo 3 secondi
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (error) => {
          console.error("❌ Errore durante l'aggiunta del video", error);
          this.errorMessage = "❌ Errore durante l'aggiunta del video.";
          this.successMessage = null; // Resetta il messaggio di successo

          // Nasconde il messaggio dopo 3 secondi
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        },
      });
    } else {
      console.log('❌ Il form non è valido');
    }
  }
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }
}
