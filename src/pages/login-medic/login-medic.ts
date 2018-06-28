import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ConfigService } from '../../providers/config-service';
import { UserService } from '../../providers/user-service';
import { Settings } from '../../providers/settings';

/**
 * Generated class for the LoginMedicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ segment: "login-medic" })
@Component({
  selector: 'page-login-medic',
  templateUrl: 'login-medic.html',
})
export class LoginMedicPage {
  loading = false;
  loginMedicForm: FormGroup = this.formBuilder.group({
    'email': ['', [Validators.required, Validators.email]],
    'password': ['', [Validators.required, Validators.minLength(6)]],
  });


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private configService: ConfigService,
    private userService: UserService,
    private settings: Settings,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginMedicPage');
  }

  login() {
    console.log("RegisterMeLoginMedicPagedicPage:register", this.settings.settings.user);
    this.loading = true;
    this.userService.loginmedic({
      email: this.loginMedicForm.value.email,
      password: this.loginMedicForm.value.password
    })
      .then((data) => {
        console.log("login:OK", data);
        this.configService.showToast("Bienvenido", 'toast-success')
        this.loading = false;
        this.navCtrl.setRoot('ProfileMedicPage');
      }).catch(err => {
        console.log("login:err", err);
        this.configService.showToast("Revisa tus credenciales", "toast-failed")
        this.loading = false;
      })
  }


}