import { Component, ViewChild, ElementRef, NgZone } from "@angular/core";
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
  profile: any = {};
  stduies = [];
  listProfiles = [];
  edit = "";
  editProfile: any;
  listCategories = [];
  attentionChannel = "Consultorio";
  selectedFile: File;
  selectedFileName;
  previewPicture;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public medicService: MedicService,
    public configService: ConfigService,
    public ngZone: NgZone
  ) {
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
    this.profile = {};
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
    delete this.selectedFile;
    delete this.selectedFileName;
  }

  takeActionSave(card) {
    console.log("ProfileMedicPage:takeActionSave:" + card);
    switch (card) {
      case "personal-info":
        this.updatePersonal();
        break;

      case "profile-info":
        this.updateProfile();
        break;

      case "location-info":
        this.updateLocation();
        break;

      case "profile-picture":
        this.updatePicture();
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
    return this.medicService
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
  }

  updateProfile() {
    let profile = this.getAttributeDifrent(this.profile, this.editProfile);
    delete profile.person;
    delete profile.profilepatologyorcategory_set;
    delete profile.position;
    delete profile.office_set;
    delete profile.homevisit_set;
    delete profile.chat_set;
    delete profile.studies_set;
    console.log("updateProfile:", profile);
    return this.medicService
      .updateProfile(this.profile.id, profile)
      .then(data => {
        this.configService.showToast("Información del perfil actualizada");
        return this.getProfile();
      })
      .catch(error => {
        this.configService.showToast(
          "Algo salio mal, vuelve a intentarlo",
          "toast-error"
        );
      });
  }

  updateLocation() {
    let profile = this.getAttributeDifrent(this.profile, this.editProfile);
    delete profile.person;
    delete profile.profilepatologyorcategory_set;
    delete profile.position; //FIXME
    delete profile.office_set;
    delete profile.homevisit_set;
    delete profile.chat_set;
    delete profile.studies_set;
    console.log("updateProfile:", profile);
    return this.medicService
      .updateProfile(this.profile.id, profile)
      .then(data => {
        this.configService.showToast("Información de la ubicación actualizada");
        return this.getProfile();
      })
      .catch(error => {
        this.configService.showToast(
          "Algo salio mal, vuelve a intentarlo",
          "toast-error"
        );
      });
  }

  onFileChanged(event) {
    this.ngZone.run(() => {
      this.selectedFile = event.target.files && event.target.files[0];
      console.log("onFileChanged", this.selectedFile);
      this.previewPicture;
      let reader = new FileReader();
      if (this.selectedFile) {
        this.selectedFileName = this.selectedFile.name;
        reader.onload = (e:any) => {
          this.previewPicture = e.target.result;
        };
        reader.readAsDataURL(this.selectedFile);
      } else {
        delete this.previewPicture;
      }
    });
  }

  updatePicture() {
    if (!this.selectedFile) return;
    let uploadData = new FormData();
    uploadData.append("picture", this.selectedFile, this.selectedFile.name);
    this.medicService
      .uploadProfile(this.profile.id, uploadData)
      .then(data => {
        this.configService.showToast("Información de la ubicación actualizada");
        return this.getProfile();
      })
      .catch(error => {
        console.log("updatePicture:error",error);
        
        this.configService.showToast(
          "Algo salio mal, vuelve a intentarlo",
          "toast-error"
        );
      });
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
