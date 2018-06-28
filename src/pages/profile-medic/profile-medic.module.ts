import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileMedicPage } from './profile-medic';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ProfileMedicPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileMedicPage),
    ComponentsModule,
  ],
})
export class ProfileMedicPageModule {}
