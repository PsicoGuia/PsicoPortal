import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishReplay';
import { ConfigService } from './config-service';
declare var appGoogleAnalitics:any;
/*
  Generated class for the ContentService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ContentService {

  //Cache objects
  _home:any;
  _homeSlideFooter:any;
  _homeSlideMid:any;  
  //Cache citys
  _citys: any;
  //Params
  _params:any;
  constructor(public http: Http, public configService: ConfigService) {
    //console.log('Hello ContentService Provider');
    /*
    this._home = null;
    */
    this._citys = [];
    this._params = [];
  }


  getHome(): Promise<any> {
    return new Promise((resolve, reject) => {
      //check cache
      if(this._home && this._home.length > 0){
        resolve(this._home);
        return;
      }

      let url = '/api/' + 'content/homeslider/';

      this.http.get(url, {headers: this.configService.getHeaders()})
        .map(res => res.json())
        .publishReplay(1)
        .refCount()
        .subscribe(data => {
          //console.log("RESPONSE", data);
          if (data.results) {
            this._home = data.results;
            resolve(data.results);
          } else {
            this._home = data;
            resolve(data);
          }
        }, (err) => {
          //console.log("ERROR", err);
          reject(err);
        });
    });
  }
  
  getParams(): Promise<any> {
    return new Promise((resolve, reject) => {
      //check cache
      if(this._params && this._params.length > 0){
        resolve(this._params);
        return;
      }

      let url = '/api/' + 'content/params/';

      this.http.get(url, {headers: this.configService.getHeaders()})
        .map(res => res.json())
        .publishReplay(1)
        .refCount()
        .subscribe(data => {
          //console.log("RESPONSE", data);
          if (data.results) {
            this._params = data.results;
            resolve(data.results);
          } else {
            this._params = data;
            resolve(data);
          }
        }, (err) => {
          //console.log("ERROR", err);
          reject(err);
        });
    });
  }



  getHomeHighLightProducts(warehause): Promise<any> {
    return new Promise((resolve, reject) => {
      //check cache
      let url = '/api/' + 'content/homehighlightproduct/';
      if (warehause) {
        url += '?warehouse='+warehause;
      }
      this.http.get(url, {headers: this.configService.getHeaders()})
        .map(res => res.json())
        .publishReplay(1)
        .refCount()
        .subscribe(data => {
          //console.log("RESPONSE", data);
          if (data.results) {
            resolve(data.results);
          } else {
            resolve(data);
          }
        }, (err) => {
          //console.log("ERROR", err);
          reject(err);
        });
    });
  }


  getHomeSlideFooter(): Promise<any> {
    return new Promise((resolve, reject) => {
      //check cache
      if(this._homeSlideFooter && this._homeSlideFooter.length > 0){
        resolve(this._homeSlideFooter);
        return;
      }

      let url = '/api/' + 'content/homesliderfooter/';

      this.http.get(url, {headers: this.configService.getHeaders()})
        .map(res => res.json())
        .publishReplay(1)
        .refCount()
        .subscribe(data => {
          // console.log("RESPONSE FOOTER", data);
          if (data.results) {
            this._homeSlideFooter = data.results;
            resolve(data.results);
          } else {
            this._homeSlideFooter = data.results;
            resolve(data);
          }
        }, (err) => {
          // console.log("ERROR", err);
          reject(err);
        });
    });
  }

  getHomeSlideMid(): Promise<any> {
    return new Promise((resolve, reject) => {
      //check cache
      if(this._homeSlideMid && this._homeSlideMid.length > 0){
        resolve(this._homeSlideMid);
        return;
      }

      let url = '/api/' + 'content/homeslidermid/';

      this.http.get(url, {headers: this.configService.getHeaders()})
        .map(res => res.json())
        .publishReplay(1)
        .refCount()
        .subscribe(data => {
          //console.log("RESPONSE", data);
          if (data.results) {
            this._homeSlideMid = data.results;
            resolve(data.results);
          } else {
            this._homeSlideMid = data.results;
            resolve(data);
          }
        }, (err) => {
          //console.log("ERROR", err);
          reject(err);
        });
    });
  }

  contactform(name, email, phone, text){
      let body = {"name":name, "email":email, "phone":phone, "text":text};

      return new Promise((resolve, reject) => {
        let url = '/api/' + 'crm/contact/';
        let headers = this.configService.getHeaders();

        this.http.post(url, JSON.stringify(body), { headers: headers })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
  }

  getCitys(): Promise<any>{
    return new Promise((resolve, reject) => {
      let url = '/api/' + 'crm/city/?limit=2000';

      if (this._citys.length != 0) {
        resolve(this._citys);
      }

      this.http.get(url, { headers: this.configService.getHeaders() })
        .map(res => res.json())
        .publishReplay(1)
        .refCount()
        .subscribe(data => {
          if (data.results) {
            this._citys = data.results;
            resolve(data.results);
          } else {
            this._citys = data;
            resolve(data);
          }
        }, (err) => {
          //console.log("ERROR", err);
          reject(err);
        });
    });
  }

  analyticsPage(url){
    //console.log("ANALITICS GOOGLE ", url);
    appGoogleAnalitics.sedPageAnalitics(url);
  }

  validateVoucher(key):Promise<any>{
    return new Promise((resolve, reject) => {

      let url = '/api/' +'content/voucher/';
      let headers = this.configService.getHeaders();
      let body = {'key':(key+'')}
      
      this.http.post(url, body, {headers: headers})
        .map(res => res.json())
        .publishReplay(1)
        .refCount()
        .subscribe(data => {
            resolve(data)
        }, (err) => {
          reject(err);
        });
    });
  }
}
