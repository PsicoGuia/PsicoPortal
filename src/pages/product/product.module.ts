import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule }  from '../../app/shared.module';
import { Product } from './product';

@NgModule({
  declarations: [
    Product,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(Product),
  ],
  entryComponents: [
    Product,
  ]
})
export class ProductModule {}
