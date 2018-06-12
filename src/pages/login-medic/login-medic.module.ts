import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginMedicPage } from './login-medic';

@NgModule({
  declarations: [
    LoginMedicPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginMedicPage),
  ],
})
export class LoginMedicPageModule {}
