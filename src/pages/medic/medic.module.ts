import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicPage } from './medic';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MedicPage
    
  ],
  imports: [
    IonicPageModule.forChild(MedicPage),
    ComponentsModule,
  ],
})
export class MedicPageModule {}
