import { Component } from '@angular/core';
import { iDictionary } from '../../interfaces/i-dictionary';
import { ActivatedRoute } from '@angular/router';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { AuthService } from '../../auth/auth.service';

import { iUser } from '../../interfaces/iuser';
import { UserService } from '../../services/user.service';
import { DictionaryService } from '../../services/dictionary.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrl: './dictionary.component.scss',
})
export class DictionaryComponent {
  isPlaying = false;
  dictionary!: iDictionary;
  id!: number;
  user!: iUser;
  favorite!: iDictionary;
  lastViewedVideo!: iDictionary | null;
  public strategy = 'flip';
  public array = [1];
  size: NzButtonSize = 'small';
  dictionaryVideos: iDictionary[] = [];
  users: iUser[] = [];
  filteredVideos: iDictionary[] = [];
  searchTerm: string = '';
  showSearchResults: boolean = false;
  favorites: iDictionary[] = [];
  successMessages: { [key: number]: string } = {};
  errorMessages: { [key: number]: string } = {};
  constructor(
    private route: ActivatedRoute,
    private dictionarySvc: DictionaryService,
    private userSvc: UserService,
    private authSvc: AuthService
  ) {}
  ngOnInit(): void {
    this.dictionarySvc.dictionary$.subscribe((dictionaryVideos) => {
      this.dictionaryVideos = dictionaryVideos;
      this.filteredVideos = dictionaryVideos; // mostra tutti i video inizialmente
    });
    this.dictionarySvc.getAllDictionaryVideos().subscribe();
    this.userSvc.getAllUser().subscribe((user) => (this.users = user));

    // this.autoLogout();
    this.authSvc.restoreUser();
    this.getThisUser();
    this.loadLastViewedVideo(); // Recupera l'ultimo video visto all'avvio

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadVideo(+id);
      }
    });
  }

  // Funzione per cercare i video
  searchVideos() {
    this.showSearchResults = true; // Mostra i risultati della ricerca
    if (this.searchTerm.trim()) {
      this.filteredVideos = this.dictionaryVideos.filter((video) =>
        video.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredVideos = this.dictionaryVideos; // Se la ricerca è vuota, mostra tutti i video
    }
  }

  togglePlay(video: HTMLVideoElement) {
    if (video.paused) {
      video.play();
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }

  loadVideo(id: number) {
    this.dictionarySvc.getVideoDictionaryById(id).subscribe((video) => {
      this.dictionary = video;
      this.userWithFav();
      this.saveLastViewedVideo(video); // Salva automaticamente l'ultimo video in LocalStorage
    });
  }

  getThisUser() {
    this.userSvc.getCurrentUser().subscribe((user) => {
      if (user) {
        this.user = user;
        this.id = user.id!;
        this.getAllFavorites(); // ✅ Aggiorna i preferiti dopo aver caricato l'utente
      }
    });
  }

  userWithFav() {
    if (this.user && this.user.favoritesD) {
      const alreadyFavorite = this.user.favoritesD.some(
        (fav) => fav.id === this.dictionary.id
      );
      if (alreadyFavorite) {
        this.favorite = this.dictionary;
      }
    }
  }
  addFavoritesD(favorite: iDictionary, event: Event) {
    event.preventDefault(); // 🔹 Blocca la navigazione indesiderata

    if (
      !this.user ||
      !this.user.id ||
      !favorite ||
      typeof favorite.id !== 'number'
    ) {
      console.error('❌ Errore: utente o video non validi.');
      return;
    }

    const videoId = favorite.id;

    const alreadyFavorite = this.favorites.some((fav) => fav.id === videoId);
    if (alreadyFavorite) {
      this.errorMessages[videoId] = '⚠️ Il video è già tra i tuoi preferiti.';
      setTimeout(() => delete this.errorMessages[videoId], 3000);
      return;
    }

    this.userSvc.addFavoriteD(videoId).subscribe({
      next: (user) => {
        console.log('✅ Segno aggiunto ai preferiti:', user.favoritesD);
        this.favorites = user.favoritesD || [];

        this.successMessages[videoId] =
          '✅ Video aggiunto ai preferiti con successo!';
        setTimeout(() => delete this.successMessages[videoId], 3000);
      },
      error: (err) => {
        console.error("❌ Errore durante l'aggiunta ai preferiti:", err);
        this.errorMessages[videoId] =
          "❌ Errore durante l'aggiunta ai preferiti.";
        setTimeout(() => delete this.errorMessages[videoId], 3000);
      },
    });
  }

  saveLastViewedVideo(video: iDictionary) {
    localStorage.setItem(
      `lastViewedVideo_${this.user.username}`,
      JSON.stringify(video)
    );
  }

  loadLastViewedVideo() {
    if (this.user?.username) {
      const storedVideo = localStorage.getItem(
        `lastViewedVideo_${this.user.username}`
      );
      if (storedVideo) {
        this.lastViewedVideo = JSON.parse(storedVideo);
      }
    }
  }
  getAllFavorites() {
    this.userSvc.getAllFavorites().subscribe({
      next: (favorites) => {
        this.user.favoritesD = favorites; // ✅ Aggiorna l'elenco dei preferiti
      },
      error: (err) => console.error('Errore:', err),
    });
  }

  resumeLastViewedVideo() {
    if (this.lastViewedVideo) {
      this.loadVideo(this.lastViewedVideo.id!);
    }
  }
}
