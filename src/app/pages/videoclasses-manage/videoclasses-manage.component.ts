import { Component } from '@angular/core';
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

  constructor(
    private videoClassesSvc: VideoclassesService,
    private router: Router,
    private fb: FormBuilder
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

  deleteVideo(id: number | undefined): void {
    if (id !== undefined) {
      this.videoClassesSvc.deleteVideoClass(id).subscribe({
        next: () => {
          this.videoClasses = this.videoClasses.filter((vc) => vc.id !== id);
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
  confirmDelete(video: iVideoClass) {
    if (confirm(`Sei sicuro di voler eliminare il video "${video.title}"?`)) {
      this.deleteVideo(video.id);
    }
  }
  // Metodo per resettare il form
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    this.editingVideo = null;
  }
}
