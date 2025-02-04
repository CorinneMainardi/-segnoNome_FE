import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoclassesManageRoutingModule } from './videoclasses-manage-routing.module';
import { VideoclassesManageComponent } from './videoclasses-manage.component';


@NgModule({
  declarations: [
    VideoclassesManageComponent
  ],
  imports: [
    CommonModule,
    VideoclassesManageRoutingModule
  ]
})
export class VideoclassesManageModule { }
