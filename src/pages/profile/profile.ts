import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'profile'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profile :any;
  stduies = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    // Dommy profile
    this.profile = {
      professionalCardNumber:  34567656,
      picture: "http://casitaoaxaca.com/koken/storage/cache/images/000/029/oxc-fb-profile-img-h1,medium_large.1501091503.png",
      user : {first_name:"primer nombre", last_name:"Apellidos"},
      location: "Cll false 234",
      url : "url('"+"http://casitaoaxaca.com/koken/storage/cache/images/000/029/oxc-fb-profile-img-h1,medium_large.1501091503.png"+"')"
    }
    this.stduies = [
      {title:"studio 1"},
      {title:"studio 2"},
      {title:"studio 3"},
      {title:"studio 4"},
      
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
