import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ShoppingModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-shopping-modal',
  templateUrl: 'shopping-modal.html',
})
export class ShoppingModal {

  product: {id: number, odoo_id: number, name: string, photos: Array<any>, price: number, description: string, qty_available: number, kit_id: any, price_discount: number, discount: string, quantity: number};
  gifLiquids: Array<{id: number, odoo_id: number, name: string, photos: Array<any>, price: number, description: string, qty_available: number, kit_id: any, price_discount: number, discount: string, quantity: number}>;
  loading: boolean;
  navCt:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {
    this.loading = true;
  }

  ionViewDidLoad() {
    if(this.navParams.get('product') && this.navParams.get('quantity')){
      this.product = this.navParams.get('product');
      this.product.quantity = this.navParams.get('quantity');
    }

    if(this.navParams.get('liquids').length != 0){
      this.gifLiquids = this.navParams.get('liquids');
      if(this.navParams.get('liquids')[0] != this.navParams.get('liquids')[1]){
        this.gifLiquids = this.navParams.get('liquids');
        this.gifLiquids[0].quantity = this.product.quantity;
        this.gifLiquids[1].quantity = this.product.quantity;
      }else{
        this.gifLiquids = [this.navParams.get('liquids')[0]];
        this.gifLiquids[0].quantity = this.product.quantity*2;
      }
    }

    this.navCt = this.navParams.get('nav');
    //console.log('ionViewDidLoad ShoppingModalPage');
    this.loading = false;
  }

  continueShop(){
    this.navCt.setRoot('Home', {'TIENDA': true});
    this.closeModal();
  }

  pay(){
    this.navCt.setRoot('Cart');
    this.closeModal();
  }

  closeModal(){
    this.view.dismiss();
  }
}
