import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageModalPage } from './image-modal';
import { SharedModule }  from '../../app/shared.module';
@NgModule({
  declarations: [
    ImageModalPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(ImageModalPage),
  ],
  exports: [
    ImageModalPage
  ]
})
export class ImageModalPageModule {}
