import { DictionaryService } from './../../services/dictionary.service';
import { Component } from '@angular/core';
import { iAccessData } from '../../interfaces/iaccess-data';
import { Subject } from 'rxjs/internal/Subject';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { iDictionary } from '../../interfaces/i-dictionary';
import { iUser } from '../../interfaces/iuser';
import { UserService } from '../../services/user.service';
import { map, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  favorites: iDictionary[] = [];
  id!: number;
  user!: iUser;
  getFavoritesUrl: string = environment.getFavoritesUrl;
  successMessages: { [key: number]: string } = {};
  errorMessages: { [key: number]: string } = {};
  globalMessage: string | null = null;
  globalMessageType: string = 'success-message';

  //queste sono le variabili che mi servono per la conferma dell'eliminazione
  confirmDeleteVisible = false; //  Controlla se il popup sia visibile
  videoToDelete: iDictionary | null = null; // Salva il video selezionato per l'eliminazione

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private userSvc: UserService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.authSvc.restoreUser();
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.userSvc.getCurrentUser().subscribe((response) => {
      this.user = { ...response };
      console.log('Dati utente caricati:', this.user);
      this.getAllFavorites();
    });
  }

  getAllFavorites() {
    this.userSvc.getAllFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
        console.log('Preferiti caricati:', this.favorites);
      },
      error: (err) => console.error('Errore nel recupero dei preferiti:', err),
    });
  }

  removeFavoriteD(id: number) {
    this.http.delete<void>(`${environment.getFavoritesUrl}/${id}`).subscribe({
      next: () => {
        this.favorites = this.favorites.filter((video) => video.id !== id);
        console.log(`✅ Video con ID ${id} rimosso dai preferiti.`);
        this.showPopupMessage(
          '✅ Video rimosso dai preferiti con successo!',
          'success-message'
        );
      },
      error: (err) => {
        console.error('❌ Errore durante la rimozione del preferito:', err);
        this.showPopupMessage(
          '❌ Errore durante la rimozione del video.',
          'error-message'
        );
      },
    });
  }

  confirmRemoveFavorite(video: iDictionary) {
    if (video.id === undefined) {
      console.error('❌ Errore: ID del video non valido.');
      this.showPopupMessage('❌ Errore: ID non valido.', 'error-message');
      return;
    }

    this.videoToDelete = video; //salva il video da eliminare
    this.confirmDeleteVisible = true; //mostra il popoup
  }
  confirmDeleteVideo() {
    if (this.videoToDelete && this.videoToDelete.id !== undefined) {
      this.removeFavoriteD(this.videoToDelete.id);
    }
    this.confirmDeleteVisible = false; // Chiude il popup
    this.videoToDelete = null; // Resetta il video selezionato
  }

  showPopupMessage(message: string, type: string) {
    this.globalMessage = message;
    this.globalMessageType = type;
    setTimeout(() => {
      this.globalMessage = null;
    }, 3000); // Nasconde il messaggio dopo 3 secondi
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (this.user && typeof this.user.id === 'number') {
          const imageBase64 = reader.result as string;

          if (imageBase64.startsWith('data:image')) {
            this.userSvc.uploadImage(this.user.id, imageBase64).subscribe({
              next: (user) => {
                console.log('Immagine aggiornata:', user.imgUrl);
                this.user.imgUrl = user.imgUrl;
              },
              error: (err) => console.error('Errore upload immagine:', err),
            });
          } else {
            console.error(
              "Errore: il file selezionato non è un'immagine valida"
            );
          }
        } else {
          console.error('Errore: ID utente mancante o non valido');
        }
      };
    }
  }
}
