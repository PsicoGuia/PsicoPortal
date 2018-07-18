import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MedicService } from '../../providers/medic-service';
declare var google: any;
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'profile-medic'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile-medic.html',
})
export class ProfileMedicPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  profile: any;
  stduies = [];
  listProfiles = [];
  attentionChannel = "Consultorio";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private medicService: MedicService,
  ) {
    [{ "id": 10, "person": { "id": 11, "user": { "username": "juansed", "email": "juansed@inkrementaldev.co", "first_name": "Juan Se Bestia", "last_name": "Dussan Cubides", "groups": [{ "id": 1, "name": "MEDICS" }] }, "phone": "3002799407", "term": 1.0, "term_abausdata": 1.0, "notification": true }, "picture": "http://localhost:8000/static/files/medic/files/profiles/10/748627_man_512x512_eFB7uP0.png", "genre": "U", "personalDocumentType": "CC", "personalDocumentNumber": 1022993547, "personalDocumentFile": "http://localhost:8000/static/files/medic/files/profiles/10/Master_Test_Plan.jpg", "professionalCardNumber": "223366558847899", "professionalCardFile": "http://localhost:8000/static/files/medic/files/profiles/10/carId.png", "city": "Boghota", "position": { "coordinates": [-74.87663952056624, 7.53288518033106], "type": "Point" }, "cost_currency": "COP", "cost": "60000.00", "created": "2018-06-12T15:51:31.260323Z", "updated": "2018-06-12T15:58:45.978484Z", "address": 2 }]
    // Dommy profile
    this.profile = {
      "id": 10,
      "person": {
        "id": 11,
        "user": {
          "username": "juansed",
          "email": "juansed@inkrementaldev.co",
          "first_name": "Juan Se Bestia",
          "last_name": "Dussan Cubides",
          "groups": [
            {
              "id": 1,
              "name": "MEDICS"
            }
          ]
        },
        "phone": "3002799407",
        "term": 1,
        "term_abausdata": 1,
        "notification": true
      },
      "picture": "http://casitaoaxaca.com/koken/storage/cache/images/000/029/oxc-fb-profile-img-h1,medium_large.1501091503.png",
      "genre": "U",
      "personalDocumentType": "CC",
      "personalDocumentNumber": 1022993547,
      "personalDocumentFile": "http://localhost:8000/static/files/medic/files/profiles/10/Master_Test_Plan.jpg",
      "professionalCardNumber": "223366558847899",
      "professionalCardFile": "http://localhost:8000/static/files/medic/files/profiles/10/carId.png",
      "city": "Boghota",
      "position": {
        "coordinates": [
          -74.87663952056624,
          7.53288518033106
        ],
        "type": "Point"
      },
      "cost_currency": "COP",
      "cost": "60000.00",
      "created": "2018-06-12T15:51:31.260323Z",
      "updated": "2018-06-12T15:58:45.978484Z",
      "address": {
        "id": 2,
        "street_number": "",
        "route": "",
        "raw": "1",
        "formatted": "Bogotá, Colombia",
        "latitude": 4.7109886,
        "longitude": -74.072092,
        "locality": 2
      }
    }

    // {
    //   professionalCardNumber: 34567656,
    //   picture: "http://casitaoaxaca.com/koken/storage/cache/images/000/029/oxc-fb-profile-img-h1,medium_large.1501091503.png",
    //   user: { first_name: "primer nombre", last_name: "Apellidos" },
    //   location: "Cll false 234",
    //   url: "url('" + "http://casitaoaxaca.com/koken/storage/cache/images/000/029/oxc-fb-profile-img-h1,medium_large.1501091503.png" + "')"
    // }
    this.stduies = [
      { title: "studio 1" },
      { title: "studio 2" },
      { title: "studio 3" },
      { title: "studio 4" },

    ]
  }

  ionViewDidLoad() {
    console.debug('ionViewDidLoad getProfiles');
    this.medicService.getProfiles().then(data => {
      console.debug('ionViewDidLoad getProfiles2', data);
      this.listProfiles = data;
      if (this.listProfiles.length) {
        this.profile = this.listProfiles[0];
        this.loadMap();
      }
    })
  }

  loadMap() {

    var pos1LatLng = { lat: this.profile.position.coordinates[1], lng: this.profile.position.coordinates[0] };
    var pos2LatLng = { lat: this.profile.address.latitude, lng: this.profile.address.longitude };

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      center: pos1LatLng
    });
    var marker = new google.maps.Marker({
      position: pos1LatLng,
      map: this.map,
      title: 'pos1',
    });

    var marker2 = new google.maps.Marker({
      position: pos2LatLng,
      map: this.map,
      title: 'pos2',
      icon: this.pinSymbol("blue")
    });

    var info = '<div class="contact-info" style="font-family: Roboto, \"Helvetica Neue\", sans-serif;"><strong>Pos1</strong><br/>' +
      '<p>' + this.profile.city + ' </p>' +
      '</div>';

    var infoWindow = new google.maps.InfoWindow({
      content: info
    });
    marker2.addListener('click', function () {
      infoWindow.open(this.map, marker2);
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

  takeAction(card) {
    alert('edit' + card)
  }

  pinSymbol(color) {
    return {
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#000',
      strokeWeight: 2,
      scale: 1,
    };
  }

  clickAttentionChannel(item) {
    console.debug("clickAttentionChannel()",item);
  }

  clickNewAttentionChannel(){
    console.debug("clickNewAttentionChannel()");
  }

  clickStudie(item){
    console.debug("clickNewAttentionChannel()",item);
  }

  clickNewStudie(){
    console.debug("clickNewAttentionChannel()");
  }

}
