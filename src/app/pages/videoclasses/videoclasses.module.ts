import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoclassesRoutingModule } from './videoclasses-routing.module';
import { VideoclassesComponent } from './videoclasses.component';
import {
  NZ_CAROUSEL_CUSTOM_STRATEGIES,
  NzCarouselFlipStrategy,
  NzCarouselModule,
} from 'ng-zorro-antd/carousel';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [VideoclassesComponent],
  imports: [
    CommonModule,
    VideoclassesRoutingModule,
    ReactiveFormsModule,
    NzCarouselModule,
    NzIconModule,
    NzCardModule,
  ],
  providers: [
    {
      provide: NZ_CAROUSEL_CUSTOM_STRATEGIES,
      useValue: [{ name: 'flip', strategy: NzCarouselFlipStrategy }],
    },
  ],
})
export class VideoclassesModule {}
