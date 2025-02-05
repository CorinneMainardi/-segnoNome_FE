import { Component, OnInit } from '@angular/core';
import { iVideoClass } from '../../interfaces/i-video-class';
import { iUser } from '../../interfaces/iuser';
import { VideoclassesService } from '../../services/videoclasses.service';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NzButtonSize } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-videoclasses',
  templateUrl: './videoclasses.component.html',
  styleUrl: './videoclasses.component.scss',
})
export class VideoclassesComponent implements OnInit {
  isPlaying = false;

  videoClass!: iVideoClass;
  id!: number;
  user!: iUser;
  favorite!: iVideoClass;
  lastViewedVideo!: iVideoClass | null;
  public strategy = 'flip';
  public array = [1];
  size: NzButtonSize = 'small';
  videoClasses: iVideoClass[] = [];
  users: iUser[] = [];

  constructor(
    private route: ActivatedRoute,
    private videoClassSvc: VideoclassesService,
    private userSvc: UserService,
    private authSvc: AuthService
  ) {}
  ngOnInit(): void {
    this.videoClassSvc.videoClasses$.subscribe((videoClasses) => {
      this.videoClasses = videoClasses;
    });
    this.videoClassSvc.getAllVideoClasses().subscribe();
    this.userSvc.getAllUser().subscribe((user) => (this.users = user));

    // this.autoLogout();
    this.authSvc.restoreUser();
    this.getThisUser();
    this.loadLastViewedVideo(); // Recupera l'ultimo video visto all'avvio

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadVideoClass(+id);
      }
    });
  }

  loadVideoClass(id: number) {
    this.videoClassSvc.getVideoClassById(id).subscribe((video) => {
      this.videoClass = video;
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
      this.favorite = this.videoClass;
    }
  }

  addFavorites() {
    if (this.user.id) {
      this.userSvc.addFavorite(this.user.id, this.favorite).subscribe(() => {
        console.log('Video class aggiunta ai preferiti!');
      });
    }
  }

  saveLastViewedVideo(video: iVideoClass) {
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
      this.loadVideoClass(this.lastViewedVideo.id!);
    }
  }
}
