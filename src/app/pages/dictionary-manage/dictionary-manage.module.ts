import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DictionaryManageRoutingModule } from './dictionary-manage-routing.module';
import { DictionaryManageComponent } from './dictionary-manage.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [DictionaryManageComponent],
  imports: [
    CommonModule,
    DictionaryManageRoutingModule,
    NzIconModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzSelectModule,
    NzModalModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, provideAnimationsAsync()],
})
export class DictionaryManageModule {}
