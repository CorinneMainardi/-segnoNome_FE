import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DictionaryManageRoutingModule } from './dictionary-manage-routing.module';
import { DictionaryManageComponent } from './dictionary-manage.component';


@NgModule({
  declarations: [
    DictionaryManageComponent
  ],
  imports: [
    CommonModule,
    DictionaryManageRoutingModule
  ]
})
export class DictionaryManageModule { }
