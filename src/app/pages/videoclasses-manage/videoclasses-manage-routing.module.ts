import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoclassesManageComponent } from './videoclasses-manage.component';

const routes: Routes = [{ path: '', component: VideoclassesManageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoclassesManageRoutingModule { }
