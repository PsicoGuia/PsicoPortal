import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WarrantyModal } from './warranty-modal';

@NgModule({
  declarations: [
    WarrantyModal,
  ],
  imports: [
    IonicPageModule.forChild(WarrantyModal),
  ],
  exports: [
    WarrantyModal
  ]
})
export class WarrantyModalPageModule {}
