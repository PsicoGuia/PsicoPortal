import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MedicService } from '../../providers/medic-service';
declare var google: any;

@IonicPage({
  segment: "profile-medic-detail/:id"
})
@Component({
  selector: 'page-profile-medic-detail',
  templateUrl: 'profile-medic-detail.html',
})
export class ProfileMedicDetailPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  profile: any;
  stduies = [];
  listCategories = [];
  attentionChannel = "Consultorio";
  filters = {};
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
      this.loadMap();
    })
  }

  loadMap() {

    var pos1LatLng = { lat: this.profile.position.coordinates[1], lng: this.profile.position.coordinates[0] };

    console.log("this.mapElement.nativeElement", this.mapElement.nativeElement);

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      center: pos1LatLng
    });
    var marker = new google.maps.Marker({
      position: pos1LatLng,
      map: this.map,
      title: 'pos1',
    });

    var info = '<div class="contact-info" style="font-family: Roboto, \"Helvetica Neue\", sans-serif;"><strong>Pos1</strong><br/>' +
      '<p>' + this.profile.city + ' </p>' +
      '</div>';

    var infoWindow = new google.maps.InfoWindow({
      content: info
    });

    marker.addListener('click', function () {
      infoWindow.open(this.map, marker);
    });
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
