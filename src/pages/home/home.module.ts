import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule }  from '../../app/shared.module';
import { Home } from './home';


@NgModule({
  declarations: [
    Home,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(Home),
  ],
  entryComponents: [
    Home,
  ]
})
export class HomeModule {}
