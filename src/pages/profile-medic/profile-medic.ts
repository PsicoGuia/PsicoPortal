import { Component, ViewChild, ElementRef } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { MedicService } from "../../providers/medic-service";
import { ConfigService } from "../../providers/config-service";
declare var google: any;
declare var semanticPisco: any;
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: "profile-medic"
})
@Component({
  selector: "page-profile",
  templateUrl: "profile-medic.html"
})
export class ProfileMedicPage {
  @ViewChild("map")
  mapElement: ElementRef;
  map: any;
  profile: any;
  stduies = [];
  listProfiles = [];
  edit = "";
  editProfile: any;
  listCategories = [];
  attentionChannel = "Consultorio";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public medicService: MedicService,
    public configService: ConfigService
  ) {
    // Dommy profile
    this.profile = {
      id: 10,
      person: {
        id: 11,
        user: {
          username: "juansed",
          email: "juansed@inkrementaldev.co",
          first_name: "Juan Se Bestia",
          last_name: "Dussan Cubides",
          groups: [
            {
              id: 1,
              name: "MEDICS"
            }
          ]
        },
        phone: "3002799407",
        term: 1.0,
        term_abausdata: 1.0,
        notification: true
      },
      address: {
        id: 2,
        street_number: "",
        route: "",
        raw: "1",
        formatted: "Bogotá, Colombia",
        latitude: 4.7109886,
        longitude: -74.072092,
        locality: 2
      },
      studies_set: [
        {
          id: 2,
          level: "SP",
          title: "Artes culinarias",
          date: "2018-06-22",
          experienceYears: 5,
          file:
            "http://localhost:8000/static/files/medic/files/11/CDC_UP_Test_Plan_Template_KJesN77.doc",
          certificated: true,
          created: "2018-06-22T01:35:02.006869Z",
          updated: "2018-06-22T01:35:02.006889Z",
          profile: 10
        },
        {
          id: 1,
          level: "BH",
          title: "Ingeniero de sistemas",
          date: "2018-06-22",
          experienceYears: 3,
          file:
            "http://localhost:8000/static/files/medic/files/11/CDC_UP_Test_Plan_Template.doc",
          certificated: true,
          created: "2018-06-22T01:34:31.818460Z",
          updated: "2018-06-22T01:34:31.818503Z",
          profile: 10
        }
      ],
      homevisit_set: [
        {
          id: 1,
          images: [
            {
              id: 1,
              image:
                "http://localhost:8000/static/files/medic/files/profiles/None/Screenshot_from_2018-06-22_13-32-28.png",
              created: "2018-07-17T16:41:09.318566Z",
              updated: "2018-07-17T16:41:09.318589Z"
            }
          ],
          schedules: [
            {
              id: 1,
              bitDays: 255,
              start_date: "2018-07-17T16:39:57Z",
              end_date: "2018-07-17T16:39:58Z"
            }
          ],
          description:
            "Servicio a Domicilio sin costo adicional directo a tu casa",
          position: {
            type: "Point",
            coordinates: [-73.91695390617271, 6.21864885444995]
          },
          address: null,
          city: null,
          created: "2018-07-17T16:41:31.342717Z",
          updated: "2018-07-17T16:41:58.823147Z",
          profile: 10
        }
      ],
      office_set: [
        {
          id: 1,
          images: [
            {
              id: 1,
              image:
                "http://localhost:8000/static/files/medic/files/profiles/None/Screenshot_from_2018-06-22_13-32-28.png",
              created: "2018-07-17T16:41:09.318566Z",
              updated: "2018-07-17T16:41:09.318589Z"
            }
          ],
          schedules: [
            {
              id: 1,
              bitDays: 255,
              start_date: "2018-07-17T16:39:57Z",
              end_date: "2018-07-17T16:39:58Z"
            }
          ],
          description: "Mi primer consultorio",
          position: {
            type: "Point",
            coordinates: [-70.65512645665261, 5.177032024193362]
          },
          address: "Calle falsa 123",
          city: "Bogotá",
          created: "2018-07-17T16:47:31.689695Z",
          updated: "2018-07-18T15:34:53.251533Z",
          profile: 10
        },
        {
          id: 2,
          images: [
            {
              id: 1,
              image:
                "http://localhost:8000/static/files/medic/files/profiles/None/Screenshot_from_2018-06-22_13-32-28.png",
              created: "2018-07-17T16:41:09.318566Z",
              updated: "2018-07-17T16:41:09.318589Z"
            }
          ],
          schedules: [
            {
              id: 2,
              bitDays: 127,
              start_date: "2018-07-17T16:47:11Z",
              end_date: "2018-07-17T16:47:12Z"
            }
          ],
          description: "Consultorio sano",
          position: {
            type: "Point",
            coordinates: [-73.9427156350591, 6.574822234192897]
          },
          address: "Direccion 2",
          city: "Cali",
          created: "2018-07-18T15:36:00.147450Z",
          updated: "2018-07-18T15:36:00.147470Z",
          profile: 10
        }
      ],
      chat_set: [
        {
          id: 2,
          images: [
            {
              id: 1,
              image:
                "http://localhost:8000/static/files/medic/files/profiles/None/Screenshot_from_2018-06-22_13-32-28.png",
              created: "2018-07-17T16:41:09.318566Z",
              updated: "2018-07-17T16:41:09.318589Z"
            },
            {
              id: 2,
              image:
                "http://localhost:8000/static/files/medic/files/profiles/None/Screenshot_from_2018-02-26_10-06-53.png",
              created: "2018-07-17T16:47:29.965353Z",
              updated: "2018-07-17T16:47:29.965377Z"
            }
          ],
          schedules: [
            {
              id: 1,
              bitDays: 255,
              start_date: "2018-07-17T16:39:57Z",
              end_date: "2018-07-17T16:39:58Z"
            }
          ],
          description: "Chat en vivo",
          position: null,
          address: "",
          city: "",
          created: "2018-07-17T17:18:21.486449Z",
          updated: "2018-07-17T17:18:21.486480Z",
          profile: 10
        }
      ],
      profilepatologyorcategory_set: [],
      picture:
        "http://casitaoaxaca.com/koken/storage/cache/images/000/029/oxc-fb-profile-img-h1,medium_large.1501091503.png",
      genre: "U",
      personalDocumentType: "CC",
      personalDocumentNumber: 1022993547,
      personalDocumentFile:
        "http://localhost:8000/static/files/medic/files/profiles/10/Master_Test_Plan.jpg",
      professionalCardNumber: "223366558847899",
      professionalCardFile:
        "http://localhost:8000/static/files/medic/files/profiles/10/carId.png",
      city: "Boghota",
      position: {
        type: "Point",
        coordinates: [-74.87663952056624, 7.53288518033106]
      },
      cost_currency: "COP",
      cost: "60000.00",
      created: "2018-06-12T15:51:31.260323Z",
      updated: "2018-06-12T15:58:45.978484Z"
    };

    // {
    //   professionalCardNumber: 34567656,
    //   picture: "http://casitaoaxaca.com/koken/storage/cache/images/000/029/oxc-fb-profile-img-h1,medium_large.1501091503.png",
    //   user: { first_name: "primer nombre", last_name: "Apellidos" },
    //   location: "Cll false 234",
    //   url: "url('" + "http://casitaoaxaca.com/koken/storage/cache/images/000/029/oxc-fb-profile-img-h1,medium_large.1501091503.png" + "')"
    // }
    this.stduies = [];
  }

  ionViewDidLoad() {
    console.debug("ionViewDidLoad getProfiles");
    this.medicService.getPatologies().then(data => {
      this.listCategories = data;
    });
    this.getProfile().then();
    // Init DropDown UISemantic
    semanticPisco.dropdown(".ui.dropdown");
  }

  getProfile() {
    this.profile ={}
    return this.medicService.getMyProfiles().then(data => {
      console.debug("ionViewDidLoad getProfiles2", data);
      this.listProfiles = data;
      if (this.listProfiles.length) {
        this.profile = this.listProfiles[0];
        this.loadMap();
      }
    });
  }
  loadMap() {
    var pos1LatLng = {
      lat: this.profile.position.coordinates[1],
      lng: this.profile.position.coordinates[0]
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      center: pos1LatLng
    });
    var marker = new google.maps.Marker({
      position: pos1LatLng,
      map: this.map,
      title: "pos1"
    });

    var info =
      '<div class="contact-info" style="font-family: Roboto, "Helvetica Neue", sans-serif;"><strong>Pos1</strong><br/>' +
      "<p>" +
      this.profile.city +
      " </p>" +
      "</div>";

    var infoWindow = new google.maps.InfoWindow({
      content: info
    });

    marker.addListener("click", function() {
      infoWindow.open(this.map, marker);
    });
  }

  getGenero(genero) {
    switch (genero) {
      case "F":
        return "Femenino";

      case "M":
        return "Masculino";

      default:
        return "No definido";
    }
  }

  takeActionEdit(card) {
    console.log("ProfileMedicPage:takeActionEdit:" + card);
    this.edit = card;
    this.editProfile = JSON.parse(JSON.stringify(this.profile));
  }

  takeActionCancel(card) {
    console.log("ProfileMedicPage:takeActionCancel:" + card);
    delete this.edit;
    delete this.editProfile;
  }

  takeActionSave(card) {
    console.log("ProfileMedicPage:takeActionSave:" + card);
    switch (card) {
      case "personal-info":
        this.updatePersonal();
        break;

      default:
        break;
    }
    delete this.edit;
    delete this.editProfile;
  }

  updatePersonal() {
    let user = this.getAttributeDifrent(
      this.profile.person.user,
      this.editProfile.person.user
    );
    delete user.groups;

    let person = this.getAttributeDifrent(
      this.profile.person,
      this.editProfile.person
    );
    delete person.user;
    debugger;
    this.medicService
      .updateUser(this.profile.person.user.id, user)
      .then(data => {
        return this.medicService.updatePerson(this.profile.person.id, person);
      })
      .then(data => {
        this.configService.showToast("Información personal actualizada");
        return this.getProfile();
      })
      .catch(error => {
        this.configService.showToast(
          "Algo salio mal, vuelve a intentarlo",
          "toast-error"
        );
      });

    console.log("updatePersonal", person, user);
  }

  getAttributeDifrent(original, edit) {
    let obj: any = {};
    for (const iterator in edit) {
      if (edit[iterator] != original[iterator]) {
        // console.log("getAttributeDifrent:notEqueals", iterator, edit[iterator], original[iterator]);
        obj[iterator] = edit[iterator];
      }
    }
    return obj;
  }

  pinSymbol(color) {
    return {
      fillColor: color,
      fillOpacity: 1,
      strokeColor: "#000",
      strokeWeight: 2,
      scale: 1
    };
  }

  clickAttentionChannel(item) {
    console.debug("clickAttentionChannel()", item);
  }

  clickNewAttentionChannel() {
    console.debug("clickNewAttentionChannel()");
  }

  clickStudie(item) {
    console.debug("clickNewAttentionChannel()", item);
  }

  clickNewStudie() {
    console.debug("clickNewAttentionChannel()");
  }

  patologiInProfile(item) {
    return false;
  }
}
