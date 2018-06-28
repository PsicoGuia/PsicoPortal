import { NgModule } from '@angular/core';
import { HeaderPiscoguiaComponent } from './header-piscoguia/header-piscoguia';
import { HeaderComponent } from './header/header';
import { IonicPageModule } from 'ionic-angular';
import { DeprecatedI18NPipesModule } from '@angular/common';
@NgModule({
	declarations: [
		HeaderComponent
	],
	imports: [
		DeprecatedI18NPipesModule,
		IonicPageModule.forChild(HeaderComponent)
	],
	exports: [
		HeaderComponent
	]
})
export class ComponentsModule { }
