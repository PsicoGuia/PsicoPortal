import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MedicService } from '../../providers/medic-service';

@IonicPage({
  segment: "profile-medic-detail/:id"
})
@Component({
  selector: 'page-profile-medic-detail',
  templateUrl: 'profile-medic-detail.html',
})
export class ProfileMedicDetailPage {
  filters = {};
  profile;
  idProfile;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public medicService: MedicService,
  ) {
    this.idProfile = this.navParams.get("id");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileMedicDetailPage', this.idProfile);
    this.medicService.getProfileDetail(this.idProfile).then(data => {
      this.profile = data;
    })
  }

  getGenero(genero) {
    switch (genero) {
      case 'F':
        return "Femenino"

      case 'M':
        return "Masculino"

      default:
        return 'No definido'
    }
  }


}
