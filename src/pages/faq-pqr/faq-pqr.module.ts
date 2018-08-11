import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FaqPqrPage } from './faq-pqr';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    FaqPqrPage,
  ],
  imports: [
    IonicPageModule.forChild(FaqPqrPage),
    ComponentsModule,
  ],
})
export class FaqPqrPageModule {}
