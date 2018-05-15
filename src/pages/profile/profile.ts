import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartService } from '../../providers/cart-service';
import { UserService } from '../../providers/user-service';
import { ConfigService } from '../../providers/config-service';

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  segment: 'perfil'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  refered:any;
  user:any;
  flag_mail:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public cartService: CartService, private userService: UserService,
              public configService:ConfigService) {
      userService.getStoredUser().then((data) => {
        this.user = data;
        this.flag_mail = data.person.flag_mails;
        // console.log("this is data user", data);
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  oncheckChange(flag_mails){
    this.configService.showLoader('Cargando');
    this.userService.setRefered({'flag_mail':flag_mails}).then((data) => {
      this.configService.showToast("cambio realizado", "toast-success");
      this.configService.dismissLoader();
    }, (error) => {
      this.configService.showToast(error.message, "toast-failed");
      this.configService.dismissLoader();      
    });
  }
}
