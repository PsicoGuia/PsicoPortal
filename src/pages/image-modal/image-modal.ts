import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ImageModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-image-modal',
  templateUrl: 'image-modal.html',
})
export class ImageModalPage {

  URL_Image:string;

  constructor(public viewCtrl: ViewController, public navParams: NavParams)
  {
    //console.log(this.navParams.get('url'));
    this.URL_Image = this.navParams.get('url');
  }

  closeModal() {
      this.viewCtrl.dismiss();
    }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ImageModalPage');
    //console.log('URL IMagen',this.navParams.get('url'));
  }
}
