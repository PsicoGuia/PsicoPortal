import { Component, ViewChild } from '@angular/core';
import {
  Slides, AlertController, Content, NavController, IonicPage, Modal,
  ModalController, Platform, NavParams, Events
} from 'ionic-angular';
import { ConfigService } from '../../providers/config-service';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { UserService } from '../../providers/user-service';
import { MyApp } from '../../app/app.component';
//import { SendModal } from '../send-modal/send-modal';
//import { WarrantyModal } from '../warranty-modal/warranty-modal';
//import { GuideModal } from '../guide-modal/guide-modal';
@IonicPage({
  segment: 'home',
  priority: 'high'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) content: Content;
  //--------------------------------------
  //CONSTANTS
  //--------------------------------------

  // TODO Defines the number of products to be loaded

  slidesList: Array<{ image: string }>;
  loadingSlides = true;
  slidesList2: Array<{ image: string }>;
  loadingSlides2 = true;
  wModal: Modal;
  guideModal: Modal;
  scrollCount: any;

  infiniteScroll: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public configService: ConfigService,
    public alertCtrl: AlertController,
    private modal: ModalController,
    private inAppBrowser: InAppBrowser,
    public platform: Platform,
    public appComponent: MyApp,
    public events: Events,
    //public userService: UserService,
    
  ) {

    this.scrollCount = 0;
    this.slidesList = [];
    this.slidesList2 = [];

  }

  ionViewWillEnter() {
    this.events.publish('enableHeader');
  }

  ionViewDidLoad() {
    this.configService.analyticsPage('/');
    this.loadHome();
  }


  loadHome() {
    this.loadingSlides = true;
  }


  loadCategories() {
    let kidCategorias: Array<any> = [];
  }


  goToShop() {
    try {
      let size = (document.getElementsByName("categorys-main")).length - 1;
      let yOffset = (document.getElementsByName("categorys-main")[size]).offsetTop;
      //console.log("offset", yOffset);
      this.content.scrollTo(0, yOffset, 1000);
    }
    catch (e) {

    }
  }


  goToExternalUrl(url) {
    this.platform.ready().then(() => {
      this.inAppBrowser.create(url, "_blank");
    });
  }

}
