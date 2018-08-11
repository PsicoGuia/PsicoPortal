import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileMedicDetailPage } from './profile-medic-detail';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    ProfileMedicDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileMedicDetailPage),
    ComponentsModule,
  ],
})
export class ProfileMedicDetailPageModule {}
