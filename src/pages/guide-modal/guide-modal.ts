import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';


/**
 * Generated class for the GuideModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-guide-modal',
  templateUrl: 'guide-modal.html',
})
export class GuideModal {

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad GuideModalPage');
  }

  closeModal(){
    this.view.dismiss();
  }
}
