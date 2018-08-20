import { Component, ViewChild, ElementRef } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { MedicService } from "../../providers/medic-service";
import { ConfigService } from "../../providers/config-service";
import { ProfileMedicDetailPage } from "../profile-medic-detail/profile-medic-detail";
import { GoogleService } from "../../providers/google-service";
declare var google: any;

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: "search"
})
@Component({
  selector: "page-search",
  templateUrl: "search.html"
})
export class SearchPage {
  @ViewChild("map")
  mapElement: ElementRef;
  map: any;
  private listPatologies = [];
  patologiesSelected = [];
  filters: any = { offset: 0, page: 1 };
  address;
  listProfiles = [];
  listMarkers = [];
  myLocationMarker;
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
    {
      type: "office",
      title: "office14",
      lat: 4.6388723,
      long: -74.178765768202
    },
    { type: "office", title: "office15", lat: 4.6318723, long: -74.2554768202 },
    {
      type: "office",
      title: "office16",
      lat: 4.6308723,
      long: -74.04312368202
    },
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
    { type: "atHome", title: "home", lat: 4.61813798723, long: -74.01768202 }
  ];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private medicService: MedicService,
    private configService: ConfigService,
    private googleService: GoogleService
  ) {
    this.filters.limit = configService.OFFSET;
  }

  ionViewDidLoad() {
    console.debug("ionViewDidLoad SearchPage");
    this.medicService.getPatologies().then(data => {
      this.listPatologies = data;
    });
    this.initInputGoogle();
    this.loadMap();
    this.loadProfiles().then(list => {
      return this.loadListMarkerInMap(list);
    });
  }

  loadMap() {
    var pos1LatLng = {
      lat: this.configService.DEFAULT_LAT,
      lng: this.configService.DEFAULT_LNG
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      center: pos1LatLng
    });
  }

  loadListMarkerInMap(list) {
    list.forEach(element => {
      let posLatLng = {
        lat: element.position.coordinates[1],
        lng: element.position.coordinates[0]
      };
      let marker = new google.maps.Marker({
        position: posLatLng,
        map: this.map,
        title: element.profile_title
      });
      let info =
        '<div class="contact-info" style="font-family: Roboto, "Helvetica Neue", sans-serif;"><strong>Perfil:</strong><br/>' +
        '<a href="#/profile-medic-detail/' +
        element.id +
        '">' +
        element.profile_title +
        "</a>" +
        "</div>";
      let infoWindow = new google.maps.InfoWindow({
        content: info
      });
      marker.addListener("click", function() {
        infoWindow.open(this.map, marker);
      });
      this.listMarkers.push(marker);
    });
  }

  clearAllMarkers() {
    while (this.listMarkers.length) {
      this.listMarkers.pop().setMap(null);
    }
  }

  setMyLocationMarker(lat, long) {
    let icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    let posLatLng = { lat: lat, lng: long };
    if (!this.myLocationMarker) {
      this.myLocationMarker = new google.maps.Marker({
        position: posLatLng,
        map: this.map,
        title: "Tú ubicación",
        animation: google.maps.Animation.DROP,
        draggable: true,
        icon: icon
      });
    } else {
      this.myLocationMarker.setPosition(posLatLng);
    }
    this.map.panTo(posLatLng);
  }

  initInputGoogle() {
    let input = document
      .getElementById("address-ac")
      .getElementsByTagName("input")[0];
    let options = this.googleService.options;
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    this.googleService.autocomplete = new google.maps.places.Autocomplete(
      input,
      options
    );

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    this.googleService.autocomplete.addListener("place_changed", data => {
      // double LookUp fix problem
      this.googleService
        .searchAddress(
          this.googleService.autocomplete.getPlace().formatted_address
        )
        .then(data => {
          console.log("searchAddress", data);
          this.onPalceChanged(data);
        });
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
    }
  }

  clickCardProfile(profile) {
    console.log("clickCardProfile");
    this.navCtrl.setRoot(ProfileMedicDetailPage, { id: profile.id });
  }

  loadProfiles() {
    return this.medicService.getProfiles(this.filters).then(data => {
      this.listProfiles = this.listProfiles.concat(data.results);
      return data.results;
    });
  }

  getMoreProfiles() {
    this.filters.offset += this.configService.OFFSET;
    this.filters.page++;
    return this.loadProfiles().then(list => {
      return this.loadListMarkerInMap(list);
    });
  }

  onPalceChanged(data) {
    console.log("onPalceChanged", data);
    this.setMyLocationMarker(data.lat, data.lng);
    this.filters.lat = data.lat;
    this.filters.lng = data.lng;
    this.onChangeFilters().then();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        data => {
          console.log("getLocation:data", data);
          this.setMyLocationMarker(data.coords.latitude, data.coords.longitude);
          this.filters.lat = data.coords.latitude;
          this.filters.lng = data.coords.longitude;
          this.onChangeFilters().then();
        },
        data => {
          console.log("getLocation:error", data);
        },
        {
          maximumAge: 75000,
          timeout: 15000
        }
      );
    } else {
      alert("GPS_NOT_SUPPORTED");
    }
  }

  onSelectPatolgyChange(event) {
    console.log(this.patologiesSelected);
    this.filters.patology__in = this.patologiesSelected.toString();
    this.onChangeFilters().then();
  }

  onChangeFilters() {
    this.listProfiles = [];
    this.filters.offset = 0;
    this.filters.page = 1;
    this.clearAllMarkers();
    debugger;
    return this.loadProfiles().then(list => {
      return this.loadListMarkerInMap(list);
    });
  }
}
