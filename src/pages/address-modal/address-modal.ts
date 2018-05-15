import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ContentService } from '../../providers/content-service';
import { Searchbar, Events } from 'ionic-angular';
import { ConfigService } from '../../providers/config-service';
/**
 * Generated class for the AddressModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-address-modal',
  templateUrl: 'address-modal.html',
})

export class AddressModalPage {

  @ViewChild('mainSearchbar') searchBar: Searchbar;

  //--------------------------------------
  //ATTRIBUTES
  //--------------------------------------

  formdata: any;
  citys: any;
  pCitys: any;
  _citys: any;
  selectCity: any;
  _flagClear: boolean;
  _activeSearch: number;
  
  //loaders 
  loading: boolean;  
  loadingEvent: boolean;
  //--------------------------------------
  //CONSTRUCTOR
  //--------------------------------------

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private contentService: ContentService, private view: ViewController,
    public events: Events, public configService: ConfigService) {
    this.citys = [];
    this.pCitys = [];
    this._citys = [];
    this._flagClear = false;
    this._activeSearch = -1;
    this.loadInformation('');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AddressModalPage');
    this.loadInformation(this.navParams.get('pData'));
  }

  loadInformation(data){
    this.loading = true;
    this.contentService.getCitys().then((citys) => {

        if(this._citys.length == 0){
          this._citys = citys;
          for (let ct of this._citys) {
              this.pCitys.push(ct.name);
          }
        }
        //console.log("NODATA");
        if(data){
          for (let ct of this._citys) {
              if(ct.id == data[1]){
                this.selectCity = ct;
                break;
              }
          }
          this.formdata = {
            'id': data[0],
            "country": 50,
            "city": '',
            "address": data[2],
            "notes": data[3],
          };
        }else{
          this.formdata = {
            'id': '',
            "country": 50,
            "city": "",
            "address": "",
            "notes": "",
          };
        }
        //console.log(this.formdata);
        this.loading = false;
    });
  }

  closeModal() {
    this.view.dismiss();
  }

  editAddress(){
    this.loadingEvent = true;
    if(this.selectCity){
      if (this.formdata.address) {
        this.events.publish('editAddress', this.formdata);
        this.view.dismiss();
        this.loadingEvent = false;
      } else {
        this.configService.showToast('Debe especificar una dirección', "toast-failed");
      }
    }else{
      this.configService.showToast('Debe seleccionar una ciudad', "toast-failed");
    }
  }

  getItems(ev: any) {
    let val = ev.target.value;

    if(val){
      this._flagClear = true;
    }else{
      this._flagClear = false;
    }
    // Reset items back to all of the items
    this.citys = this.pCitys;
    //console.log(this.citys);
    // set val to the value of the searchbar


    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.citys = this.citys.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  clearSearch(){
    this._flagClear = false;
    this._activeSearch = -1;
  }

  setCity(city){
    for (let ct of this._citys) {
        if(ct.name == city){
          this.selectCity = ct;
          this.formdata.city = ct.id;
          this.searchBar.value = ct.name;
          break;
        }
    }

    this._activeSearch = -1;
  }

  noCity(){
    this.selectCity = "";
    setTimeout(() => {
      this.searchBar.setFocus();
    },150);
  }

  pressKey(keyCode){
    if(keyCode == 13){
      if(this._activeSearch != -1){
        this.setCity(this.citys[this._activeSearch]);
      }
    }
    //Key down
    if(keyCode == 38){
      if(this.citys.length < 3){
        if(this._activeSearch > 0){
          this._activeSearch--;
        }else{
          this._activeSearch = this.citys.length-1;
        }
      }else{
        if(this._activeSearch > 0){
          this._activeSearch--;
        }else{
          this._activeSearch = 2;
        }
      }
    }
    //Key up
    if(keyCode == 40){
      if(this.citys.length < 3){
        if(this._activeSearch < this.citys.length-1){
          this._activeSearch++;
        }else{
          this._activeSearch = 0;
        }
      }else{
        if(this._activeSearch < 2){
          this._activeSearch++;
        }else{
          this._activeSearch = 0;
        }
      }

    }
  }

}
