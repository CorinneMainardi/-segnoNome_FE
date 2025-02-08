import { Component } from '@angular/core';
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

  constructor(
    private dictionarySvc: DictionaryService,
    private router: Router,
    private fb: FormBuilder
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

  deleteVideo(id: number | undefined): void {
    if (id !== undefined) {
      this.dictionarySvc.deleteDictionaryVideo(id).subscribe({
        next: () => {
          this.dictionary = this.dictionary.filter((vc) => vc.id !== id);
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
  confirmDelete(video: iDictionary) {
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
