import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PqrPage } from './pqr';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PqrPage,
  ],
  imports: [
    IonicPageModule.forChild(PqrPage),
    ComponentsModule,
  ],
})
export class PqrPageModule {}
