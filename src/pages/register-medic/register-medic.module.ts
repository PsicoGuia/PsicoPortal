import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterMedicPage } from './register-medic';
import { HeaderPiscoguiaComponent } from '../../components/header-piscoguia/header-piscoguia';

@NgModule({
  declarations: [
    RegisterMedicPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterMedicPage),
  ],
})
export class RegisterMedicPageModule {}
