import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartService } from '../../providers/cart-service';
import { UserService } from '../../providers/user-service';
import { ConfigService } from '../../providers/config-service';

/**
 * Generated class for the Orders page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class Orders {

  N_ORDERS: number = 3;

  loadingOrders:boolean;
  orders: Array<any>;
  currentScroll: number;
  ordersStore: Array<any>;
  pOrdersStore: Array<any>;
  sCurrentScroll: number;

  selectOrders: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public cartService: CartService, public userService: UserService,
    public configService: ConfigService) {
      this.currentScroll = 0;
      this.sCurrentScroll = 0;
      this.selectOrders = true;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad Orders');
  }

  ionViewWillEnter() {
    //console.log('ionViewWillEnter Orders');
    this.loadingOrders = true;
    this.loadOrders('');
    this.loadOrdersStore();
  }

  ordersStoreInfiniteScroll(infiniteScroll){
    setTimeout(() => {
      if((this.sCurrentScroll+3) <= this.ordersStore.length){
        for(let i = this.sCurrentScroll; i < this.sCurrentScroll+3; i++){
          this.pOrdersStore.push(this.ordersStore[i]);
        }
        this.sCurrentScroll += 3;
      }else{
        let difference = this.ordersStore.length - (this.sCurrentScroll-1);
        if (difference != 0) {
            infiniteScroll.enable(false);
        } else {
          for(let i = this.sCurrentScroll; i < this.sCurrentScroll+difference; i++){
            this.pOrdersStore.push(this.orders[i]);
          }
          this.sCurrentScroll += difference;
        }
      }
      infiniteScroll.complete();
    }, 500);
  }

  loadOrdersStore(){
    this.userService.getOrdersStore().then((data) =>{
      this.loadingOrders = false;
      this.ordersStore = data;

      if(data[0]){
        this.pOrdersStore = [data[0]];
      }

      if(data[1]){
        this.pOrdersStore.push(data[0]);
      }

      if(data[2]){
        this.pOrdersStore.push(data[2]);
      }
      if(this.pOrdersStore){
        this.currentScroll += this.pOrdersStore.length-1;
      }
    }, (err) => {
      this.loadingOrders = false;
      this.configService.showToast(err, "toast-failed");
    });
  }

  loadOrders(infiniteScroll: any){
    setTimeout(() => {
      let offset = this.N_ORDERS * this.currentScroll;

      this.userService.getOrders(this.N_ORDERS, offset).then((value) => {
        this.loadingOrders = false;
        for (let dt of value) {
          if(!dt.invoice_name){
            dt.invoice_name = '-';
          }

          if(!dt.amount){
            dt.amount = '-';
          }

          if(!dt.created){
            dt.created = '-';
          }
        }

        if(value.length == 0 && infiniteScroll){
          infiniteScroll.enable(false);
        }

        if(this.orders){
          for (let variable of value) {
              this.orders.push(variable);
          }
          if(infiniteScroll){
            infiniteScroll.complete();
          }
        }else{
          this.orders = value;
          if(infiniteScroll){
            infiniteScroll.complete();
          }
        }
        //console.log('orders', value);
      }, (err) => {
        this.configService.showToast(err, "toast-failed");
      });
      this.currentScroll++;
    }, 500);
  }

  getState(number){
    if(!number)
    {
      return 'Pendiente';
    }
    else if(number == 4){
      return 'Aprobada';
    }
    else if(number == 6 || number == 104){
      return 'Rechazada';
    }
    else if(number == 7){
      return 'En espera';
    }
    else{
      return 'En proceso';
    }
  }

  getDate(date){
    var reTime = /(\d+\-\d+\-\d+)\D\:(\d+\:\d+\:\d+).+/;
    var originalTime = date;
    var newTime = originalTime.replace(reTime, '$1 $2');
    return newTime;
  }

  changeTypeOrder(element){
    this.selectOrders = element;
  }

}
