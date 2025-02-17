import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PaymentService } from '../../services/payment.service';
import { LessonInterestService } from '../../services/lesson-interest.service';
import Highcharts from 'highcharts';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  Highcharts: typeof Highcharts = Highcharts;

  totalUsers: number = 0;
  totalRequests: number = 0;
  handledRequests: number = 0;
  pendingRequests: number = 0;
  usersWhoPaid: number = 0;
  paymentPercentage: number = 0;

  //per i grafici
  userChartOptions!: Highcharts.Options;
  requestChartOptions!: Highcharts.Options;
  paymentChartOptions!: Highcharts.Options;

  constructor(
    private userSvc: UserService,
    private paymentSvc: PaymentService,
    private lessonsSvc: LessonInterestService
  ) {}

  loadData() {
    //recupero gli utenti
    this.userSvc.getAllUser().subscribe((users) => {
      this.totalUsers = users.length;
      this.calculatePaymentPercentage();
      this.updateCharts();
    });
    //richieste ricevute
    this.lessonsSvc.getAllRequests().subscribe((requests) => {
      this.totalRequests = requests.length;
      this.updateCharts();
    });
    // richieste gestite
    this.lessonsSvc.getHandledRequests().subscribe((handled) => {
      this.handledRequests = handled.length;
      this.updateCharts();
    });
    //richieste da gestire
    this.lessonsSvc.getPendingRequests().subscribe((pending) => {
      this.pendingRequests = pending.length;
      this.updateCharts();
    });
    //percentuale di acquisto

    this.paymentSvc.getUserHasPaid().subscribe((hasPaid) => {
      this.usersWhoPaid = hasPaid ? this.totalUsers : 0;
      this.calculatePaymentPercentage();
      this.updateCharts();
    });
  }

  //calcola la percerntale degli utenti che hanno pagato per le lezioni
  calculatePaymentPercentage() {
    if (this.totalUsers > 0) {
      //calcolo la percentuale degli utenti che hanno pagato
      this.paymentPercentage = (this.usersWhoPaid / this.totalUsers) * 100;
    }
  }

  //creazione dei grafic

  updateCharts() {
    //utenti che si sono iscritti e che hanno comprato il corso
    this.userChartOptions = {
      chart: { type: 'pie' },
      title: {
        text: 'Utenti che si sono registrati e utenti che hanno comprato le videolezioni ',
      },
      xAxis: {
        categories: [
          'Utenti iscritti',
          'Utenti che hanno comprato le videolezioni',
        ],
      },
      yAxis: { title: { text: 'Numero' } },
      series: [
        {
          type: 'pie',
          name: 'Users',
          data: [this.totalUsers, this.usersWhoPaid],
        },
      ],
    };
    //richieste di ricontatto per le lezioni in presenza
    this.requestChartOptions = {
      chart: { type: 'pie' },
      title: {
        text: `Richieste di Contatto (Totale: ${this.totalRequests})`,
      },
      series: [
        {
          type: 'pie',
          name: 'Richieste',
          data: [
            { name: 'Richieste Gestite', y: this.handledRequests },
            { name: 'Richieste da Gestire', y: this.pendingRequests },
          ],
        },
      ],
    };

    //percentuale di pagamento
    this.paymentChartOptions = {
      chart: { type: 'pie' },
      title: {
        text: 'Percentuale di Acquisto',
      },
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
        },
      ],
    };
  }
}
