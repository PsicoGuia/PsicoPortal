import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShoppingModal } from './shopping-modal';

@NgModule({
  declarations: [
    ShoppingModal,
  ],
  imports: [
    IonicPageModule.forChild(ShoppingModal),
  ],
  exports: [
    ShoppingModal
  ]
})
export class ShoppingModalPageModule {}
