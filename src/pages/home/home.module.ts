import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule }  from '../../app/shared.module';
import { Home } from './home';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    Home,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(Home),
    ComponentsModule,
  ],
  entryComponents: [
    Home,
  ]
})
export class HomeModule {}
