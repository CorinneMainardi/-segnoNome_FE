import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonInterestsComponent } from './lesson-interests.component';

const routes: Routes = [{ path: '', component: LessonInterestsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LessonInterestsRoutingModule { }
