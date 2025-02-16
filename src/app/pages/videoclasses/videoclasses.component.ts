import { PaymentService } from './../../services/payment.service';
import { Component, OnInit } from '@angular/core';
import { iVideoClass } from '../../interfaces/i-video-class';
import { iUser } from '../../interfaces/iuser';
import { VideoclassesService } from '../../services/videoclasses.service';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  videoPresentation!: iVideoClass | null;
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
  showPaymentPopup = false; //per il popup
  // Stato pagamento
  paymentSuccess = false;
  showPaymentForm = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private videoClassSvc: VideoclassesService,
    private userSvc: UserService,
    private authSvc: AuthService,
    private paymentSvc: PaymentService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['paymentSuccess'] === 'true') {
        alert(
          '✅ Pagamento avvenuto con successo! Ora puoi accedere ai video.'
        );

        // 🔹 Rimuove il parametro paymentSuccess dall'URL per evitare di mostrarlo dopo il refresh
        this.router.navigate([], {
          queryParams: { paymentSuccess: null },
          queryParamsHandling: 'merge',
        });
      }
    });
    // Controlla se l'utente ha già pagato
    this.userSvc.getUserHasPaid().subscribe({
      next: (hasPaid) => {
        this.paymentSuccess = hasPaid;
        if (hasPaid) {
          this.showPaymentForm = false;
          this.videoPresentation = null;
        }
      },
      error: (err) => {
        console.error('❌ Errore nel recupero dello stato di pagamento:', err);
      },
    });

    this.videoClassSvc.getAllVideoClasses().subscribe((videoClasses) => {
      // ✅ Separiamo il video con ID 52 e il resto dei video per il carosello
      this.videoPresentation =
        videoClasses.find((video) => video.id === 52) || null;
      this.videoClasses = videoClasses.filter((video) => video.id !== 52);
    });

    this.videoClassSvc.getAllVideoClasses().subscribe();
    this.userSvc.getAllUser().subscribe((user) => (this.users = user));

    this.authSvc.restoreUser();
    this.getThisUser();
    this.loadLastViewedVideo();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadVideoClass(+id);
      }
    });
  }

  togglePaymentForm() {
    this.showPaymentForm = !this.showPaymentForm;
  }

  // 🔹 Carica il pulsante di PayPal dinamicamente
  startPayPalPayment() {
    const token = localStorage.getItem('accessData'); // 🔥 Recupera il token JWT
    console.log('🔍 Token JWT che verrà inviato a PayPal:', token);

    if (!token) {
      console.error('❌ Nessun token JWT trovato!');
      alert('Errore: utente non autenticato.');
      return;
    }

    this.paymentSvc.createPayment().subscribe({
      next: (paymentUrl) => {
        if (paymentUrl) {
          console.log('🔗 Redirect a PayPal:', paymentUrl);
          window.location.href = paymentUrl; // 🔥 Reindirizza a PayPal
        } else {
          console.error('❌ Errore: URL di pagamento non ricevuto!');
          alert(
            'Errore nel pagamento: il server non ha restituito un link valido.'
          );
        }
      },
      error: (err) => {
        console.error('❌ Errore nella creazione del pagamento:', err);
        alert('Errore nel pagamento. Riprova più tardi.');
      },
    });
  }

  // 🔹 Conferma il pagamento e aggiorna lo stato dell'utente
  confirmPaymentSuccess() {
    this.paymentSvc.setUserHasPaid().subscribe({
      next: () => {
        this.paymentSuccess = true;
        this.showPaymentForm = false;
        this.showPaymentPopup = true;
        this.videoPresentation = null;
        this.showPaymentSuccessMessage();
        this.hidePaymentSuccessMessage();
        // 🔹 Reindirizza alla pagina delle videolezioni con un messaggio di successo
        this.router.navigate(['/videoclasses'], {
          queryParams: { paymentSuccess: 'true' },
        });
      },
      error: (err) => {
        console.error("❌ Errore nell'aggiornamento dello stato:", err);
        alert('Errore nell’aggiornare lo stato del pagamento.');
      },
    });
  }
  showPaymentSuccessMessage() {
    this.paymentSuccess = true;
    setTimeout(() => {
      if (this.paymentSuccess) {
        this.paymentSuccess = false; // ✅ Nasconde il popup solo se è ancora attivo
      }
    }, 3000);
  }
  hidePaymentSuccessMessage() {
    setTimeout(() => {
      if (this.showPaymentPopup) {
        this.showPaymentPopup = false;
      }
    }, 3000);
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
      this.saveLastViewedVideo(video);
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
}
