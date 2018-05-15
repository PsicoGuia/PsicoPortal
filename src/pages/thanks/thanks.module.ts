import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule }  from '../../app/shared.module';
import { Thanks } from './thanks';

@NgModule({
  declarations: [
    Thanks,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(Thanks),
  ],
  exports: [
    Thanks
  ]
})
export class ThanksModule {}
