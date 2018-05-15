import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,
   ViewController, AlertController, Events} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ConfigService } from '../../providers/config-service';
import { UserService } from '../../providers/user-service';
import { ProductService } from '../../providers/product-service';

/**
 * Generated class for the LoginModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login-modal',
  templateUrl: 'login-modal.html',
})
export class LoginModal {

  credentials = {
      username: '',
      password: '',
  };

  email:any;
  _flagForget:boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private view: ViewController, private inAppBrowser: InAppBrowser,
  public configService: ConfigService, public userService: UserService, 
  private alertCtrl: AlertController, public productService:ProductService, 
  public events:Events) {
    this._flagForget = false;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginModalPage');
  }

  forgetPassword(){
    if (this.email) {
      this.configService.showLoader('Cargando');
      this.userService.forgotPassword(this.email).then((data) => {
        let alert = this.alertCtrl.create({
          title: 'Recuperar contraseña',
          message: 'Al correo ' + this.email + ' fueron enviadas las instrucciones para recuperar tu contraseña.',
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancelar'
            },
          ]
        });
        this.configService.dismissLoader();
        alert.present();
        this.configService.showToast("Email de recuperación enviado", "toast-success");
      }, (err) => {
        this.configService.dismissLoader();
        this.configService.showToast("Email inválido", "toast-failed");          
      });
    }else{
      this.configService.showToast("Email inválido", "toast-failed");
    }
  }

  logIn(){
    if(this.credentials.username && this.credentials.password){
      this.configService.showLoader("Validando credenciales...");
      this.userService.login(this.credentials).then((result) => {
          this.loadUserInfo().then((result) => {
              this.configService.dismissLoader();
              this.credentials = {
                  username: '',
                  password: '',
              };
              this.closeModal();
              this.productService.citySelected = '';
              this.events.publish('enableHeader');
          }, (err) => {
            if(err.status == 401){
              location.reload();
              this.credentials = {
                  username: '',
                  password: '',
              };
            }
            setTimeout(() => {
              this.configService.dismissLoader();
            }, 1000);
          });
      }, (err) => {
        this.configService.dismissLoader();
        this.configService.showToast(err, "toast-failed");
      });
    }else{
      this.configService.showToast('Debe ingresar el usuario y la contraseña', "toast-failed");
    }
  }

  loadUserInfo(){
    return new Promise((resolve, reject) => {
        //check if its app user SYNC Continuous
            this.userService.checkAuthentication().then((res: any) => {
                ////console.log("Loading User Info", res);
                // Update user info
                //console.log(res.person);
                //TODO print user
                resolve(res);
            }, (err) => {
                reject(err);
            });
    });
  }

  flagForguet(){
    this._flagForget = true;
  }

  enterKey(key){
    if(key == 13){
      this.logIn();
    }
  }

  closeModal(){
    this.view.dismiss();
  }

}
