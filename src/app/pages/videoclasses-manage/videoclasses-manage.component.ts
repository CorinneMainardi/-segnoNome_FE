import { ChangeDetectorRef, Component } from '@angular/core';
import { iUser } from '../../interfaces/iuser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { VideoclassesService } from '../../services/videoclasses.service';
import { iVideoClass } from '../../interfaces/i-video-class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-videoclasses-manage',
  templateUrl: './videoclasses-manage.component.html',
  styleUrl: './videoclasses-manage.component.scss',
})
export class VideoclassesManageComponent {
  videoClasses: iVideoClass[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  editingVideo: iVideoClass | null = null; // Variabile per gestire il video in modifica
  validateForm!: FormGroup;

  //per il popup
  confirmDeleteVisible = false; //  Controlla se il popup sia visibile
  videoToDelete: iVideoClass | null = null; // Salva il video selezionato per l'eliminazione
  confirmPopupVisible = false;
  confirmMessage: string = ''; // Messaggio nel popup
  confirmAction: (() => void) | null = null; // Azione da eseguire dopo la conferma

  constructor(
    private videoClassesSvc: VideoclassesService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.videoClassesSvc.getAllVideoClasses().subscribe({
      next: (videoClasses) => {
        this.videoClasses = videoClasses;
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
      videoClassUrl: ['', [Validators.required]],
    });
  }

  // deleteVideo(id: number | undefined): void {
  //   if (id !== undefined) {
  //     this.videoClassesSvc.deleteVideoClass(id).subscribe({
  //       next: () => {
  //         this.videoClasses = this.videoClasses.filter((vc) => vc.id !== id);
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

  editVideo(video: iVideoClass): void {
    this.editingVideo = video;
    this.validateForm.patchValue(video); // Precompilo il form con i dati del video
  }

  submitForm(): void {
    if (this.validateForm.valid && this.editingVideo) {
      const updatedVideoClass = this.validateForm.value;
      //devo controllare che l'id non sia undefined
      if (this.editingVideo.id !== undefined) {
        this.videoClassesSvc
          .updateVideoClass(this.editingVideo.id, updatedVideoClass)
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
  // confirmDelete(video: iVideoClass) {
  //   this.videoToDelete = video; // ✅ Salva il video da eliminare
  //   this.confirmDeleteVisible = true; // ✅ Mostra il popup
  // }

  // Metodo per resettare il form
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    this.editingVideo = null;
  }
  // confirmDeleteVideo() {
  //   if (this.videoToDelete && this.videoToDelete.id !== undefined) {
  //     this.deleteVideo(this.videoToDelete.id);
  //   }
  //   this.confirmDeleteVisible = false; // Chiude il popup
  //   this.videoToDelete = null; // Resetta il video selezionato
  // }
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
  confirmDelete(video: iVideoClass) {
    this.showConfirmPopup(
      `❗ Sei sicuro di voler eliminare "${video.title}"?`,
      () => this.deleteVideo(video.id)
    );
  }

  /** ✅ Elimina un video */
  deleteVideo(id: number | undefined): void {
    if (id !== undefined) {
      this.videoClassesSvc.deleteVideoClass(id).subscribe({
        next: () => {
          this.videoClasses = this.videoClasses.filter((vc) => vc.id !== id);
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
