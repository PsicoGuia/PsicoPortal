import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendModal } from './send-modal';

@NgModule({
  declarations: [
    SendModal,
  ],
  imports: [
    IonicPageModule.forChild(SendModal),
  ],
  exports: [
    SendModal
  ]
})
export class SendModalPageModule {}
