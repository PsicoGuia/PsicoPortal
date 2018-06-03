import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterMedicPage } from './register-medic';

@NgModule({
  declarations: [
    RegisterMedicPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterMedicPage),
  ],
})
export class RegisterMedicPageModule {}
