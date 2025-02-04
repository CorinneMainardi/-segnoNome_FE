import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoclassesComponent } from './videoclasses.component';

const routes: Routes = [{ path: '', component: VideoclassesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoclassesRoutingModule { }
