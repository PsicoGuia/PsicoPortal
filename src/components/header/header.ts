import { Component, EventEmitter, Output } from '@angular/core';
import { NavController, MenuController, ModalController, PopoverController, Events } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { Settings } from '../../providers/settings';
import { ConfigService } from '../../providers/config-service';
import { UserPopoverPage } from './userpopover';

@Component({
  selector: 'header-psicoguia',
  templateUrl: 'header.html'
})
export class HeaderComponent {

  @Output() onCityChange = new EventEmitter();

  showSearch: boolean = false;
  constructor(public navCtrl: NavController,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public authProvider: UserService,
    public events: Events,
    public settings: Settings,
    public config: ConfigService,

  ) {


  }

  goToHome() {
    this.navCtrl.setRoot('HomePage');
  }

  getPage(componentName) {
    return this.config.pages.find(item => { return item.component == componentName })
  }

  openPage(page) {
    this.clearActive(page);
    this.navCtrl.setRoot(page.component);
  }

  pushPage(page) {
    this.clearActive(page);
    this.navCtrl.push(page.component);
  }

  clearActive(page) {
    for (let pg of this.config.pages) {
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

  statusSearch(): void {
    this.showSearch = !this.showSearch;
  }

  goToCart(): void {
    if (this.navCtrl.getActive().name != "CartPage") {
      this.navCtrl.push('CartPage');
    }
  }

  userMenu(myEvent) {
    let popover = this.popoverCtrl.create(UserPopoverPage);
    popover.onDidDismiss(result => {
      switch (result) {
        case 'page':
          this.navCtrl.setRoot('ProfileMedicPage');
          break;
        case 'logout':
          this.authProvider.logout();
          break;
        default:
          break;
      }
    });
    popover.present({
      ev: myEvent
    });
  }
}
