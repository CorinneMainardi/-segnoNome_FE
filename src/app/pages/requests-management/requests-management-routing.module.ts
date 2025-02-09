import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestsManagementComponent } from './requests-management.component';

const routes: Routes = [{ path: '', component: RequestsManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestsManagementRoutingModule { }
