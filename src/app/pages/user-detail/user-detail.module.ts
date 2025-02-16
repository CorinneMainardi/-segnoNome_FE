import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDetailRoutingModule } from './user-detail-routing.module';
import { UserDetailComponent } from './user-detail.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [UserDetailComponent],
  imports: [CommonModule, UserDetailRoutingModule, NzCardModule, NzModalModule],
})
export class UserDetailModule {}
