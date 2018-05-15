import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the SendModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-send-modal',
  templateUrl: 'send-modal.html',
})
export class SendModal {

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SendModalPage');
  }

  closeModal(){
    this.view.dismiss();
  }
}
