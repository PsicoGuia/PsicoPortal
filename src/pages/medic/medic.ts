import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterMedicPage } from '../register-medic/register-medic';

/**
 * Generated class for the MedicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ segment: 'medic' })
@Component({
  selector: 'page-medic',
  templateUrl: 'medic.html',
})
export class MedicPage {
  params: Object;
  pushPage: any;
    
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pushPage = RegisterMedicPage;
    this.params = { id: 42 };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicPage');
  }

}
