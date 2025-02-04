import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoclassesRoutingModule } from './videoclasses-routing.module';
import { VideoclassesComponent } from './videoclasses.component';


@NgModule({
  declarations: [
    VideoclassesComponent
  ],
  imports: [
    CommonModule,
    VideoclassesRoutingModule
  ]
})
export class VideoclassesModule { }
