import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from '../../providers/config-service';
import { CartService } from '../../providers/cart-service';

/**
 * Generated class for the Thanks page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  segment: 'thanks/:id',
})
@Component({
  selector: 'page-thanks',
  templateUrl: 'thanks.html',
})
export class Thanks {

  status = {
    4:'APROVED',
    6:'REJECTED',
    104:'ERROR',
    7: 'PENDING'
  };

  Selectstatus:{
    name:string,
    description:string
  };

  loadingOrder:boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public cartService: CartService, public configService: ConfigService) {
      this.loadingOrder = true;
      this.Selectstatus = {
        name:'',
        description:''
      };
      console.log("params",  navParams.data);
      let id = this.navParams.get('id');
      if (id) {
        this.stateOrder(id)
      }else{
        this.Selectstatus.name = 'No se ha encontrado tu orden';  
        this.Selectstatus.description = 'Intenta de nuevo comprar tu producto, Si tienes algun problema comunicate con nuestra linea de atencion 3057158236';
        this.loadingOrder = false;
      }
  }

  stateOrder(id){
    this.cartService.getStatusOrder(id).then((data) => {
      let status:any;
      status = data.status;
      if (status == 4) {
        this.cartService.clearCart();
        this.Selectstatus.name = 'Gracias por tu compra!.';        
        this.Selectstatus.description = 'Tu compra será despachada en un plazo máximo de 36 horas. Si tienes alguna duda puedes comunicarte con nosotros al correo contacto@thesmokersstore.com o al número 305 7158236.';
      }
      else if (status == 6) {
        this.Selectstatus.name = 'Tu compra fue rechazada!.';        
        this.Selectstatus.description = 'Si tienes problema al efectuar el pago puedes comunicarte con nosotros al correo contacto@thesmokersstore.com o al número 305 7158236.';
      }
      else if (status == 104) {
        this.Selectstatus.name = 'Error en tu compra';        
        this.Selectstatus.description = 'Intenta de nuevo comprar tu producto, Si tienes algun problema comunicate con nuestra linea de atencion 3057158236';
      }
      else if (status == 7) {
        this.cartService.clearCart();
        this.Selectstatus.name = 'Estamos procesando tu compra.';        
        this.Selectstatus.description = 'Cualquier duda o inconveniente puedes comunicarte con nosotros al correo contacto@thesmokersstore.com o al número 305 7158236.';
      }
      else{
        this.cartService.clearCart();
        this.Selectstatus.name = 'Estamos procesando tu compra.';        
        this.Selectstatus.description = 'Cualquier duda o inconveniente puedes comunicarte con nosotros al correo contacto@thesmokersstore.com o al número 305 7158236.';
      }
      this.loadingOrder = false;
    }, (error) => {
      this.Selectstatus.name = 'Estamos procesando tu compra.';        
      this.Selectstatus.description = 'Cualquier duda o inconveniente puedes comunicarte con nosotros al correo contacto@thesmokersstore.com o al número 305 7158236.';
      this.loadingOrder = false;
    });
  }

  ionViewWillEnter() {
    //console.log('ionViewWillEnter Thanks');
  }

  goToShop(){
    this.navCtrl.setRoot('Home');
  }

  goToCart(){
    this.navCtrl.setRoot('Cart');
  }

}
