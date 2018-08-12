import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, Events, Modal, ModalController } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { ConfigService } from "../providers/config-service";
import { UserService } from "../providers/user-service";
import { AlertController } from "ionic-angular";
import { InAppBrowser } from "@ionic-native/in-app-browser";

//pages
import { RegisterMedicPage } from "../pages/register-medic/register-medic";
import { Settings } from "../providers/settings";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;
  rootPage: any = "Home";
  pages: Array<{ title: string; component: any; icon: string; stage: boolean }>;
  showProfile = false;
  destop_menu: boolean = true;
  register = RegisterMedicPage;

  constructor(
    public platform: Platform,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public configService: ConfigService,
    public userService: UserService,
    private alertCtrl: AlertController,
    public events: Events,
    private inAppBrowser: InAppBrowser,
    private modal: ModalController,
    private settings: Settings
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation

    events.subscribe("goPage", page => {
      console.debug("envent goPage", page);
      this.openPage(page);
    });

    events.subscribe("enableHeader", () => {
      console.debug("envent enableHeader");
      this.destop_menu = true;
    });

    events.subscribe("disabledHandler", () => {
      console.debug("envent disabledHandler");
      this.destop_menu = false;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.settings.load();
      this.onResize();
      console.debug("PLATFORMS ", this.platform.platforms());

      // Load if  user logged
      this.loadUserInfo().then(
        result => {
          //
        },
        err => {
          //
        }
      );
    });
  }

  openPage(page) {
    page = this.pages[page];
    this.clearActive(page);
    this.nav.setRoot(page.component);
  }

  pushPage(page) {
    page = this.pages[page];
    this.clearActive(page);
    this.nav.push(page.component);
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

  login() {
    alert("change for view");
    // this.loginModal = this.modal.create('LoginModal');
    // this.loginModal.present();
  }

  logout() {
    this.userService.logout().then(
      result => {
        this.nav.setRoot(this.pages[0].component);
      },
      err => {
        console.debug("logout:error", err);
      }
    );
  }

  loadUserInfo(): Promise<any> {
    //check if its app user SYNC Continuous
    return this.userService
      .getStoredUser()
      .then((res: any) => {
        console.debug("loadUserInfo:res1", res);
        return this.userService.checkAuthentication();
      })
      .then((res2: any) => {
        console.debug("loadUserInfo:res2", res2);
      })
      .catch(err => {
        console.debug("loadUserInfo:error", err);
        this.settings.cleanUser().then(data => {
          console.debug("cleanUser", data);
        });
      });
  }

  onResize() {
    this.configService.checkScreen();
  }

  goToExternalUrl(url) {
    this.platform.ready().then(() => {
      this.inAppBrowser.create(url, "_blank");
    });
  }

  getPages() {
    return this.configService.pages.filter(item => {
      if (item.show === true) {
        return true;
      } else if (item.show === false) {
        return false;
      } else {
        return item.show();
      }
    });
  }
}
