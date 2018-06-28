import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterMedicPage } from './register-medic';
import { HeaderPiscoguiaComponent } from '../../components/header-piscoguia/header-piscoguia';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    RegisterMedicPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterMedicPage),
    ComponentsModule,
  ],
})
export class RegisterMedicPageModule {}
