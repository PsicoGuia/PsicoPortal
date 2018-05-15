import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { CartService } from '../../providers/cart-service';
import { ConfigService } from '../../providers/config-service';
import { Http } from '@angular/http';
import { Modal, ModalController } from 'ionic-angular';


@IonicPage({
  segment: 'cart'
})
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class Cart {

  IDS_KITS: Array<number> = [3, 7, 10, 6, 9];
  
  signature: any;
  referenceCode: string;
  currency: string;
  contactModal: Modal;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public cartService: CartService, public configService: ConfigService,
    public http: Http, private modal: ModalController) {}

  ionViewDidLoad() {
    //console.log('ionViewDidLoad CartPage');

  }

  checkOut() {
    //console.log("checkout", this.cartProducts);

    if (!this.cartService.cartProducts || this.cartService.cartProducts.length == 0) {
      this.configService.showToast("No tienes productos en tu carrito", "toast-failed");
      return;
    }
    this.contactModal = this.modal.create('ContactModal', {'nav': this.navCtrl});
    this.contactModal.present();
  }


  elementCount(): number {
    ////console.log("count", this.cartService.cartProducts.length);
    return this.cartService.cartProducts.length;
  }


}
