import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [CommonModule, AdminDashboardRoutingModule, HighchartsChartModule],
})
export class AdminDashboardModule {}
