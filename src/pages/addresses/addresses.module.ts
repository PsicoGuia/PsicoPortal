import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule }  from '../../app/shared.module';
import { Addresses } from './addresses';

@NgModule({
  declarations: [
    Addresses,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(Addresses),
  ],
  exports: [
    Addresses
  ]
})
export class AddressesModule {}
