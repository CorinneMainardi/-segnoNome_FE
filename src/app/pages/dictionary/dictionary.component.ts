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

  constructor(
    private route: ActivatedRoute,
    private dictionarySvc: DictionaryService,
    private userSvc: UserService,
    private authSvc: AuthService
  ) {}
  ngOnInit(): void {
    this.dictionarySvc.dictionary$.subscribe((dictionaryVideos) => {
      this.dictionaryVideos = dictionaryVideos;
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
      }
    });
  }

  userWithFav() {
    if (this.user.id) {
      this.favorite = this.dictionary;
    }
  }

  addFavoritesD() {
    if (this.user.id) {
      this.userSvc.addFavoriteD(this.user.id, this.favorite).subscribe(() => {
        console.log('Video class aggiunta ai preferiti!');
      });
    }
  }

  saveLastViewedVideo(video: iDictionary) {
    localStorage.setItem(
      `lastViewedVideo_${this.user.username}`,
      JSON.stringify(video)
    );
  }

  loadLastViewedVideo() {
    const storedVideo = localStorage.getItem(
      `lastViewedVideo_${this.user?.username}`
    );
    if (storedVideo) {
      this.lastViewedVideo = JSON.parse(storedVideo);
    }
  }

  resumeLastViewedVideo() {
    if (this.lastViewedVideo) {
      this.loadVideo(this.lastViewedVideo.id!);
    }
  }
}
