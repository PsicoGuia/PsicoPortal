import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Events, Modal, ModalController } from 'ionic-angular';
import { CartService } from '../../providers/cart-service';
import { ConfigService } from '../../providers/config-service';
import { UserService } from '../../providers/user-service';
import { AlertController } from 'ionic-angular';
import { ContentService } from '../../providers/content-service';
import { Searchbar } from 'ionic-angular';
import { ProductService } from '../../providers/product-service';
/**
 * Generated class for the ContactModal page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-contact-modal',
  templateUrl: 'contact-modal.html',
})
export class ContactModal {

  @ViewChild('mainSearchbar') searchBar: Searchbar;

  formdata: any;

  countries: any;

  total_points: number;
  point_max: number;
  point_min: number = 0;
  point_steps: number = 100;
  points:any = 0;
  discount:any = 0;
  //Loaders
  loading: boolean;


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

  citys: any;
  pCitys: any;
  _citys: any;

  selectCity: any;

  _flagClear: boolean;

  _flagContraentrega: boolean;

  _flagVoucher: boolean;

  _flagSelectedCity: boolean;


  keyVoucher:any

  loginModal: Modal;

  _activeSearch: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private view: ViewController, public cartService: CartService,
    public configService: ConfigService, private userService: UserService,
    private alertCtrl: AlertController, public events: Events,
    private contentService: ContentService, private modal: ModalController,
    public productService:ProductService) {

    if (this.navParams.get('nav')) {
      this.navCtrl = this.navParams.get('nav');      
    }
    this.citys = [];
    this.pCitys = [];
    this._citys = [];
    this._flagClear = false;
    this.deliveryCost = 0;
    this._activeSearch = -1;
    this._flagVoucher = false;
    this._flagSelectedCity = false;
    this.keyVoucher = null;    
    this.loadInformation();
  }

  loadInformation() {
    this.loading = true;
    this.productService.getStorageWarehouse().then((warehause => {      
      this.userService.getStoredUser().then((data) => {
        this.contentService.getCitys().then((citys) => {
          warehause = JSON.parse(warehause);
          if(this._citys.length == 0){
            this._citys = citys;
            for (let ct of this._citys) {
                this.pCitys.push(ct.name);
                if(ct.id == warehause.id){
                  this.selectCity = ct;
                  this._flagSelectedCity = true;
                  if( warehause.id== 1 ||  warehause.id == 1656 ||  warehause.id == 2146){
                    this._flagContraentrega = true;
                  }
                }
            }
          }
          if (data) {
            //console.log("DATA", data);
            let idAddress:number;
            if (this.userService.selectedAddress) {
              console.log('este es id', this.userService.selectedAddress);
              idAddress = this.userService.selectedAddress;
            } else {
              this.userService.getSelectedAddress().then((id)=>{
                console.log('este es id2', id);
                  idAddress = id;
                  for (let ad of data.person.addresses) {
                    for (let ct of this._citys) {
                      if(ad.city == ct.id){
                        ad.nameCity = ct.name;
                      }
                    }
                    if (idAddress && ad.id == idAddress) {
                      this.currentAddress = ad;
                    }         
                  }
                  
                  this.addresses = data.person.addresses;
                  if (!idAddress) {
                    this.currentAddress = data.person.addresses[0];
                  }           
                  this.formdata = {
                    "name": data.first_name + ' ' + data.last_name,
                    "email": data.username,
                    "country": 50,
                    "city": this.currentAddress.city,
                    "address": this.addresses,
                    "phone": data.person.phone,
                  };
              });
            }

            for (let ad of data.person.addresses) {
              for (let ct of this._citys) {
                if(ad.city == ct.id){
                  ad.nameCity = ct.name;
                }
              }
              if (idAddress && ad.id == idAddress) {
                this.currentAddress = ad;
              }         
            }
            
            this.addresses = data.person.addresses;
            if (!idAddress) {
              this.currentAddress = data.person.addresses[0];
            }           
            this.formdata = {
              "name": data.first_name + ' ' + data.last_name,
              "email": data.username,
              "country": 50,
              "city": this.currentAddress.city,
              "address": this.addresses,
              "phone": data.person.phone,
            };
          } else {
            //console.log("NODATA");
            this.formdata = {
              "name": " ",
              "email": " ",
              "country": 50,
              "city": " ",
              "address": " ",
              "phone": " ",
            };
            //console.log(this.formdata);
          }
  
          this.userService.getPoints().then((data) => {
              console.log("Points", data);
              this.total_points = 0;
              for (let point of data) {
                if (point.state == "ACT") {
                  this.total_points += point.amount;
                }
              }
              let cartPrice = this.cartService.totalPrice();
              if (cartPrice < 30000) {
                this.deliveryCost = 5000;
              }
              if (this.total_points > cartPrice) {
                this.point_max = cartPrice;
              }else{
                this.point_max = this.total_points;
              }
  
  
            }, (error) => {
              this.configService.showToast(error, "toast-failed");
            }
          );
  
          this.loading = false;
        });
      });
    }));
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ContactModal');
    this.loadInformation();
  }


  testPayu2(uponDelivery) {
    this.formdata = {
      "name": "Test Nombre",
      "email": "test@test.com",
      "country": 50,
      "city": "Bogotá",
      "address": "calle 12 # 34 - 56",
      "phone": "3001234567",
    };

    this.validateData(uponDelivery, 1);
  }

  testGoToThanks(){
    this.events.publish('goPage', {'component':'Thanks'});
    this.view.dismiss();
  }

  openPage(page) {
    this.events.publish('goPage', page);
    this.view.dismiss();
  }

  validateData(uponDelivery: boolean, test=0 ) {
    let cost_delivery = 0;
    if ((this.cartService.totalPrice()+cost_delivery-this.discount-this.points) < 10000 ) {
      uponDelivery = true;
    }
    if (this.addresses) {
      this.configService.showLoader('Validando información');
      this.cartService.storeOrder(this.formdata.name, this.formdata.email, this.formdata.country,
        this.currentAddress.nameCity, this.currentAddress.address, this.formdata.phone, uponDelivery, this.points, this.keyVoucher)
        .then((data) => {
          if (!uponDelivery) {
            let referenceCode = data.reference_code; // generated by django
            this.cartService.goToPayuMiddleware(referenceCode, test);
          } else {
            //console.log("thanks");
            this.view.dismiss();
            this.navCtrl.setRoot('Thanks', {'id': data.id});
          }
          this.configService.dismissLoader();
        }, (err) => {
          this.configService.dismissLoader();
          this.configService.showToast(err._body, "toast-failed");
        });

    } else {
      var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
      if (!this.formdata.name || this.formdata.name.length <= 1) {
        this.configService.showToast("El nombre es requerido", "toast-failed");
        return false;
      } else if (!EMAIL_REGEXP.test(this.formdata.email)) {
        this.configService.showToast("Email inválido", "toast-failed");
        return false;
      } else if (!this.formdata.country || this.formdata.country.length <= 1) {
        this.configService.showToast("Pais de envío inválido", "toast-failed");
        return false;
      } else if (!this.selectCity) {
        this.configService.showToast("Seleccione un ciudad de envió ", "toast-failed");
        return false;
      } else if (!this.formdata.address || this.formdata.address.length <= 1) {
        this.configService.showToast("Dirección de envío inválido", "toast-failed");
        return false;
      } else {
        this.configService.showLoader('Validando información');
        this.cartService.storeOrder(this.formdata.name, this.formdata.email, this.formdata.country,
          this.selectCity.name, this.formdata.address, this.formdata.phone, uponDelivery, this.points, this.keyVoucher)
          .then((data) => {
            this.configService.dismissLoader();
            if (!uponDelivery) {
              let referenceCode = data.reference_code; // generated by django
              this.cartService.goToPayuMiddleware(referenceCode, test);
            } else {
              console.log("thanks", data);
              this.view.dismiss();
              this.navCtrl.setRoot('Thanks', {'id': data.id});
            }

          }, (err) => {
            this.configService.dismissLoader();
            this.configService.showToast(err._body, "toast-failed");
          });
      }

      // Don't close it yet
      return false;
    }
  }

  isSelect() {
    if(this.addresses){
      for (let variable of this.addresses) {
        if (variable.selected) {
          return true;
        }
      }
    }
    return false;
  }

  onChange(address) {
    this.currentAddress = this.addresses[address];
    this.formdata.city = this.currentAddress.city;
  }

  login() {
    this.loginModal = this.modal.create('LoginModal');
    this.loginModal.present();
    this.loginModal.onDidDismiss((data) =>{
      this.loadInformation();
    });
  }


  loadUserInfo() {
    return new Promise((resolve, reject) => {
      //check if its app user SYNC Continuous
      this.userService.getStoredUser().then((res: any) => {
        // Check if already authenticated
        this.userService.checkAuthentication().then((res: any) => {
          ////console.log("Loading User Info", res);
          // Update user info
          //console.log(res.person);
          //TODO print user
          resolve(res);
        }, (err) => {
          reject(err);
        });

      });
    });
  }

  closeModal() {
    this.view.dismiss();
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

  noCity(){
    this.selectCity = "";
    this._flagContraentrega = false;
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

  validateVoucher(key){
    this.configService.showLoader("Cargando");
    this.contentService.validateVoucher(key).then((data) => {
      this._flagVoucher = true;      
      if(data.discount.indexOf('%') >= 0){
        this.discount = this.cartService.totalPrice()*Number(data.discount.substring(0, data.discount.length-1))/100;        
      }else{
        this.discount = Number(data.discount);
      }
      this.configService.showToast('Cupón valido', "toast-success");      
      this.configService.dismissLoader();
    }, (error) => {
      this.configService.dismissLoader();      
      this.configService.showToast("Cupón invalido", "toast-failed");      
    });
  }
}
