import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DictionaryManageComponent } from './dictionary-manage.component';

const routes: Routes = [{ path: '', component: DictionaryManageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DictionaryManageRoutingModule { }
