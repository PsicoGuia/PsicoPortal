import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddAttentionChannelPage } from './add-attention-channel';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AddAttentionChannelPage,
  ],
  imports: [
    IonicPageModule.forChild(AddAttentionChannelPage),
    ComponentsModule,
  ],
})
export class AddAttentionChannelPageModule {}
