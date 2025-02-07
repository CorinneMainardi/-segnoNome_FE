import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddDictionaryRoutingModule } from './add-dictionary-routing.module';
import { AddDictionaryComponent } from './add-dictionary.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@NgModule({
  declarations: [AddDictionaryComponent],
  imports: [
    CommonModule,
    AddDictionaryRoutingModule,

    NzIconModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzSelectModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, provideAnimationsAsync()],
})
export class AddDictionaryModule {}
