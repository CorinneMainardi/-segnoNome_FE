import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactsComponent } from './contacts/contacts.component';



@NgModule({
  declarations: [
    AboutUsComponent,
    ContactsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class StaticPagesModule { }
