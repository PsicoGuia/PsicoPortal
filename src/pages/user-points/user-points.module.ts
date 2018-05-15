import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPointsPage } from './user-points';

@NgModule({
  declarations: [
    UserPointsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserPointsPage),
  ],
  exports: [
    UserPointsPage
  ]
})
export class UserPointsPageModule {}
