import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestsManagementRoutingModule } from './requests-management-routing.module';
import { RequestsManagementComponent } from './requests-management.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [RequestsManagementComponent],
  imports: [
    CommonModule,
    FormsModule,
    RequestsManagementRoutingModule,
    NzButtonModule,
    NzInputModule,
    NzCardModule,
    NzFormModule,
    NzIconModule,
    NzTagModule,
    NzSpaceModule,
    NzDividerModule,
    NzTableModule,
    NzSelectModule,
    NzModalModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, provideAnimationsAsync()],
})
export class RequestsManagementModule {}

// Ng-Zorro Modules
