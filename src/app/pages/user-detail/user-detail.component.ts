import { DictionaryService } from './../../services/dictionary.service';
import { Component } from '@angular/core';
import { iAccessData } from '../../interfaces/iaccess-data';
import { Subject } from 'rxjs/internal/Subject';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { iDictionary } from '../../interfaces/i-dictionary';
import { iUser } from '../../interfaces/iuser';
import { UserService } from '../../services/user.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  favorites: iDictionary[] = [];
  id!: number;
  user!: iUser;

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private userSvc: UserService
  ) {}
  ngOnInit() {
    // this.autoLogout();
    this.authSvc.restoreUser();
    this.getCurrentUser();
    if (this.user.favoritesD) this.favorites = this.user.favoritesD;
  }

  getCurrentUser() {
    this.userSvc
      .getCurrentUser()
      .subscribe((response) => (this.user = response));
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
            // ✅ Verifica che sia un'immagine valida
            this.userSvc.uploadImage(this.user.id, imageBase64).subscribe({
              next: (user) => {
                console.log('Immagine aggiornata:', user.img);
                this.user.img = user.img;
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
