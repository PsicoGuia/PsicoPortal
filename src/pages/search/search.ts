import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MedicService } from '../../providers/medic-service';
import { ConfigService } from '../../providers/config-service';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'search'
})
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  private listCategories = [];
  private dummyLocations = [
    { type: "profile", title: "perfil1", lat: 4.6394723, long: -74.0738202 },
    { type: "profile", title: "perfil2", lat: 4.6393723, long: -74.0718202 },
    { type: "profile", title: "perfil3", lat: 4.6392723, long: -74.0745848202 },
    { type: "profile", title: "perfil4", lat: 4.6397723, long: -74.0756558202 },
    { type: "profile", title: "perfil5", lat: 4.6394723, long: -74.07688202 },
    { type: "profile", title: "perfil6", lat: 4.6392723, long: -74.054728202 },
    { type: "profile", title: "perfil", lat: 4.6338723, long: -74.0567761202 },
    { type: "profile", title: "perfil", lat: 4.6328723, long: -74.0547767202 },
    { type: "office", title: "office1", lat: 4.6358723, long: -74.0760202 },
    { type: "office", title: "office12", lat: 4.6368723, long: -74.0374738202 },
    { type: "office", title: "office13", lat: 4.6378723, long: -74.0778202 },
    { type: "office", title: "office14", lat: 4.6388723, long: -74.178765768202 },
    { type: "office", title: "office15", lat: 4.6318723, long: -74.2554768202 },
    { type: "office", title: "office16", lat: 4.6308723, long: -74.04312368202 },
    { type: "office", title: "office18", lat: 4.6398723, long: -74.057768202 },
    { type: "office", title: "office17", lat: 4.6338723, long: -74.063468202 },
    { type: "office", title: "office19", lat: 4.6378723, long: -74.023168202 },
    { type: "chat", title: "chat1", lat: 4.63452398723, long: -74.266768202 },
    { type: "chat", title: "chat1", lat: 4.6883398723, long: -74.0768202 },
    { type: "chat", title: "chat1", lat: 4.636398723, long: -74.0948768202 },
    { type: "chat", title: "chat1", lat: 4.663798723, long: -74.073668202 },
    { type: "chat", title: "chat1", lat: 4.6813698723, long: -74.079768202 },
    { type: "chat", title: "chat1", lat: 4.628398723, long: -74.0123768202 },
    { type: "chat", title: "chat1", lat: 4.622398723, long: -74.081768202 },
    { type: "chat", title: "chat1", lat: 4.635978723, long: -74.0768202 },
    { type: "chat", title: "chat1", lat: 4.673198723, long: -74.7440768202 },
    { type: "chat", title: "chat1", lat: 4.629398723, long: -74.05768202 },
    { type: "chat", title: "chat1", lat: 4.693798723, long: -74.06768202 },
    { type: "chat", title: "chat1", lat: 4.68398723, long: -74.07468202 },
    { type: "chat", title: "chat1", lat: 4.683198723, long: -74.03768202 },
    { type: "atHome", title: "home", lat: 4.6388398723, long: -74.0457768202 },
    { type: "atHome", title: "home", lat: 4.637898723, long: -74.052768202 },
    { type: "atHome", title: "home", lat: 4.638988723, long: -74.07123768202 },
    { type: "atHome", title: "home", lat: 4.637958723, long: -74.0777768202 },
    { type: "atHome", title: "home", lat: 4.637198723, long: -74.07668202 },
    { type: "atHome", title: "home", lat: 4.638298723, long: -74.01768202 },
    { type: "atHome", title: "home", lat: 4.639938723, long: -74.02768202 },
    { type: "atHome", title: "home", lat: 4.630978723, long: -74.03768202 },
    { type: "atHome", title: "home", lat: 4.632398723, long: -74.04768202 },
    { type: "atHome", title: "home", lat: 4.631998723, long: -74.02768202 },
    { type: "atHome", title: "home", lat: 4.61813798723, long: -74.01768202 },


  ];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private medicService: MedicService,
    private condigService: ConfigService,

  ) {
  }

  ionViewDidLoad() {
    console.debug('ionViewDidLoad SearchPage');
    this.medicService.getPatologies().then(data => { this.listCategories = data })
    this.loadMap();

  }

  loadMap() {

    var pos1LatLng = { lat: this.dummyLocations[0].lat, lng: this.dummyLocations[0].long };
    var pos2LatLng = { lat: this.dummyLocations[1].lat, lng: this.dummyLocations[1].long };

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
      icon: this.condigService.pinSymbol("blue")
    });

    var info = '<div class="contact-info" style="font-family: Roboto, \"Helvetica Neue\", sans-serif;"><strong>Pos1</strong><br/>' +
      '<p>INFO DE PRUEBA </p>' +
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

  getColorOfPOI(item) {
    switch (item.type) {
      case "profile":
        return "green";
      case "chat":
        return "blue";
      case "office":
        return "cian";
      case "atHome":
        return "yellow";
      default:
        return "red";
        break;
    }

  }

}
