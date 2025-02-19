import * as Highcharts from 'highcharts';
import {
  Component,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { PaymentService } from '../../services/payment.service';
import { LessonInterestService } from '../../services/lesson-interest.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  Highcharts: typeof Highcharts = Highcharts;

  totalUsers: number = 0;
  totalRequests: number = 0;
  handledRequests: number = 0;
  pendingRequests: number = 0;
  usersWhoPaid: number = 0;

  userChartOptions: Highcharts.Options = {};
  requestChartOptions: Highcharts.Options = {};
  paymentChartOptions: Highcharts.Options = {};

  constructor(
    private userSvc: UserService,
    private paymentSvc: PaymentService,
    private lessonsSvc: LessonInterestService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.updateCharts(); // Forza il caricamento dei grafici dopo il rendering del componente
  }

  loadData() {
    this.userSvc.getAllUser().subscribe((users) => {
      this.totalUsers = users.length;
      //  Filtriamo gli utenti che hanno pagato
      this.usersWhoPaid = users.filter((user) => user.hasPaid).length;

      //  Calcoliamo quanti NON hanno pagato
      const usersWhoDidNotPay = this.totalUsers - this.usersWhoPaid;

      console.log(`✅ Utenti totali: ${this.totalUsers}`);
      console.log(`💰 Utenti che hanno pagato: ${this.usersWhoPaid}`);
      console.log(`❌ Utenti che NON hanno pagato: ${usersWhoDidNotPay}`);

      this.updateCharts();
    });
    this.userSvc.getAllUser().subscribe((users) => {
      this.totalUsers = users.length;
      this.updateCharts();
    });

    this.lessonsSvc.getAllRequests().subscribe((requests) => {
      this.totalRequests = requests.length;
      this.updateCharts();
    });

    this.lessonsSvc.getHandledRequests().subscribe((handled) => {
      this.handledRequests = handled.length;
      this.updateCharts();
    });

    this.lessonsSvc.getPendingRequests().subscribe((pending) => {
      this.pendingRequests = pending.length;
      this.updateCharts();
    });

    this.paymentSvc.getUserHasPaid().subscribe((hasPaid) => {
      this.usersWhoPaid = hasPaid ? this.totalUsers : 0;
      this.updateCharts();
    });
  }

  updateCharts() {
    this.userChartOptions = {
      chart: { type: 'pie' },
      title: { text: 'Utenti Registrati vs. Acquisti' },
      series: [
        {
          type: 'pie',
          name: 'Users',
          data: [
            { name: 'Utenti iscritti', y: this.totalUsers },
            {
              name: 'Utenti che hanno comprato le videolezioni',
              y: this.usersWhoPaid,
            },
          ],
        } as Highcharts.SeriesPieOptions,
      ],
    };

    this.requestChartOptions = {
      chart: { type: 'pie' },
      title: { text: `Richieste di Contatto (Totale: ${this.totalRequests})` },
      series: [
        {
          type: 'pie',
          name: 'Richieste',
          data: [
            { name: 'Richieste Gestite', y: this.handledRequests },
            { name: 'Richieste da Gestire', y: this.pendingRequests },
          ],
        } as Highcharts.SeriesPieOptions,
      ],
    };

    this.paymentChartOptions = {
      chart: { type: 'pie' },
      title: { text: 'Percentuale di Acquisto' },
      series: [
        {
          type: 'pie',
          name: 'Acquisti',
          data: [
            { name: 'Hanno acquistato', y: this.usersWhoPaid },
            {
              name: 'Non hanno acquistato',
              y: this.totalUsers - this.usersWhoPaid,
            },
          ],
        } as Highcharts.SeriesPieOptions,
      ],
    };

    this.cdr.detectChanges(); // Forza Angular a rilevare le modifiche e aggiornare la vista
    console.log(
      'Grafici aggiornati!',
      this.userChartOptions,
      this.requestChartOptions,
      this.paymentChartOptions
    );
  }
}
