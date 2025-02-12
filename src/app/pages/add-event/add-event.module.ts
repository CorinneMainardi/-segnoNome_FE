import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEventRoutingModule } from './add-event-routing.module';
import { AddEventComponent } from './add-event.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import {
  NzCarouselModule,
  NZ_CAROUSEL_CUSTOM_STRATEGIES,
  NzCarouselFlipStrategy,
} from 'ng-zorro-antd/carousel';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@NgModule({
  declarations: [AddEventComponent],
  imports: [
    CommonModule,
    AddEventRoutingModule,
    ReactiveFormsModule,
    NzCarouselModule,
    NzIconModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
  ],
  providers: [
    {
      provide: NZ_CAROUSEL_CUSTOM_STRATEGIES,
      useValue: [{ name: 'flip', strategy: NzCarouselFlipStrategy }],
    },
  ],
})
export class AddEventModule {}
