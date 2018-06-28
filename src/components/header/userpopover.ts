import { Component } from '@angular/core';
import { NavController, MenuController, ViewController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { UserService } from '../../providers/user-service';

@Component({
  templateUrl: 'userpopover.html'
})
export class UserPopoverPage {
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
  ) { }

  goToPerfil(): void {
    this.viewCtrl.dismiss('page');
  }

  logout() {
    this.viewCtrl.dismiss('logout');
  }
}
