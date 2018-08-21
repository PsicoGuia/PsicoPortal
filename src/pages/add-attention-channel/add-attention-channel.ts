import { Component, ViewChild, ElementRef } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConfigService } from "../../providers/config-service";
import { GoogleService } from "../../providers/google-service";
declare var google: any;

@IonicPage({ segment: "add-attention-channel/:type/:id/" })
@Component({
  selector: "page-add-attention-channel",
  templateUrl: "add-attention-channel.html"
})
export class AddAttentionChannelPage {
  @ViewChild("map")
  mapElement: ElementRef;
  map:any;
  attentionChannelMarker;
  isNew = false;
  idAttentionChannel;
  typeAttentionChannel;
  profileId;
  newForm: FormGroup = this.formBuilder.group({
    title: ["", [Validators.required]],
    description: ["", [Validators.required]],
    address: ["", [Validators.required]],
    city: ["", [Validators.required]],
    addressGoogle: ["", ]
  });

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public configService: ConfigService,
    public googleService: GoogleService,
  ) {
    if (this.navParams.get("id") === true) this.isNew = true;
    else if (this.navParams.get("id"))
      this.idAttentionChannel = this.navParams.get("id");
    this.typeAttentionChannel = this.navParams.get("type");
    this.profileId = this.navParams.get("profileId");
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

  onDragMarker(data){
    console.log("onDragMarker",data);
    
  }

  onPalceChanged(data,name){
    console.log("onPalceChanged",data,name);
  }

  send(){

  }


}
