import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CartService } from '../../providers/cart-service';
import { PopoverController } from 'ionic-angular';
import { ImageModalPage } from '../image-modal/image-modal';
import { ContentService } from '../../providers/content-service';

/**
 * Generated class for the Faqs page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 @IonicPage({
   segment: 'preguntas'
 })
@Component({
  selector: 'page-faqs',
  templateUrl: 'faqs.html',
})
export class Faqs {

  showDetails: any;
  showIcon: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public cartService: CartService, public popoverCtrl: PopoverController,
    public modalCtrl: ModalController, public contentService: ContentService) {
      this.showDetails = [false, false, false, false, false, false, false, false,
                  false, false, false, false, false, false, false];
      this.showIcon = [];

      for(let i = 0; i < 15; i++){
        this.showIcon.push('ios-arrow-forward');
      }
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad Faqs');
    this.contentService.analyticsPage('#/preguntas');
  }

  openModal()
  {
      let obj = {url:'assets/img/diagrama.png'};
      let myModal = this.modalCtrl.create(ImageModalPage, obj);
      myModal.present();
  }
  /**
  * Open a new window with the URL on the browser
  */
  openWindow(url:string){
    window.open(url);
  }

  toggleDetails(id){
    if(this.showDetails[id]){
      this.showDetails[id] = false;
      this.showIcon[id] = 'ios-arrow-forward';
    } else {
      this.showDetails[id] = true;
      this.showIcon[id] = 'ios-arrow-down';
    }
  }


}
