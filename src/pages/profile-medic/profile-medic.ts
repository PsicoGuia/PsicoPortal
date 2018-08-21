import { Component, ViewChild, ElementRef, NgZone } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { MedicService } from "../../providers/medic-service";
import { ConfigService } from "../../providers/config-service";
import { GoogleService } from "../../providers/google-service";
import { AddAttentionChannelPage } from "../add-attention-channel/add-attention-channel";
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
  profileMarker;
  profile: any = {};
  stduies = [];
  listProfiles = [];
  edit = "";
  editProfile: any;
  editprofessionalCardFile;
  editpersonalDocumentFile;
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
    public ngZone: NgZone,
    public googleService: GoogleService
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
    if (!this.map) {
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 15,
        center: pos1LatLng
      });
    }
    if (!this.profileMarker) {
      this.profileMarker = new google.maps.Marker({
        position: pos1LatLng,
        map: this.map,
        title: "pos1"
      });
    } else {
      this.profileMarker.setPosition(pos1LatLng);
    }

    var info =
      '<div class="contact-info" style="font-family: Roboto, "Helvetica Neue", sans-serif;"><strong>Pos1</strong><br/>' +
      "<p>" +
      this.profile.city +
      " </p>" +
      "</div>";

    var infoWindow = new google.maps.InfoWindow({
      content: info
    });

    this.profileMarker.addListener("click", () => {
      infoWindow.open(this.map, this.profileMarker);
    });

    this.profileMarker.addListener("dragend", data => {
      this.onDragMarker(data);
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

  initInputGoogle() {
    let input = document
      .getElementById("address-profile")
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
          this.onPalceChanged(
            data,
            this.googleService.autocomplete.getPlace().formatted_address
          );
        });
    });
  }

  onPalceChanged(data, address) {
    this.ngZone.run(() => {
      console.log("onPalceChanged", data);
      this.editProfile.address_full = address;
      this.editProfile.position.coordinates[1] = data.lat;
      this.editProfile.position.coordinates[0] = data.lng;
      var pos1LatLng = {
        lat: data.lat,
        lng: data.lng
      };
      this.profileMarker.setPosition(pos1LatLng);
      this.map.panTo(pos1LatLng);
    });
  }

  onDragMarker(data) {
    this.ngZone.run(() => {
      console.log("onDragMarker", data);
      this.editProfile.position.coordinates[1] = data.latLng.lat();
      this.editProfile.position.coordinates[0] = data.latLng.lng();
    });
  }

  takeActionEdit(card) {
    console.log("ProfileMedicPage:takeActionEdit:" + card);
    this.edit = card;
    this.editProfile = JSON.parse(JSON.stringify(this.profile));
    if (card == "location-info") {
      setTimeout(() => {
        this.initInputGoogle();
      }, 300);
      this.profileMarker.setDraggable(true);
    }
  }

  takeActionCancel(card) {
    console.log("ProfileMedicPage:takeActionCancel:" + card);
    delete this.edit;
    delete this.editProfile;
    delete this.selectedFile;
    delete this.selectedFileName;
    this.profileMarker.setDraggable(false);
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
    // delete this.editProfile;
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
    console.log("updateProfile:", profile, this.editProfile);
    return this.medicService
      .updateProfile(this.profile.id, profile)
      .then(data => {
        console.log(this.editProfile);
        return this.uploadProfile();
      })
      .then(data => {
        this.configService.showToast("Información del perfil actualizada");
        return this.getProfile();
      })
      .catch(error => {
        console.log("updateProfile:error", error);
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
    let pos = (profile.position =
      "POINT(" +
      profile.position.coordinates[0] +
      " " +
      profile.position.coordinates[1] +
      ")");
    profile.position = pos;
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
      let reader = new FileReader();
      if (this.selectedFile) {
        this.selectedFileName = this.selectedFile.name;
        reader.onload = (e: any) => {
          this.previewPicture = e.target.result;
        };
        reader.readAsDataURL(this.selectedFile);
      } else {
        delete this.previewPicture;
      }
    });
  }

  filesChange(event, field) {
    this.editProfile[field] = event.target.files && event.target.files[0];
    console.log("onFileChanged", this.editProfile[field]);
    console.log(this.editpersonalDocumentFile, this.editprofessionalCardFile);
  }

  updatePicture() {
    if (!this.selectedFile) return;
    let uploadData = new FormData();
    uploadData.append("picture", this.selectedFile, this.selectedFile.name);
    this.medicService
      .uploadProfile(this.profile.id, uploadData)
      .then(data => {
        this.configService.showToast("Información de la ubicación actualizada");
        delete this.selectedFile;
        delete this.selectedFileName;
        return this.getProfile();
      })
      .catch(error => {
        console.log("updatePicture:error", error);
        this.configService.showToast(
          "Algo salio mal, vuelve a intentarlo",
          "toast-error"
        );
      });
  }

  uploadProfile() {
    console.log(
      "uploadProfile",
      this.editProfile.editprofessionalCardFile,
      this.editProfile.editpersonalDocumentFile
    );
    if (
      this.editProfile.editprofessionalCardFile ||
      this.editProfile.editpersonalDocumentFile
    ) {
      let uploadData = new FormData();
      if (this.editProfile.editprofessionalCardFile)
        uploadData.append(
          "professionalCardFile",
          this.editProfile.editprofessionalCardFile,
          this.editProfile.editprofessionalCardFile.name
        );
      if (this.editProfile.editprofessionalCardFile)
        uploadData.append(
          "personalDocumentFile",
          this.editProfile.editpersonalDocumentFile,
          this.editProfile.editpersonalDocumentFile.name
        );
      return this.medicService
        .uploadProfile(this.profile.id, uploadData)
        .then(data => {
          console.log("uploadProfile");
          delete this.editProfile.editprofessionalCardFile;
          delete this.editProfile.editpersonalDocumentFile;
        });
    }
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
    this.navCtrl.push(AddAttentionChannelPage, {
      type: this.attentionChannel,
      id: true,
      profileId: this.profile.id
    });
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
