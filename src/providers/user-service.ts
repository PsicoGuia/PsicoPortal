import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ConfigService, URL_API } from '../providers/config-service';
import { Storage } from '@ionic/storage';
import { ApiService } from './api';
import { Settings } from './settings';


@Injectable()
export class UserService {

  private user: any;

  constructor(
    private api: ApiService,
    private configService: ConfigService,
    private settigsService: Settings,
  ) {
    console.log('Hello UserService Provider');
  }


  createUser(email, password, firstName, lastName, phone, country, city, address, notes, refered) {
    console.log("UserService:checkAuthentication");
    let paramUser = {
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
      username: email
    }
    return this.api.post(URL_API + 'crm/user/', paramUser);
  }


  checkAuthentication(): Promise<any> {
    console.log("UserService:checkAuthentication");
    return this.settigsService.onReady()
      .then(() => {
        let endpoint = '/api/' + 'rest-auth/user/';
        this.api.get(endpoint)
      })
      .then(data => {
        // Store app user
        this.user = data;
        return this.settigsService.setValue('appuser', data);
      })
  }


  getStoredUser(): Promise<any> {
    console.log("UserService:getStoredUser");
    return new Promise((resolve, reject) => {
      // Storage is ready to use
      if (this.user) {
        resolve(this.user);
      }
      this.settigsService.onReady().then((value) => {
        this.user = this.settigsService.allSettings.user; //No reflect
        resolve(this.user);
      });
    });
  }


  login(credentials): Promise<any> {
    console.log("UserService:login");
    if (credentials.username.length > 30) { // django-user length max
      credentials.username = credentials.username.substring(0, 30)
    }
    return new Promise((resolve, reject) => {
      this.api.post(URL_API + 'rest-auth/login/', credentials)
        .then(res => {
          let token = 'token ' + res.key;
          return this.settigsService.setValue('token', token)
        }).then((data) => {
          resolve(data);
        }).catch((err) => {
          if (err.status == 400) {
            reject("Correo y/o contraseña incorrectos");
          } else {
            reject("Verifica tu conexión a internet y vuélvelo a intentar.");
          }
        });
    });
  }


  logout(): Promise<any> {
    console.log("UserService:logout");
    //console.log("Log Out...");
    return this.settigsService.setValue('token', '').then((value) => {
      this.user = undefined;
    }).then(() => {
      this.settigsService.setValue('appuser', '').then((value) => {
      });
    });
  }


  forgotPassword(email): Promise<any> {
    console.log("UserService:forgotPassword");
    //console.log("recovering password...");
    return this.api.post(URL_API + 'rest-auth/password/reset/', { email: email });
  }

  signupmedic(first_name, last_name, identification_number, profesional_number, email, phone, password, version_terms, version_terms_abeusdata, notification): Promise<any> {
    let params = {
      "first_name": first_name,
      "last_name": last_name,
      "identification_number": identification_number,
      "profesional_number": profesional_number,
      "email": email,
      "phone": phone,
      "password": password,
      "version_terms": version_terms,
      "version_terms_abeusdata": version_terms_abeusdata,
      "notification": notification,
    }

    return this.api.post(URL_API + 'crm/signupmedic/', params);
  }

  loginmedic(params): Promise<any> {
    return this.api.post(URL_API + 'crm/loginmedic/', params);
  }

}
