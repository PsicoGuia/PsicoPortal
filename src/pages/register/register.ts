import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar, AlertController} from 'ionic-angular';
import { CartService } from '../../providers/cart-service';
import { UserService } from '../../providers/user-service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConfigService } from '../../providers/config-service';
import { ContentService } from '../../providers/content-service';

/**
 * Generated class for the Register page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class Register {

  @ViewChild('mainSearchbar') searchBar: Searchbar;


  myForm: FormGroup = this.formBuilder.group({
    'firstName': ['', [Validators.required, Validators.minLength(3), this.configService.nameValidator.bind(this)]],
    'lastName': ['', [Validators.required, Validators.minLength(3), this.configService.nameValidator.bind(this)]],
    'phone': ['', [Validators.required, Validators.minLength(7)]],
    'email': ['', [Validators.required, this.configService.emailValidator.bind(this)]],
    'password': ['', [Validators.required, Validators.minLength(6)]],
    'validatePassword': ['', [Validators.required, Validators.minLength(6)]],
    'country': [50, [Validators.required, Validators.minLength(1)]],
    'city': ['', []],
    'address': ['', [Validators.required, Validators.minLength(3)]],
    'notes': ['', []],
    'refered': ['', [Validators.minLength(7)]],
    'term_cond':false
  });

  citys: any;
  pCitys: any;
  _citys: any;
  selectCity: any;
  _flagClear: boolean;
  loading: boolean;
  _activeSearch: number;
  refered:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public cartService: CartService, public userService: UserService,
    public formBuilder: FormBuilder, public configService: ConfigService,
    public contentService: ContentService, private alertCtrl: AlertController) {
      this.citys = [];
      this.pCitys = [];
      this._citys = [];
      this._flagClear = false;
      this._activeSearch = -1;
      this.loading = true;
      this.loadCitys();
      this.refered = '';
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad Register');
    this.loading = true;
    this.loadCitys();
  }

  loadCitys(){
    this.contentService.getCitys().then((citys) => {
      this.loading = false;
      if(this._citys.length == 0){
        this._citys = citys;
        for (let ct of this._citys) {
            this.pCitys.push(ct.name);
        }
      }
    });
  }

  clearSearch(){
    this._flagClear = false;
    this._activeSearch = -1;
  }

  setCity(city){
    for (let ct of this._citys) {
        if(ct.name == city){
          this.selectCity = ct;
          this.searchBar.value = ct.name;
          break;
        }
    }

    this._activeSearch = -1;
  }

  getItems(ev: any) {
    let val = ev.target.value;

    if(val){
      this._flagClear = true;
    }else{
      this._flagClear = false;
    }
    // Reset items back to all of the items
    this.citys = this.pCitys;
    //console.log(this.citys);
    // set val to the value of the searchbar


    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.citys = this.citys.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  noCity(){
    this.selectCity = "";
    setTimeout(() => {
      this.searchBar.setFocus();
    },150);
  }

  registerForm(){
    if (!this.myForm.value.term_cond) {
      let alert = this.alertCtrl.create({
        title: 'Debes aceptar los terminos y condiciones',
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              
            }
          }
        ]
      });
      alert.present();
      return;
    }
    if (this.myForm.value.refered) {
      this.configService.showLoader("Buscando Referido...");    
      this.userService.validateRefered(this.myForm.value.refered).then((data)=>{
        this.configService.dismissLoader();
        this.continueRegister();
      }, (err) => {
        this.refered = '';
        this.configService.dismissLoader();
        let alert = this.alertCtrl.create({
          title: 'No se encuentra al referido',
          message: 'El numero de telefono que ingresaste no registra en el sistema a ningun usuario. \n ¿Deseas continuar sin referido?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                return;
              }
            },
            {
              text: 'Continuar',
              handler: () => {
                this.continueRegister();
              }
            }
          ]
        });
        alert.present();
      });
    }else{
      this.continueRegister();
    }
  }

  continueRegister(){
    this.configService.showLoader("Creando usuario...");
    this.userService.validateRefered(this.myForm.value.phone).then((data)=>{
      this.configService.showToast('Ya existe un usuario con este teléfono', "toast-failed");
      this.configService.dismissLoader();      
      return;
    }, (err) => {
      if(this.myForm.value.password == this.myForm.value.validatePassword){
        if (this.myForm.value.phone != this.myForm.value.refered){
          if(this.myForm.valid && this.selectCity){
            this.userService.createUser(this.myForm.value.email, this.myForm.value.password,
              this.myForm.value.firstName, this.myForm.value.lastName, this.myForm.value.phone,
              this.myForm.value.country, this.selectCity.id, this.myForm.value.address,
              this.myForm.value.notes, this.myForm.value.refered).then((user)=>{
                this.configService.dismissLoader();
                this.configService.showToast("Usuario creado", "toast-success");
                setTimeout(() => {
                  this.navCtrl.setRoot('Home');
                  //console.log('User', user);
                }, 500);
              }, (err) => {
                //console.log(err);
                this.configService.dismissLoader();
                if(err.status == 400 && err._body.includes("Ya existe un usuario con este nombre.")){
                    this.configService.showToast("Ya existe una cuenta con el correo provisto", "toast-failed");
                } else {
                    this.configService.showToast(err, "toast-failed");
                }
              });
          } else {
            this.configService.dismissLoader();
            this.configService.showToast("Debes llenar todos los campos requeridos", "toast-failed");
          }
        }else{
          this.configService.dismissLoader();
          this.configService.showToast("Tu no puedes ser tu referido.", "toast-failed");
        }
      } else{
        this.configService.dismissLoader();
        this.configService.showToast("Las contraseñas no coinciden.", "toast-failed");
      }
    });
  }

  pressKey(keyCode){
    if(keyCode == 13){
      if(this._activeSearch != -1){
        this.setCity(this.citys[this._activeSearch]);
      }
    }
    //Key down
    if(keyCode == 38){
      if(this.citys.length < 3){
        if(this._activeSearch > 0){
          this._activeSearch--;
        }else{
          this._activeSearch = this.citys.length-1;
        }
      }else{
        if(this._activeSearch > 0){
          this._activeSearch--;
        }else{
          this._activeSearch = 2;
        }
      }
    }
    //Key up
    if(keyCode == 40){
      if(this.citys.length < 3){
        if(this._activeSearch < this.citys.length-1){
          this._activeSearch++;
        }else{
          this._activeSearch = 0;
        }
      }else{
        if(this._activeSearch < 2){
          this._activeSearch++;
        }else{
          this._activeSearch = 0;
        }
      }

    }
  }
}
