import { PaymentService } from './../../services/payment.service';
import { Component, OnInit } from '@angular/core';
import { iVideoClass } from '../../interfaces/i-video-class';
import { iUser } from '../../interfaces/iuser';
import { VideoclassesService } from '../../services/videoclasses.service';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iPaymentMethod } from '../../interfaces/i-payment-method';

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

  //Modulo pagamento
  paymentForm: FormGroup;
  paymentSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private videoClassSvc: VideoclassesService,
    private userSvc: UserService,
    private authSvc: AuthService,
    private fb: FormBuilder,
    private PaymentSvc: PaymentService
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{16}$')],
      ],
      expirationDate: [
        '',
        [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/[0-9]{2}$')],
      ], // MM/YY
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      cardHolderName: ['', Validators.required],
      type: ['CREDIT', Validators.required],
    });
  }
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

  submitPayment() {
    if (this.paymentForm.valid) {
      this.userSvc.getCurrentUser().subscribe({
        next: (user) => {
          if (!user || !user.id) {
            console.error('Errore: utente non valido o ID mancante.');
            return;
          }

          const payment: iPaymentMethod = {
            userId: user.id,
            ...this.paymentForm.value,
          };

          this.PaymentSvc.addPaymentMethod(payment).subscribe({
            next: (res) => {
              console.log('Metodo di pagamento aggiunto:', res);
              this.paymentSuccess = true; // ✅ Segna il pagamento come avvenuto
            },
            error: (err) => console.error('Errore nel pagamento:', err),
          });
        },
        error: (err) => console.error('Errore nel recupero utente:', err),
      });
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
