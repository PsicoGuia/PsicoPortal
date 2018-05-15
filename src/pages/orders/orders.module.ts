import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule }  from '../../app/shared.module';
import { Orders } from './orders';

@NgModule({
  declarations: [
    Orders,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(Orders),
  ],
  exports: [
    Orders
  ]
})
export class OrdersModule {}
