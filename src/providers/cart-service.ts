import { Injectable } from '@angular/core';
import { AlertController, Platform, ModalController, Modal } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigService } from '../providers/config-service';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';
import { UserService } from './user-service'


@Injectable()
export class CartService {

  currency: string;
  _CART_STORAGE = "CART_STORAGE";
  contactModal: Modal;
  flag_total: any;
  public cartProducts: Array<{ id: number, odoo_id: number, name: string, images: Array<string>, price: number, descripcion: string, quantity: number, price_discount: number, discount: string, kit_id: any }> = [];

  constructor(public http: Http, public configService: ConfigService, public alertCtrl: AlertController,
    public platform: Platform, private inAppBrowser: InAppBrowser, private storage: Storage,
    private modal: ModalController, private userService: UserService) {
    //console.log('Hello CartService Provider');

    this.cartProducts = [];
    // Load cart from storage
    this.storage.get(this._CART_STORAGE).then((value) => {
      if (value)
        this.cartProducts = value;
    });

    this.currency = "COP";
  }


  addToCart(product: { id: number, odoo_id: number, name: string, images: Array<string>, price: number, descripcion: string, kit_id: number },
    quantity: number) {
    console.log("Adding to cart " + product.odoo_id + " x " + quantity, product);
    if (quantity < 1) {
      this.configService.showToast("Cantidad inválida", "toast-failed");
      return false;
    }

    let found = false;
    for (let p of this.cartProducts) {
      if (p.id == product.id && !product.kit_id && !p.kit_id) {
        //console.log("FOUND " + p.quantity + " + " + quantity);
        p.quantity = p.quantity + Number(quantity);
        found = true;
      }
    }
    if (!found) {
      let obj: any = product;
      obj.quantity = Number(quantity);
      this.cartProducts.push(obj);
    }

    this.configService.showToast(quantity + "x " + product.name + " Agregado al carrito de compras", "toast-success");
    // save this into local storage
    this.storage.set(this._CART_STORAGE, this.cartProducts);
  }


  removeCart(id) {
    var i = 0;
    let del = [];
    for (let cp of this.cartProducts) {
      if (cp.id == id) {
        del.push(cp);
        this.configService.showToast(cp.name + " eliminado del carrito de compras", "toast-warning");
      }
      if (cp.kit_id) {
        if (cp.kit_id == id) {
          del.push(cp);
          this.configService.showToast(cp.name + " eliminado del carrito de compras", "toast-warning");
        }
      }
      i++;
    }
    for (let dl of del) {
      this.remove(dl)
    }
  }

  remove(element) {
    var index = this.cartProducts.indexOf(element);
    if (index > -1) {
      this.cartProducts.splice(index, 1);
    }
    this.storage.set(this._CART_STORAGE, this.cartProducts);
  }


  clearCart() {
    //console.log("clear cart");

    this.cartProducts = [];
    // update local storage
    this.storage.set(this._CART_STORAGE, this.cartProducts);
  }


  editAmount(id, quantity) {
    //console.log("edit amount", id, quantity)
    let product_flag;
    let product_gifts = [];
    let prompt = this.alertCtrl.create({
      title: 'Editar cantidad',
      message: "Ingresa la cantidad deseada",
      inputs: [
        {
          name: 'quantity',
          placeholder: 'Cantidad',
          type: 'number',
          value: quantity,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Actualizar',
          handler: data => {
            if (data.quantity < 1) {
              this.configService.showToast("Cantidad inválida", "toast-failed");
              return false;
            }
            //console.log('Saved clicked', id, data);
            for (let cp of this.cartProducts) {
              if (cp.id == id) {
                cp.quantity = Number(data.quantity);
                product_flag = cp.quantity;
              }
              if(cp.kit_id){
                if(cp.kit_id == id){
                  product_gifts.push(cp);
                }
              }
            }
            // update local storage
            if(product_gifts.length == 1){
              product_gifts[0].quantity = Number(data.quantity*2);
            }else{
              for (let lq of product_gifts) {
                  lq.quantity = Number(data.quantity);
              }
            }
            this.storage.set(this._CART_STORAGE, this.cartProducts);
          }
        }
      ]
    });
    prompt.present();

  }


  checkOut() {
    //console.log("checkout", this.cartProducts);

    if (!this.cartProducts || this.cartProducts.length == 0) {
      this.configService.showToast("No tienes productos en tu carrito", "toast-failed");
      return;
    }
    this.contactModal = this.modal.create('ContactModal');
    this.contactModal.present();


  }


  storeOrder(name, email, shippingCountry, shippingCity, shippingAddress,
    phone, uponDelivery, points, voucher): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '/api/' + 'sales/saleorder/';
      let body = {
        "email": email,
        "name": name,
        "phone": phone,
        "shipping_country_id": shippingCountry,
        "shipping_city": shippingCity,
        "shipping_address": shippingAddress,
        "cart_products": this.cartProducts,
        "currency": this.currency,
        "upon_delivery": uponDelivery,
        "points":points,
        "voucher":voucher
      };
      //console.log("url:", url, "body:", body);

      let headers = this.configService.getHeaders();
      let token = this.userService.token;
      if (token) {
        headers.append('Authorization', token);
      }

      this.http.post(url, body, { headers: headers })
        .map(res => res.json())
        .publishReplay(1)
        .refCount()
        .subscribe(data => {
          //console.log("RESPONSE", data);
          resolve(data);
          //this.contactModal.dismiss();
        }, (err) => {
          //console.log("ERROR", err);
          reject(err);
        });
    });

  }

  /*
  1. POST django server purhcase info
  2. OnSucces GET external url django with SalerOrderName
  3. django retrieve SalerOrder
  4. django submit POST form to payu
  */
  goToPayuMiddleware(referenceCode, test) {
    this.platform.ready().then(() => {
      let url = '/api/' + 'sales/payu/?code=' + referenceCode + '&test=' + test;
      this.inAppBrowser.create(url, "_self");
    });
  }


  totalPrice(): number {
    let total = 0;
    for (let cp of this.cartProducts) {
      if(!cp.kit_id){
        if (cp.discount) {
          total += (cp.price - (cp.price * cp.price_discount / 100)) * cp.quantity;
        } else {
          total += (cp.price) * cp.quantity;
        }
      }
    }
    if (total < 30000 && this.cartProducts.length != 0) {
      this.flag_total = 5000;
    } else {
      this.flag_total = 0;
    }
    return total;
  }

    // Get state order pay
    getStatusOrder(id): Promise<any>{
      return new Promise((resolve, reject) => {
        let url = '/api/'+'sales/status-order/?id='+id;
        this.http.get(url, {headers: this.configService.getHeaders()})
          .map(res => res.json())
          .publishReplay(1)
          .refCount()
          .subscribe(data => {
            console.log("RESPONSE", data);
            resolve(data);
            //this.contactModal.dismiss();
        }, (err) => {
            console.log("ERROR", err);
            reject(err);
        });
      });
    }

}
