import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, 
  Modal, ModalController, Searchbar, Events,
  ViewController, Platform, Content} from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { ContentService } from '../../providers/content-service';
import { ConfigService } from '../../providers/config-service';
import { ProductService } from '../../providers/product-service';
/**
 * Generated class for the CitySelectPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-city-select',
  templateUrl: 'city-select.html',
})
export class CitySelectPage {

  @ViewChild('mainSearchbar') searchBar: Searchbar;
  @ViewChild(Content) content: Content;

  countries: any;

  total_points: number;
  point_max: number;
  point_min: number = 0;
  point_steps: number = 100;
  points:any = 0;
  discount:any = 0;
  //Loaders
  loadingInfo: boolean;


  userlog: any;
  deliveryCost:any;

  currentAddress: {
    address: string;
    city: any;
    country_id: number;
    id: number;
    notes: string;
    nameCity: any;
  };

  addresses: Array<{
    address: string;
    city: any;
    country_id: number;
    id: number;
    notes: string;
    selected: boolean;
    nameCity: any;
  }>;

  //citys
  citys: any;
  pCitys: any;
  _citys: any;

  selectCity: any;

  _flagClear: boolean;

  _flagContraentrega: boolean;

  _flagVoucher: boolean;

  loginModal: Modal;

  _activeSearch: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private userService: UserService, private contentService: ContentService,
    private modal: ModalController, public configService: ConfigService, 
    public productService:ProductService, private view: ViewController, 
    public events: Events, public platform: Platform) {
      this.citys = [];
      this.pCitys = [];
      this._citys = [];
      this._flagClear = false;
      this.deliveryCost = 0;
      this._activeSearch = -1;
      this._flagVoucher = false;
      this.loadInformation();
  }

  ionViewWillEnter() {
    this.events.publish('disabledHandler');
    this.loadInformation();
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

  loadInformation() {
    this.loadingInfo = true;

    this.userService.getStoredUser().then((data) => {
      this.contentService.getCitys().then((citys) => {
        if(this._citys.length == 0){
          this._citys = citys;
          for (let ct of this._citys) {
              this.pCitys.push(ct.name);
          }
        }
        if (data) {
          //console.log("DATA", data);
          for (let ad of data.person.addresses) {
              for (let ct of this._citys) {
                  if(ad.city == ct.id){
                    ad.nameCity = ct.name;
                  }
              }
          }
          this.addresses = data.person.addresses;
          this.currentAddress = this.addresses[0];
          if (this.userService.selectedAddress) {
            this.changeCheck(this.userService.selectedAddress, true);                        
          } else {
            this.userService.getSelectedAddress().then((id)=>{
              if (!id) {
                this.changeCheck(this.addresses[0].id, true);            
              }else{
                this.changeCheck(id, true);
              }
            });
          }
        }
        this.loadingInfo = false;        
      }, error =>{
        this.loadingInfo = false;
        this.configService.showToast(error, "toast-failed");
      });
    }, error =>{
      this.loadingInfo = false;
      this.configService.showToast(error, "toast-failed");
    });
  }
  

  changeCheck(id, selec) {
    if (selec) {
      for (let variable of this.addresses) {
        if (variable.id != id) {
          variable.selected = !selec;
        } else {
          variable.selected = selec;
          if(variable.city== 1 || variable.city == 1656 || variable.city == 2146){
            this._flagContraentrega = true;
          }else{
            this._flagContraentrega = false;
          }
          this.currentAddress = variable;
        }
      }
    }
  }

  setCity(city){
    for (let ct of this._citys) {
        if(ct.name == city){
          if(ct.id == 1 || ct.id == 1656 || ct.id == 2146){
            this._flagContraentrega = true;
          }else{
            this._flagContraentrega = false;
          }
          this.selectCity = ct;
          this.searchBar.value = ct.name;
          break;
        }
    }
    this._activeSearch = -1;
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

  login() {
    this.loginModal = this.modal.create('LoginModal');
    this.loginModal.present();
    this.loginModal.onDidDismiss((data) =>{
      this.loadInformation();
    });
  }

  openPage(page) {
    this.navCtrl.push(page);
  }

  openPageRoot(page) {
    this.navCtrl.setRoot(page.component);
  }

  clearSearch(){
    this._flagClear = false;
        this._activeSearch = -1;
  }

  updateCity(){
    if (this.addresses) {
      if (!this.currentAddress) {
        this.configService.showToast('Debes seleccionar una Dirección', "toast-failed");     
      }
      this.productService.updateWarehouse(this.currentAddress.nameCity).then((data)=>{
        this.userService.setSelectedAddress(this.currentAddress.id, this.currentAddress.address);
        this.openPageRoot({component: 'Home'});
      }, (error) => {
        console.log('error city', error);
      })
    } else {
      if (!this.selectCity) {
        this.configService.showToast('Debes seleccionar una ciudad', "toast-failed");     
      }
      this.productService.updateWarehouse(this.selectCity.name).then((data)=>{
        this.openPageRoot({component: 'Home'});
      }, (error) => {
        console.log('error city', error);
      })
    }
  }

  noCity(){
    this.selectCity = "";
    this._flagContraentrega = false;
    setTimeout(() => {
      this.searchBar.setFocus();
    },150);
  }



}
