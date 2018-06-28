import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicPage } from './medic';

@NgModule({
  declarations: [
    MedicPage
    
  ],
  imports: [
    IonicPageModule.forChild(MedicPage),
  ],
})
export class MedicPageModule {}
