import { ChangeDetectorRef, Component } from '@angular/core';
import { iDictionary } from '../../interfaces/i-dictionary';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { iVideoClass } from '../../interfaces/i-video-class';
import { VideoclassesService } from '../../services/videoclasses.service';
import { DictionaryService } from '../../services/dictionary.service';

@Component({
  selector: 'app-dictionary-manage',
  templateUrl: './dictionary-manage.component.html',
  styleUrl: './dictionary-manage.component.scss',
})
export class DictionaryManageComponent {
  dictionary: iDictionary[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  editingVideo: iDictionary | null = null; // Variabile per gestire il video in modifica
  validateForm!: FormGroup;

  //per il popup
  confirmDeleteVisible = false; //  Controlla se il popup sia visibile
  videoToDelete: iDictionary | null = null; // Salva il video selezionato per l'eliminazione
  confirmPopupVisible = false;
  confirmMessage: string = ''; // Messaggio nel popup
  confirmAction: (() => void) | null = null; // Azione da eseguire dopo la conferma

  constructor(
    private dictionarySvc: DictionaryService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dictionarySvc.getAllDictionaryVideos().subscribe({
      next: (dictionary) => {
        this.dictionary = dictionary;
      },
      error: (err) => {
        console.error('Errore durante il recupero dei video', err);
        this.errorMessage = 'Errore durante il recupero dei video';
      },
    });

    // Inizializzare il form
    this.validateForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dictionaryUrl: ['', [Validators.required]],
    });
  }

  // deleteVideo(id: number | undefined): void {
  //   if (id !== undefined) {
  //     this.dictionarySvc.deleteDictionaryVideo(id).subscribe({
  //       next: () => {
  //         this.dictionary = this.dictionary.filter((vc) => vc.id !== id);
  //       },
  //       error: (err) => {
  //         console.error("❌ Errore durante l'eliminazione del video", err);
  //         this.errorMessage = "Errore durante l'eliminazione del video";
  //       },
  //     });
  //   } else {
  //     console.error('❌ Video id is undefined!');
  //   }
  // }

  editVideo(video: iDictionary): void {
    this.editingVideo = video;
    this.validateForm.patchValue(video); // Precompilo il form con i dati del video
  }

  submitForm(): void {
    if (this.validateForm.valid && this.editingVideo) {
      const updatedDictionary = this.validateForm.value;
      //devo controllare che l'id non sia undefined
      if (this.editingVideo.id !== undefined) {
        this.dictionarySvc
          .updateDictionaryVideo(this.editingVideo.id, updatedDictionary)
          .subscribe({
            next: () => {
              this.successMessage = '✅ Video aggiornato con successo!';
              this.errorMessage = null; // Resetta eventuali errori
              this.editingVideo = null; // Reset del video in modifica
              this.validateForm.reset(); // Reset del form
            },
            error: (err) => {
              this.errorMessage = "❌ Errore durante l'aggiornamento del video";
              this.successMessage = null;
            },
          });
      } else {
        console.error('❌ ID del video non valido');
      }
    } else {
      console.log('❌ Il form non è valido');
    }
  }
  // confirmDelete(video: iDictionary) {
  //   if (confirm(`Sei sicuro di voler eliminare il video "${video.title}"?`)) {
  //     this.deleteVideo(video.id);
  //   }
  // }
  // Metodo per resettare il form
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    this.editingVideo = null;
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
  confirmDelete(video: iDictionary) {
    this.showConfirmPopup(
      `❗ Sei sicuro di voler eliminare "${video.title}"?`,
      () => this.deleteVideo(video.id)
    );
  }

  /** ✅ Elimina un video */
  deleteVideo(id: number | undefined): void {
    if (id !== undefined) {
      this.dictionarySvc.deleteDictionaryVideo(id).subscribe({
        next: () => {
          this.dictionary = this.dictionary.filter((vc) => vc.id !== id);
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
