import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the WarrantyModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-warranty-modal',
  templateUrl: 'warranty-modal.html',
})
export class WarrantyModal {

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad WarrantyModalPage');
  }

  closeModal(){
    this.view.dismiss();
  }
}
