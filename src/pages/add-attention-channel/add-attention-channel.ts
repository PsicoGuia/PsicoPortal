import { Component, ViewChild, ElementRef, NgZone } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConfigService } from "../../providers/config-service";
import { GoogleService } from "../../providers/google-service";
import { MedicService } from "../../providers/medic-service";
declare var google: any;

@IonicPage({ segment: "add-attention-channel/:type/:id/" })
@Component({
  selector: "page-add-attention-channel",
  templateUrl: "add-attention-channel.html"
})
export class AddAttentionChannelPage {
  @ViewChild("map")
  mapElement: ElementRef;
  map: any;
  attentionChannelMarker;
  isNew = false;
  idAttentionChannel;
  typeAttentionChannel;
  profileId;
  images = [];
  shueldes = [];
  objAttentionChannel: any = {};
  newForm: FormGroup = this.formBuilder.group({
    title: ["", [Validators.required]],
    description: ["", [Validators.required]],
    address: ["", [Validators.required]],
    city: ["", [Validators.required]],
    addressGoogle: [""],
    type: [""]
  });

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public configService: ConfigService,
    public googleService: GoogleService,
    public medicService: MedicService,
    public ngZone: NgZone
  ) {
    if (this.navParams.get("id") === true) this.isNew = true;
    else if (this.navParams.get("id"))
      this.idAttentionChannel = this.navParams.get("id");
    this.typeAttentionChannel = this.navParams.get("type");
    this.profileId = this.navParams.get("profileId");
    this.newForm.value.type = this.typeAttentionChannel;
  }

  ionViewDidLoad() {
    console.log(
      "ionViewDidLoad AddAttentionChannelPage",
      this.isNew,
      this.idAttentionChannel,
      this.typeAttentionChannel,
      this.profileId
    );
    this.loadMap();
    this.initInputGoogle();
    if (!this.isNew) this.loadAttentionChannel();
  }

  loadAttentionChannel() {
    return this.medicService
      .getAttentionChannelDetail(
        this.idAttentionChannel,
        this.typeAttentionChannel
      )
      .then(data => {
        console.log("loadAttentionChannel", data);
        this.objAttentionChannel = data;
      });
  }

  loadMap() {
    var pos1LatLng = {
      lat: this.configService.DEFAULT_LAT,
      lng: this.configService.DEFAULT_LNG
    };
    if (!this.map) {
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 15,
        center: pos1LatLng
      });
    }
    if (!this.attentionChannelMarker) {
      this.attentionChannelMarker = new google.maps.Marker({
        position: pos1LatLng,
        map: this.map,
        title: "pos1"
      });
    } else {
      this.attentionChannelMarker.setPosition(pos1LatLng);
    }

    this.attentionChannelMarker.addListener("dragend", data => {
      this.onDragMarker(data);
    });

    this.attentionChannelMarker.setDraggable(true);
  }

  initInputGoogle() {
    let input = document
      .getElementById("address-attention-channel")
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
      this.objAttentionChannel.address = address;
      this.objAttentionChannel.position = {
        coordinates: [data.lat, data.lng]
      };
      var pos1LatLng = {
        lat: data.lat,
        lng: data.lng
      };
      this.attentionChannelMarker.setPosition(pos1LatLng);
      this.map.panTo(pos1LatLng);
    });
  }

  onDragMarker(data) {
    this.ngZone.run(() => {
      console.log("onDragMarker", data);
      this.objAttentionChannel.position = {
        coordinates: [data.latLng.lat(), data.latLng.lng()]
      };
    });
  }

  send() {
    let obj = this.serealize(this.objAttentionChannel);
    if (this.isNew) {
      return this.medicService
        .createAttentionChannel(this.typeAttentionChannel, obj)
        .then(data => {
          console.log("createAttentionChannel", data);
          return this.configService.showToast("Creado");
        })
        .catch(error => {
          this.configService.showToast(
            "Algo salio mal, vuelve a intentarlo",
            "toast-error"
          );
        });
    } else {
      return this.medicService
        .updateAttentionChannel(
          this.idAttentionChannel,
          this.typeAttentionChannel,
          obj
        )
        .then(data => {
          console.log("updateAttentionChannel", data);
          return this.configService.showToast("Actualizado");
        })
        .catch(error => {
          this.configService.showToast(
            "Algo salio mal, vuelve a intentarlo",
            "toast-error"
          );
        });
    }
  }

  serealize(data) {
    let obj = JSON.parse(JSON.stringify(data));
    obj.position = obj.position =
      "POINT(" +
      obj.position.coordinates[0] +
      " " +
      obj.position.coordinates[1] +
      ")";
    delete obj.imageattentionchannel_set;
    delete obj.scheduleattentionchannel_set;
    obj.profile = this.profileId;
    return obj;
  }
}
