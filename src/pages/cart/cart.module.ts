import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule }  from '../../app/shared.module';
import { Cart } from './cart';

@NgModule({
  declarations: [
    Cart,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(Cart),
  ],
  entryComponents: [
    Cart,
  ]
})
export class CartModule {}
