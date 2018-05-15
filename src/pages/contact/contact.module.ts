import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule }  from '../../app/shared.module';
import { Contact } from './contact';

@NgModule({
  declarations: [
    Contact,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(Contact),
  ],
  exports: [
    Contact
  ]
})
export class ContactModule {}
