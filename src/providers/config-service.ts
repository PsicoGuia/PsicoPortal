import { LoadingController, ToastController, AlertController, MenuController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { FormControl } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
declare var appGoogleAnalitics: any;

@Injectable()
export class ConfigService {

  loading: any;
  emailValidated: boolean;
  toast: any;
  toastPrev: any;

  constructor(
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, 
    public http: HttpClient, 
    public menuCtrl: MenuController,
  ) {
  }

  showLoader(msg: string) {
    if (!msg) msg = "Cargando...";
    this.loading = this.loadingCtrl.create({
      content: msg
    });
    this.loading.present();
  }


  dismissLoader() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }


  showToast(msg: string, style = "") {
    if (this.toast) {
      this.toastPrev = this.toast;
    }
    this.toast = this.toastCtrl.create({
      message: msg,
      duration: 15000,
      showCloseButton: true,
      closeButtonText: 'X',
      cssClass: style,
    });
    this.toast.present();
    if (this.toastPrev)
      this.toastPrev.dismiss();
  }


  nameValidator(control: FormControl): { [s: string]: boolean } {
    if (!control.value.match("^[a-zA-Z ,.']+$")) {
      return { invalidName: true };
    }
  }


  emailValidator(control: FormControl): { [s: string]: boolean } {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;
    if (!EMAIL_REGEXP.test(control.value)) {
      return { invalidEmail: true };
    }
  }


  checkScreen() {
    //console.log('WINDOW',window.screen)
    setTimeout(() => {
      if (window.screen.width < 768)
        this.menuCtrl.enable(true);
      else
        this.menuCtrl.enable(false);
    }, 100);
  }

  analyticsPage(url) {
    //console.log("ANALITICS GOOGLE ", url);
    appGoogleAnalitics.sedPageAnalitics(url);
  }


}
