import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishReplay';
import { ConfigService } from './config-service';
import { ContentService } from './content-service';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular/util/events';
import { CartService } from './cart-service';
/*
  Generated class for the ProductService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProductService {

  //Cache objects
  // _products: any;
  //Cache attributes
  _attributes: any;
  //Cache discounts
  _discounts: any;
  //Cache discounts
  _categories: any;
  //city warehouse
  citySelected: any;
  warehause: any;

  //loaders
  loading:boolean = true;
  

  constructor(public http: Http, public configService: ConfigService, 
    public contentService: ContentService, public storage: Storage, 
    public events: Events, public cartService:CartService) {
    //console.log('Hello ProductService Provider');
    /*
    this._products = [];
    this._attributes = [];
    this._discounts = [];
    */
    
    this.getStorageWarehouse().then((data) => {
      console.log("data cache ", data);
      
      if (data) {
        data = JSON.parse(data);
        this.citySelected = data.name.split(',')[0];
        if (data.wareHouse) {
          this.warehause = data.wareHouse.odoo_id;
        }else{
          this.warehause = 1;
        }
        this.loading = false;
      }else{
        console.log('Envio a select city');
        this.loading = false;
        this.events.publish('enableHeader');      
      }
    });
  }


  getCategories(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '/api/' + 'product/category/?limit=15';

      if (this._categories && this._categories.length > 0) {
        resolve(this._categories);
      }

      this.http.get(url, { headers: this.configService.getHeaders() })
        .map(res => res.json())
        .publishReplay(1)
        .refCount()
        .subscribe(data => {
          //console.log("RESPONSE", data);
          if (data.results) {
            //if comes as a pagination request
            this._categories = data.results;
            resolve(data.results);
          } else {
            this._categories = data;
            resolve(data)
          }
        }, (err) => {
          reject(err);
        });
    });
  }

  getProductById(id): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '/api/' + 'product/tmpl/' + id + '/';
      if (this.warehause) {
        url += '?warehouse='+this.warehause;
      }
      this.http.get(url, { headers: this.configService.getHeaders() })
        .map(res => res.json())
        .publishReplay(1)
        .refCount()
        .subscribe(data => {
          //console.log("RESPONSE", data);
          resolve(data);
        }, (err) => {
          //console.log("ERROR", err);
          reject(err);
        });
    });
  }

  getAttributes() {
    return new Promise((resolve, reject) => {
      let url = '/api/' + 'product/attribute/';

      if (this._attributes && this._attributes.length > 0) {
        resolve(this._attributes);
      }

      this.http.get(url, { headers: this.configService.getHeaders() })
        .map(res => res.json())
        .publishReplay(1)
        .refCount()
        .subscribe(data => {
          //console.log("RESPONSE", data);
          if (data.results) {
            this._attributes = data.results;
            resolve(data.results);
          } else {
            this._attributes = data;
            resolve(data);
          }

        }, (err) => {
          //console.log("ERROR", err);
          reject(err);
        });
    });
  }

  getAttributeById(attProduct) {

    let resp = {
      batteryCapacity: [],
      mlCapacity: [],
      case: [],
      color: [],
      levelNicotine: [],
      oHm: [],
      electricResistance: [],
      flavor: [],
      reference: [],
      GA: []
    };

    let noDuplicates = {
      batteryCapacity: [],
      mlCapacity: [],
      case: [],
      color: [],
      levelNicotine: [],
      oHm: [],
      electricResistance: [],
      flavor: [],
      reference: [],
      GA: []
    };


    if (attProduct) {
      for (let produ of attProduct.variants) {
        for (let pIdAtt of produ.attribute_value_ids) {
          for (let pIdAtt2 of this._attributes) {

            if (pIdAtt == pIdAtt2.id) {

              if (pIdAtt2.attribute_id[1] == 'Capacidad Batería') {
                if(noDuplicates.batteryCapacity.indexOf(pIdAtt2.name) == -1){
                  resp.batteryCapacity.push([pIdAtt2.id, pIdAtt2.name]);
                  noDuplicates.batteryCapacity.push(pIdAtt2.name);
                }
              }
              if (pIdAtt2.attribute_id[1] == 'Capacidad ml') {
                if(noDuplicates.mlCapacity.indexOf(pIdAtt2.name) == -1){
                  resp.mlCapacity.push([pIdAtt2.id, pIdAtt2.name]);
                  noDuplicates.mlCapacity.push(pIdAtt2.name);
                }
              }
              if (pIdAtt2.attribute_id[1] == 'Case') {
                if(noDuplicates.case.indexOf(pIdAtt2.name) == -1){
                  resp.case.push([pIdAtt2.id, pIdAtt2.name]);
                  noDuplicates.case.push(pIdAtt2.name);
                }
              }
              if (pIdAtt2.attribute_id[1] == 'Color') {
                if(noDuplicates.color.indexOf(pIdAtt2.name) == -1){
                  resp.color.push([pIdAtt2.id, pIdAtt2.name]);
                  noDuplicates.color.push(pIdAtt2.name);
                }
              }
              if (pIdAtt2.attribute_id[1] == 'Nivel Nicotina') {
                if(noDuplicates.levelNicotine.indexOf(pIdAtt2.name) == -1){
                  if(produ.qty_available){
                    resp.levelNicotine.push([pIdAtt2.id, pIdAtt2.name]);
                    noDuplicates.levelNicotine.push(pIdAtt2.name);
                  }
                }
              }
              if (pIdAtt2.attribute_id[1] == 'oHm') {
                if(noDuplicates.oHm.indexOf(pIdAtt2.name) == -1){
                  resp.oHm.push([pIdAtt2.id, pIdAtt2.name]);
                  noDuplicates.oHm.push(pIdAtt2.name);
                }
              }
              if (pIdAtt2.attribute_id[1] == 'Resistencia Eléctrica') {
                if(noDuplicates.electricResistance.indexOf(pIdAtt2.name) == -1){
                  resp.electricResistance.push([pIdAtt2.id, pIdAtt2.name]);
                  noDuplicates.electricResistance.push(pIdAtt2.name);
                }
              }
              if (pIdAtt2.attribute_id[1] == 'Sabor') {
                if(noDuplicates.flavor.indexOf(pIdAtt2.name) == -1){
                  resp.flavor.push([pIdAtt2.id, pIdAtt2.name]);
                  noDuplicates.flavor.push(pIdAtt2.name);
                }
              }
              if (pIdAtt2.attribute_id[1] == 'Referencia') {
                if(noDuplicates.reference.indexOf(pIdAtt2.name) == -1){
                  resp.reference.push([pIdAtt2.id, pIdAtt2.name]);
                  noDuplicates.reference.push(pIdAtt2.name);
                }
              }
              if (pIdAtt2.attribute_id[1] == 'GA') {
                if(noDuplicates.GA.indexOf(pIdAtt2.name) == -1){
                  resp.GA.push([pIdAtt2.id, pIdAtt2.name]);
                  noDuplicates.GA.push(pIdAtt2.name);
                }
              }
            }
          }
        }
      }
    }
    return resp;
  }

  getProducts(id: Array<any>, lim: any, offs: any, isScroll: boolean): Promise<any> {

    return new Promise((resolve, reject) => {

      // TODO to paginate use queryparam, example: /api/product/?offset=1&limit=2
      let url = '/api/' + 'product/tmpl/';
      let pass = false;


      if (id) {

        if (pass) {
          url = url + '&cat_ids=';
        } else {
          url = url + '?cat_ids=';
          pass = true;
        }
        url = url + id;

      }

      if (lim) {
        if (pass) {
          url = url + '&limit=' + lim;
        } else {
          url = url + '?limit=' + lim;
          pass = true;
        }
      }

      if (offs && offs != 0) {
        if (pass) {
          url = url + '&offset=' + offs;
        } else {
          url = url + '?offset=' + offs;
          pass = true;
        }
      }

      // if (!isScroll && this._products && this._products.length > 0) {
      //   resolve(this._products);
      //   return;
      // }

      if (this.warehause) {
        url += '&warehouse='+this.warehause;
      }

      this.http.get(url, { headers: this.configService.getHeaders() })
        .map(res => res.json())
        .publishReplay(1)
        .refCount()
        .subscribe(data => {
          //console.log("RESPONSE Products", data);
          if (data.results) {
            //if comes as a pagination request
            // if (!isScroll && (!this._products || this._products.length == 0)) {
            //   this._products = data.results;
            // }
            resolve(data.results);
          } else {
            // if (!isScroll && (!this._products || this._products.length == 0)) {
            //   this._products = data;
            // }
            resolve(data);
          }
        }, (err) => {
          //console.log("ERROR", err);
          reject(err);
        });
    });
  }

  getDiscounts(): Promise<any> {

    return new Promise((resolve, reject) => {
      let url = '/api/' + 'product/pricelist/';

      if (this._discounts && this._discounts.length > 0) {
        resolve(this._discounts);
      }

      this.http.get(url, { headers: this.configService.getHeaders() })
        .map(res => res.json())
        .publishReplay(1)
        .refCount()
        .subscribe(data => {
          if (data.results) {
            this._discounts = data.results;
            resolve(data.results);
          } else {
            this._discounts = data;
            resolve(data);
          }
        }, (err) => {
          //console.log("ERROR", err);
          reject(err);
        });
    });
  }

  getDiscountsByProduct(product) {

    let date = new Date().getTime();

    let asw = product;

    for (let discount of this._discounts) {
      let start = new Date(discount.date_start);
      let fin = new Date(discount.date_end);

      if (date > start.getTime() && date < fin.getTime()) {
        if (discount.categ_id && product.categ_id) {
          if (product.categ_id[1].indexOf(discount.categ_id[1]) != -1) {
            asw.discount = discount.price;
            asw.price_discount = discount.percent_price;
          }
        }
        if (discount.product_tmpl_id && product.id && product.variants) {
          if (discount.product_tmpl_id[0] == product.id) {
            asw.discount = discount.price;
            asw.price_discount = discount.percent_price;
            return asw;
          }
        }
        if (discount.product_id && product.id && !product.variants) {
          if (discount.product_id[0] == product.id) {
            //console.log("ENTRA A product");
            asw.discount = discount.price;
            asw.price_discount = discount.percent_price;
            return asw;
          }
        }
      }
    }
    return asw;
  }
  
  //update warehouse
  updateWarehouse(pCity){
    return new Promise((resolve, reject) => {
      this.contentService.getCitys().then((data)=>{
        let auxCity:any;
        for (let city of data) {
          if (pCity == city.name) {
            auxCity = city;
            this.citySelected = pCity.split(',')[0];
            if (city.wareHouse) {
              if (this.warehause != city.wareHouse.odoo_id) {
                this.cartService.clearCart();
              }
              this.warehause = city.wareHouse.odoo_id;
            }else{
              if (this.warehause != 1) {
                this.cartService.clearCart();
              }
              this.warehause = 1;
            }
            break;
          }
        }
        this.storage.set('warehouse', JSON.stringify(auxCity)).then((value) => {
          resolve(true);
        });
      }, (error) => {
        reject(error)
        console.log(error);
      })
    });
  }

  getStorageWarehouse(): Promise<any>{
    return this.storage.get('warehouse')
  }
}
