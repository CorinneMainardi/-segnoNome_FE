import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDetailRoutingModule } from './user-detail-routing.module';
import { UserDetailComponent } from './user-detail.component';
import { NzCardModule } from 'ng-zorro-antd/card';

@NgModule({
  declarations: [UserDetailComponent],
  imports: [CommonModule, UserDetailRoutingModule, NzCardModule],
})
export class UserDetailModule {}
