import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginMedicPage } from './login-medic';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    LoginMedicPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginMedicPage),
    ComponentsModule,
  ],
})
export class LoginMedicPageModule {}
