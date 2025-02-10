import { Component } from '@angular/core';
import { iUser } from '../../interfaces/iuser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { DictionaryService } from '../../services/dictionary.service';
import { iDictionary } from '../../interfaces/i-dictionary';

@Component({
  selector: 'app-add-dictionary',
  templateUrl: './add-dictionary.component.html',
  styleUrl: './add-dictionary.component.scss',
})
export class AddDictionaryComponent {
  user!: iUser;
  validateForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private authSvc: AuthService,
    private fb: FormBuilder,
    private dictionarySvc: DictionaryService
  ) {
    this.validateForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dictionaryUrl: ['', [Validators.required]],
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
      const newVideoDictionary: iDictionary = {
        title: this.validateForm.value.title,
        description: this.validateForm.value.description,
        dictionaryUrl: this.validateForm.value.dictionaryUrl,
      };

      console.log('📤 Payload inviato:', JSON.stringify(newVideoDictionary)); // 🔍 DEBUG

      this.dictionarySvc.createDictionaryVideo(newVideoDictionary).subscribe({
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

  // Funzione per resettare il form
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }
}
