import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoclassesManageRoutingModule } from './videoclasses-manage-routing.module';
import { VideoclassesManageComponent } from './videoclasses-manage.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { TokenInterceptor } from '../../auth/token.interceptor';

@NgModule({
  declarations: [VideoclassesManageComponent],
  imports: [
    CommonModule,
    VideoclassesManageRoutingModule,
    NzIconModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzSelectModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    provideAnimationsAsync(),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
})
export class VideoclassesManageModule {}
