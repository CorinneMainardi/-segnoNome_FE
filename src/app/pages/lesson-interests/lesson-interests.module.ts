import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LessonInterestsRoutingModule } from './lesson-interests-routing.module';
import { LessonInterestsComponent } from './lesson-interests.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';

@NgModule({
  declarations: [LessonInterestsComponent],
  imports: [
    FormsModule,
    CommonModule,
    LessonInterestsRoutingModule,
    NzButtonModule,
    NzInputModule,
    NzCardModule,
    NzFormModule,
    NzIconModule,
    NzSelectModule,
    NzDatePickerModule,
    NzTimePickerModule,
  ],
})
export class LessonInterestsModule {}
