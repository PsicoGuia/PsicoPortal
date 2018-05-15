import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartService } from '../../providers/cart-service';

/**
 * Generated class for the TermsConditionsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  segment: 'terminos-condiciones'
})
@Component({
  selector: 'page-terms-conditions',
  templateUrl: 'terms-conditions.html',
})
export class TermsConditionsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public cartService: CartService,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsConditionsPage');
  }

}
