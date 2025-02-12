import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { IconsProviderModule } from '../../icons-provider.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NzCarouselModule,
    IconsProviderModule,
    FormsModule,
  ],
})
export class HomeModule {}
