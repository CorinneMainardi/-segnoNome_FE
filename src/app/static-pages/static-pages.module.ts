import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactsComponent } from './contacts/contacts.component';
import { StaticPagesRoutingModule } from './static-pages-routing.module';

@NgModule({
  declarations: [AboutUsComponent, ContactsComponent],
  imports: [CommonModule, StaticPagesRoutingModule],
})
export class StaticPagesModule {}
