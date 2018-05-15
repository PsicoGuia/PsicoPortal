import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuideModal } from './guide-modal';

@NgModule({
  declarations: [
    GuideModal,
  ],
  imports: [
    IonicPageModule.forChild(GuideModal),
  ],
  exports: [
    GuideModal,
  ]
})
export class GuideModalPageModule {}
