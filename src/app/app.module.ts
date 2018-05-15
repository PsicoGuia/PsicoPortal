import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ConfigService } from '../providers/config-service';
import { ProductService } from '../providers/product-service';
import { CartService } from '../providers/cart-service';
import { UserService } from '../providers/user-service';
import { ContentService } from '../providers/content-service';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { StatusBar } from '@ionic-native/status-bar';
//import { Http } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
//import {ImageModalPage} from '../pages/image-modal/image-modal'

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      preloadModules: true,
      mode: 'md'
    }),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
  ConfigService, ProductService, CartService, ContentService, SplashScreen,
  StatusBar, InAppBrowser, UserService ]
})
export class AppModule {}
