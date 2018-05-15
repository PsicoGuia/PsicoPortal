import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule }  from '../../app/shared.module';
import { Faqs } from './faqs';

@NgModule({
  declarations: [
    Faqs,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(Faqs),
  ],
  exports: [
    Faqs
  ]
})
export class FaqsModule {}
