import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal } from 'ionic-angular';
import { CartService } from '../../providers/cart-service';
import { UserService } from '../../providers/user-service';
import { ConfigService } from '../../providers/config-service';
import { AlertController, Events } from 'ionic-angular';
import { ContentService } from '../../providers/content-service';

/**
 * Generated class for the Addresses page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-addresses',
  templateUrl: 'addresses.html',
})
export class Addresses {

  loadingAddresses: boolean = true;
  addresses: Array<any>;
  addressModal: Modal;
  _citys: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public cartService: CartService, public userService: UserService,
    public configService: ConfigService, private alertCtrl: AlertController,
    private modal: ModalController, public events: Events,
    private contentService: ContentService) {
    events.subscribe('editAddress', (data) => {
      if (data.id) {
        this.editAddress(data.id, data.country, data.city, data.address, data.notes);
      } else {
        this.createAddress(data.country, data.city, data.address, data.notes);
      }
    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad Addresses');
  }

  ionViewWillEnter() {
    //console.log('ionViewWillEnter Addresses');
    this.loadAddresses();
  }


  loadAddresses() {
    this.userService.getAddresses().then((value) => {
      this.contentService.getCitys().then((citys) => {
        this._citys = citys;
        for (let vl of value) {
          for (let ct of citys) {
            if (vl.city == ct.id) {
              vl.nameCity = ct.name;
            }
          }
        }
        this.addresses = value;
        this.loadingAddresses = false;
      }, (err) => {
        this.loadingAddresses = false;
        this.configService.showToast(err, "toast-failed");
      });
    }, (err) => {
      this.loadingAddresses = false;
      this.configService.showToast(err, "toast-failed");
    });
  }

  createAddress(country, city, address, notes) {

    this.userService.getStoredUser().then((value) => {
      //console.log('IdUser',value)
      let personId = value.person.id;
      if (!personId) {
        this.configService.showToast("Error al obtener usuario, porfavor ingresa", "toast-failed");
        this.configService.dismissLoader();
        return;
      }
      this.userService.createAddress(personId, country, city, address, notes).then((value) => {
        this.userService.checkAuthentication().then((data) => {
          console.log('ADDRESS', value);
          let pValue: any;
          pValue = value;
          for (let ct of this._citys) {
            if (pValue.city == ct.id) {
              pValue.nameCity = ct.name;
              break;
            }
          }
          this.addresses.push(value);
          this.orderAdress();
          this.configService.showToast("Dirección agregada", "toast-success");
        }, (err) => {
          this.configService.showToast(err, "toast-failed");
        });
      }, (err) => {
        this.configService.showToast(err, "toast-failed");
      });
    }, (err) => {
      this.configService.showToast(err, "toast-failed");
    });
  }

  /**
  *Change the values when edit a address
  */
  changeValue(id, value) {
    for (let a of this.addresses) {
      if (a.id == id) {
        for (let ct of this._citys) {
          if (value.city == ct.id) {
            a.nameCity = ct.name;
            a.address = value.address;
            a.notes = value.notes;
            break;
          }
        }
      }
    }
  }

  deleteAddress(id) {
    var i = 0;
    for (let a of this.addresses) {
      if (a.id == id) {
        this.addresses.splice(i, 1);
      }
      else {
        i++;
      }
    }
    this.orderAdress();
  }

  editAddress(id, country, city, address, notes) {

    this.userService.getStoredUser().then((value) => {
      let personId = value.person.id;
      if (!personId) {
        this.configService.showToast("Error al obtener usuario, porfavor ingresa", "toast-failed");
      }
      this.userService.updateAddress(id, personId, country, city, address, notes).then((value) => {
        this.userService.checkAuthentication().then((data) => {
          this.changeValue(id, value);
          this.orderAdress();
          this.configService.showToast("Dirección actualizada", "toast-success");
        }, (err) => {
          this.configService.showToast(err, "toast-failed");
        });
      }, (err) => {
        this.configService.showToast(err, "toast-failed");
      });
    }, (err) => {
      this.configService.showToast(err, "toast-failed");
    });
  }


  removeAddress(id) {
    let alert = this.alertCtrl.create({
      title: '¿Deseas eliminar esta dirección?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.configService.showLoader("Eliminando dirección...");
            this.userService.getStoredUser().then((value) => {
              let personId = value.person.id;
              if (!personId) {
                this.configService.dismissLoader();
                this.configService.showToast("Error al obtener usuario, porfavor ingresa", "toast-failed");
              }
              this.userService.deleteAddress(id).then((value) => {
                this.userService.checkAuthentication().then((dara) => {
                  this.deleteAddress(id);
                  this.configService.dismissLoader();
                  this.configService.showToast("Dirección Eliminada", "toast-success");
                }, (err) => {
                  this.configService.dismissLoader();
                  this.configService.showToast(err, "toast-failed");
                });
              }, (err) => {
                this.configService.dismissLoader();
                this.configService.showToast(err, "toast-failed");
              });
            }, (err) => {
              this.configService.dismissLoader();
              this.configService.showToast(err, "toast-failed");
            });
          }
        }
      ]
    });
    alert.present();
  }


  newAddressM() {
    this.addressModal = this.modal.create('AddressModalPage');
    this.addressModal.present();

  }

  editAddressM(pData) {
    this.addressModal = this.modal.create('AddressModalPage', { 'pData': pData });
    this.addressModal.present();
  }

  orderAdress(){
    for (let i = 0; i < this.addresses.length; i++) {
      for (let j = 0; j < this.addresses.length-1; j++) {
        if (this.addresses[j].city > this.addresses[j+1].city) {
           let aux = this.addresses[j];
           this.addresses[j] = this.addresses[j+1];
           this.addresses[j+1] = aux;
        }
      }
    } 
  }


}
