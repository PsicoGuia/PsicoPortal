import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Settings } from './settings';
import 'rxjs/add/operator/toPromise';
/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class ApiService {
  url: string = '';
  _ready = false;

  constructor(
    public http: HttpClient,
    private settigsService: Settings,
  ) { }

  get(endpoint: string, params?: any, reqOpts?: any): Promise<any> {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }
    reqOpts.headers = this.get_headers();
    reqOpts.responseType = 'json';
    return this.http.get(this.url + endpoint, reqOpts).toPromise()
    .then(data=>{
      console.log("Api:get:sucess:"+this.url + endpoint,reqOpts,data);
      return data;
    }).catch(err=>{
      console.log("Api:get:err:"+this.url + endpoint,reqOpts,err);
      return Promise.reject(err);
    });
  }

  post(endpoint: string, body: any, reqOpts: any = {}): Promise<any> {
    reqOpts.headers = this.post_headers();
    reqOpts.responseType = 'json';
    return this.http.post(this.url + endpoint, body, reqOpts).toPromise().then(data=>{
      console.log("Api:post:sucess:"+this.url + endpoint,reqOpts,data);
      return data;
    }).catch(err=>{
      console.log("Api:post:err:"+this.url + endpoint,reqOpts,err);
      return Promise.reject(err);
    });
  }

  put(endpoint: string, body: any, reqOpts: any = {}): Promise<any> {
    reqOpts.headers = this.post_headers();
    reqOpts.responseType = 'json';
    return this.http.put(this.url + endpoint, body, reqOpts).toPromise().then(data=>{
      console.log("Api:put:sucess:"+this.url + endpoint,reqOpts,data);
      return data;
    }).catch(err=>{
      console.log("Api:put:err:"+this.url + endpoint,reqOpts,err);
      return Promise.reject(err);
    });
  }

  delete(endpoint: string, reqOpts: any = {}): Promise<any> {
    reqOpts.headers = this.post_headers();
    reqOpts.responseType = 'json';
    return this.http.delete(this.url + endpoint, reqOpts).toPromise().then(data=>{
      console.log("Api:delete:sucess:"+this.url + endpoint,reqOpts,data);
      return data;
    }).catch(err=>{
      console.log("Api:delete:err:"+this.url + endpoint,reqOpts,err);
      return Promise.reject(err);
    });
  }

  patch(endpoint: string, body: any, reqOpts: any = {}): Promise<any> {
    reqOpts.headers = this.post_headers();
    reqOpts.responseType = 'json';
    return this.http.patch(this.url + endpoint, body, reqOpts).toPromise().then(data=>{
      console.log("Api:patch:sucess:"+this.url + endpoint,reqOpts,data);
      return data;
    }).catch(err=>{
      console.log("Api:patch:err:"+this.url + endpoint,reqOpts,err);
      return Promise.reject(err);
    });
  }

  private get_headers(): HttpHeaders {
    let h: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    if (this.settigsService && this.settigsService.settings && this.settigsService.settings.token) {
      h.Authorization = this.settigsService.settings.token;
    }
    return  new HttpHeaders(h);
  }

  private post_headers(options?): HttpHeaders {
    let h: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE, PATCH",
    }
    if (this.settigsService && this.settigsService.settings && this.settigsService.settings.token) {
      h.Authorization = this.settigsService.settings.token;
    }
    return new HttpHeaders(h);
  }
}
