import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule }  from '../../app/shared.module';
import { ContactModal } from './contact-modal';

@NgModule({
  declarations: [
    ContactModal,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(ContactModal),
  ],
  exports: [
    ContactModal
  ]
})
export class ContactModalModule {}
