import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigService } from '../providers/config-service';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserService {

  public token: any;
  private user: any;
  public selectedAddress: number;
  public addressTitle: string;

  constructor(public http: Http, public configService: ConfigService, public storage: Storage) {
    //console.log('Hello UserService Provider');
    this.addressTitle = '';
    
  }


  createUser(email, password, firstName, lastName, phone, country, city, address, notes, refered){
    let paramUser = {
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
      username: email
    }

    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post('/api/' +'crm/user/', paramUser, {headers: headers})
          .subscribe(res => {
            let data = res.json();
            this.createPerson(data.id, phone, country, city, address, notes, refered)
            .then((person)=>{
              //TODO login
              let credentials:any;
              if (paramUser.username.length > 30) {
                credentials = {
                  username:paramUser.username.substring(0, 30),
                  password:paramUser.password
                };
              }else{
                credentials = {
                  username:paramUser.username,
                  password:paramUser.password
                };
              }
              this.login(credentials).then((token) =>{
                this.user = data;
                this.token=token;
                this.checkAuthentication().then((a)=>{
                  resolve(data);
                });
              }, (err)=>{
                reject(err);
              });
            }, (err) => {
              reject(err);
            });
          }, (err) => {
            reject(err);
          });
    });
  }


  createPerson(user_id, phone, country, city, address, notes, refered){
    let paramPerson = {
      user: user_id,
      phone: phone,
      refered: refered
    }


    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post('/api/' +'crm/person/', paramPerson, {headers: headers})
          .subscribe(res => {
            let data = res.json();
            this.createAddress(data.id, country, city, address, notes)
            .then((addressResponse)=>{
              resolve(data);
            }, (err) => {
              reject(err);
            });
          }, (err) => {
            //console.log(err);
            reject(err);
          });
    });
  }


  createAddress(personId, country, city, address, notes){
    let paramAddress = {
      person: personId,
      country_id: country,
      city: city,
      address: address,
      notes: notes
    }

    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post('/api/' +'crm/address/', paramAddress, {headers: headers})
          .subscribe(res => {
            let data = res.json();
            resolve(data);
          }, (err) => {
            //console.log(err);
            reject(err);
          });
    });

  }

  updateAddress(id, personId, country, city, address, notes){
    let paramAddress = {
      id: id,
      person: personId,
      country_id: country,
      city: city,
      address: address,
      notes: notes
    }

    return new Promise((resolve, reject) => {

        let headers = new Headers();
          this.storage.get('token').then((value) => {
            headers.append('Authorization', this.token);
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            headers.append("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");

            this.http.put('/api/' +'crm/address/'+id+'/', paramAddress, {headers: headers})
              .subscribe(res => {
                let data = res.json();
                resolve(data);
              }, (err) => {
                //console.log(err);
                reject(err);
              });

          }, (err) => {
            //console.log("ERROR", err);
            reject(err);
          });
        });
      }


  checkAuthentication(){
    //console.log("checking token...");
    return new Promise((resolve, reject) => {
        // Storage is ready to use
        this.storage.get('token').then((value) => {
            //console.log("token stored: " + value);
            if (value) this.token = value;
            let headers = new Headers();
            headers.append('Authorization', this.token);
            let url = '/api/' +'rest-auth/user/';
            //console.log("GET URL "+ url + " " + this.token);
            this.http.get(url, {headers: headers})
                .map(res => res.json())
                .subscribe(data => {
                    // Store app user
                    this.user = data;
                    this.storage.set('appuser', JSON.stringify(data)).then((value) => {
                        //console.log("Stored appuser: " + value);
                        resolve(data);
                    });
                }, (err) => {
                    reject(err);
                });
        });
    });
  }


  getStoredUser() : Promise<any>{
    return new Promise((resolve, reject) => {
        // Storage is ready to use
        if(this.user){
          resolve(this.user);
        }
        this.storage.get('appuser').then((value) => {
          //console.log('user', value);

          if(!value || !JSON.parse(value)){
            resolve(null);
          } else {
            let temp = JSON.parse(value);
            let address = temp.person.addresses
            for (let i = 0; i < address.length; i++) {
              for (let j = 0; j < address.length-1; j++) {
                if (address[j].city > address[j+1].city) {
                   let aux = address[j];
                   address[j] = address[j+1];
                   address[j+1] = aux;
                }
              }
            } 
            resolve(temp);
          }
        });
    });
  }


  login(credentials){
    if (credentials.username.length > 30) {
      credentials = {
        username:credentials.username.substring(0, 30),
        password:credentials.password
      };
    }else{
      credentials = {
        username:credentials.username,
        password:credentials.password
      };
    }
    //console.log("Login...");
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post('/api/' +'rest-auth/login/', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {
            let data = res.json();
              this.token = 'token ' + data.key;
              ////console.log("Storing token... " + 'token ' + data.key);
              this.storage.set('token', 'token ' + data.key).then((value) => {
                  //console.log("Stored token: " + value);
                  resolve(data);
              });
          }, (err) => {
            if(err.status == 400){
                reject("Correo y/o contraseña incorrectos");
            } else {
                reject("Verifica tu conexión a internet y vuélvelo a intentar.");
            }
          });
    });
  }


  logout(){
    //console.log("Log Out...");
    return new Promise((resolve, reject) => {
        this.token = "";
        this.storage.set('token', '').then((value) => {
          this.user = "";
          this.storage.set('appuser', '').then((value) => {
              resolve();
          });
        });
    });
  }


  forgotPassword(email){
    //console.log("recovering password...");
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post('/api/' +'rest-auth/password/reset/', {email: email}, {headers: headers})
          .subscribe(res => {
            let data = res.json();
            resolve(data);
          }, (err) => {
            reject(err);
          });
    });
  }


  getAddresses(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '/api/' +'crm/address/';
      let headers = this.configService.getHeaders();

      // Get token from localstorage, because view can be loaded before check auth
      this.storage.get('token').then((value) => {
        headers.append('Authorization', value);

        this.http.get(url, {headers: headers})
          .map(res => res.json())
          .publishReplay(1)
          .refCount()
          .subscribe(data => {
            //console.log("RESPONSE", data);
            let value:any;
            if (data.results) {
              value = data.results;
            } else {
              value = data;
            }
            for (let i = 0; i < value.length; i++) {
              for (let j = 0; j < value.length-1; j++) {
                if (value[j].city > value[j+1].city) {
                   let aux = value[j];
                   value[j] = value[j+1];
                   value[j+1] = aux;
                }
              }
            } 
            resolve(value)
          }, (err) => {
            //console.log("ERROR", err);
            reject(err);
          });
      }, (err) => {
        //console.log("ERROR", err);
        reject(err);
      });

    });
  }

  deleteAddress(id){
    return new Promise((resolve, reject) => {
      this.storage.get('token').then((value) => {
        let headers = new Headers();

        headers.append('Authorization', this.token);
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");

        this.http.delete('/api/' +'crm/address/'+id+'/', {headers: headers})
          .subscribe((ok) => {
            //console.log('Eliino',ok);
            resolve(ok);
          }, (err) => {
            //console.log(err);
            reject(err);
        });

      }, (err) => {
        //console.log("ERROR", err);
        reject(err);
      });
    });
  }

  getOrdersStore(): Promise<any> {
    return new Promise((resolve, reject) => {


      let url = '/api/' +'crm/odooorders';


      let headers = this.configService.getHeaders();

      // Get token from localstorage, because view can be loaded before check auth
      this.storage.get('token').then((value) => {
        headers.append('Authorization', value);

        this.http.get(url, {headers: headers})
          .map(res => res.json())
          .publishReplay(1)
          .refCount()
          .subscribe(data => {
            //console.log("RESPONSE", data);
            if (data.results) {
              //if comes as a pagination request
              resolve(data.results);
            } else {
              resolve(data)
            }
          }, (err) => {
            //console.log("ERROR", err);
            reject(err);
          });
      }, (err) => {
        //console.log("ERROR", err);
        reject(err);
      });

    });
  }

  getOrders(lim, offs): Promise<any> {
    return new Promise((resolve, reject) => {


      let url = '/api/' +'crm/orders';

      let pasw = false;

      if (lim) {
        if (pasw) {
          url = url + '&limit=' + lim;
        } else {
          url = url + '?limit=' + lim;
          pasw = true;
        }
      }

      if (offs && offs != 0) {
        if (pasw) {
          url = url + '&offset=' + offs;
        } else {
          url = url + '?offset=' + offs;
          pasw = true;
        }
      }

      let headers = this.configService.getHeaders();

      // Get token from localstorage, because view can be loaded before check auth
      this.storage.get('token').then((value) => {
        headers.append('Authorization', value);

        this.http.get(url, {headers: headers})
          .map(res => res.json())
          .publishReplay(1)
          .refCount()
          .subscribe(data => {
            //console.log("RESPONSE", data);
            if (data.results) {
              //if comes as a pagination request
              resolve(data.results);
            } else {
              resolve(data)
            }
          }, (err) => {
            //console.log("ERROR", err);
            reject(err);
          });
      }, (err) => {
        //console.log("ERROR", err);
        reject(err);
      });

    });
  }

  getPoints(): Promise<any> {
    return new Promise((resolve, reject) => {

      let url = '/api/' +'crm/points';
      let headers = this.configService.getHeaders();
      
      // Get token from localstorage, because view can be loaded before check auth
      this.storage.get('token').then((value) => {
        headers.append('Authorization', value);

        this.http.get(url, {headers: headers})
          .map(res => res.json())
          .publishReplay(1)
          .refCount()
          .subscribe(data => {
            //console.log("RESPONSE", data);
            if (data.results) {
              //if comes as a pagination request
              resolve(data.results);
            } else {
              resolve(data)
            }
          }, (err) => {
            //console.log("ERROR", err);
            reject(err);
          });
      }, (err) => {
        //console.log("ERROR", err);
        reject(err);
      });
    });
  }

  validateRefered(phone): Promise<any> {
    return new Promise((resolve, reject) => {

      let url = '/api/' +'crm/validaterefered/';
      let headers = this.configService.getHeaders();
      let body = {'refered':(phone+'')}
      
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

  setRefered(body): Promise<any> {
    return new Promise((resolve, reject) => {

      let url = '/api/' +'crm/person/';
      let headers = this.configService.getHeaders();

      // Get token from localstorage, because view can be loaded before check auth
      this.storage.get('token').then((value) => {
        headers.append('Authorization', value);
        this.http.patch(url, body, {headers: headers})
          .map(res => res.json())
          .publishReplay(1)
          .refCount()
          .subscribe(data => {
              resolve(data)
          }, (err) => {
            reject(err);
          });
      }, (err) => {
        //console.log("ERROR", err);
        reject(err);
      });
    });
  }

  setSelectedAddress(addressId, address){
    this.selectedAddress = addressId;
    this.addressTitle = address;
    this.storage.set('selectedAddress', this.selectedAddress).then((value) => {
       console.log("change address");
    });
  }

  getSelectedAddress(){
    return this.storage.get('selectedAddress');
  }

  setTitleAddress(user){
    // console.log('Que es esto?? ', user.person);
    return new Promise((resolve, reject) => {
      if (user && user.person) {
        user = user.person;
        this.getSelectedAddress().then((data)=>{
          if (data) {
            for (let add of user.addresses) {
              if (add.id == data) {
                this.addressTitle = add.address;
                resolve(true);              
                break;
              }
            }
          }
        });
      }else{
        resolve(true); 
      }
    });
  }
  
}
