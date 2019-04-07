import {
  LoadingController,
  ToastController,
  AlertController,
  MenuController,
  NavController,
  App
} from "ionic-angular";
import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Settings } from "./settings";

declare var appGoogleAnalitics: any;
export let URL_API = "https://api.psicoguia.co/api/1.0/";

@Injectable()
export class ConfigService {
  loading: any;
  emailValidated: boolean;
  toast: any;
  toastPrev: any;
  public OFFSET = 50;
  public DEFAULT_LAT =  4.652;
  public DEFAULT_LNG = -74.103;
  public debug = true;

  constructor(
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public http: HttpClient,
    public menuCtrl: MenuController,
    public settings: Settings,
    public app: App
  ) {}

  public pages = [
    {
      title: "INICIO",
      show: true,
      component: "Home",
      icon: "ios-home",
      stage: false,
      segment: "/"
    },
    {
      title: "BUSCAR",
      show: true,
      component: "SearchPage",
      icon: "search",
      stage: false,
      segment: "#/search"
    },
    {
      title: "REGISTRARSE",
      show: () => {
        return this.isNotAutenticated();
      },
      component: "RegisterMedicPage",
      icon: "ios-home",
      stage: false,
      segment: "/register-medic"
    },
    {
      title: "INICIAR SESIÓN",
      show: () => {
        return this.isNotAutenticated();
      },
      component: "LoginMedicPage",
      icon: "ios-home",
      stage: false,
      segment: "/"
    },
    {
      title: "PERFIL",
      show: () => {
        return this.isAutenticated();
      },
      component: "",
      icon: "ios-home",
      stage: false,
      segment: "/"
    },

    // {
    //   title: "CONTÁCTANOS",
    //   show: true,
    //   component: "Contact",
    //   icon: "ios-call",
    //   stage: false,
    //   segment: "/"
    // },
    {
      title: "AYUDA",
      show: true,
      component: "FaqPqrPage",
      icon: "information-circle",
      stage: false,
      segment: "#/help"
    },
    {
      title: "PQR",
      show: false,
      component: "PqrPage",
      icon: "information-circle",
      stage: false,
      segment: "#/help"
    }
  ];

  getPage(componentName) {
    return this.pages.find(item => {
      return item.component == componentName;
    });
  }

  openPage(page) {
    this.clearActive(page);
    this.app.getActiveNav().setRoot(page.component);
  }

  pushPage(page) {
    this.clearActive(page);
    this.app.getActiveNav().push(page.component);
  }

  clearActive(page) {
    for (let pg of this.pages) {
      if (page) {
        if (pg.title == page.title) {
          pg.stage = true;
        } else {
          pg.stage = false;
        }
      } else {
        pg.stage = false;
      }
    }
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

  showToast(msg: string, style = "toast-success") {
    if (this.toast) {
      this.toastPrev = this.toast;
    }
    this.toast = this.toastCtrl.create({
      message: msg,
      duration: 15000,
      showCloseButton: true,
      closeButtonText: "X",
      cssClass: style
    });
    this.toast.present();
    if (this.toastPrev) this.toastPrev.dismiss();
  }

  nameValidator(control: FormControl): { [s: string]: boolean } {
    //if (!control.value.match("^[a-zA-Z ,.']+$")) {
    if (1 != 1) {
      // force truncate FIXME
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
    //console.debug('WINDOW',window.screen)
    setTimeout(() => {
      if (window.screen.width < 768) this.menuCtrl.enable(true);
      else this.menuCtrl.enable(false);
    }, 100);
  }

  analyticsPage(url) {
    //console.debug("ANALITICS GOOGLE ", url);
    appGoogleAnalitics.sedPageAnalitics(url);
  }

  // MAP Tools
  pinSymbol(color) {
    return {
      fillColor: color,
      fillOpacity: 1,
      strokeColor: "#000",
      strokeWeight: 2,
      scale: 1
    };
  }

  isAutenticated() {
    return !!(
      this.settings &&
      this.settings.settings &&
      this.settings.settings.user &&
      this.settings.settings.user.user
    );
  }

  isNotAutenticated() {
    return !(
      this.settings &&
      this.settings.settings &&
      this.settings.settings.user &&
      this.settings.settings.user.user
    );
  }
}
