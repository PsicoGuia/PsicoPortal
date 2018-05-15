import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import { UserService } from '../../providers/user-service'
import { CartService } from '../../providers/cart-service';
import { ConfigService } from '../../providers/config-service';
import { ContentService } from '../../providers/content-service';


/**
 * Generated class for the UserPointsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  segment: 'estado'
})
@Component({
  selector: 'page-user-points',
  templateUrl: 'user-points.html',
})
export class UserPointsPage {

  //-----------------------------
  //ATRIBUTES
  //-----------------------------

  userPoints:any;

  pointsPersentage:number;

  // user refered
  refered:any;

  //Loaders
  pointsLoader:boolean;

  //flags 
  hasRefered:boolean;

  points_states = {
    'ACT': 'Activo',
    'COS': 'Consumido',
    'EXP': 'Expirado'
  };

  //total active points
  total_active_points = 0;


  //-----------------------------
  //CONTRUCTOR
  //-----------------------------

  constructor(public navCtrl: NavController, public navParams: NavParams,
     private userService: UserService, public configService: ConfigService, 
     public cartService: CartService, private alertCtrl: AlertController,
     public contentService: ContentService) {

      this.userPoints = [];

      userService.getStoredUser().then((data) => {
        console.log(data);
        
        if (data.person.refered) {
          this.refered = data.person.refered.user.first_name+' '+data.person.refered.user.last_name;
          this.hasRefered = true;
        }else{
          this.hasRefered = false;          
        }
         console.log("this is data user", data);
      })
      this.loadPoints();
  }

  //-----------------------------
  //METHODS
  //-----------------------------

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPointsPage');
  }

  setRefered(){
    this.configService.showLoader("Buscando Referido...");    
    this.userService.validateRefered(this.refered).then((data)=>{
      let alert = this.alertCtrl.create({
        title: '¿Quieres definir tu referido?',
        message: 'Recuerda que luego de definirlo no lo podrás cambiar. \n ¿Deseas continuar?',
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
              this.userService.setRefered({'refered':(this.refered+'')}).then((data)=>{
                console.log('data', data);
                this.userService.checkAuthentication().then((user)=>{
                  this.configService.dismissLoader();
                  this.configService.showToast("referido agregado con éxito", "toast-success");
                  this.hasRefered = true;
                }, (error)=>{
                  console.log('error');
                  location.reload();
                });
              }, (err) => {
                let message = err._body;
                if (message.indexOf( "yourself" ) != -1) {
                  this.configService.showToast("Tu no puedes ser tu referidor", "toast-failed");
                }else{
                  if (message.indexOf( "has" ) != -1) {
                    this.configService.showToast("Ya posees un referido, no lo puedes cambiar", "toast-failed");                  
                  }else{
                    this.configService.showToast("No se ha encontrado el referidor", "toast-failed");                                
                  }
                }

                this.configService.dismissLoader();
              });
            }
          }
        ]
      });
      alert.present();
      this.configService.dismissLoader();
    }, (err) => {
      this.refered = '';
      this.configService.dismissLoader();
      this.configService.showToast("No se ha encontrado el referidor", "toast-failed");      
    });
  }

  loadPoints(){
    this.total_active_points = 0;
    this.pointsLoader = true;    
    this.contentService.getParams().then((param) => {
      for (let item of param) {
        if (item.key == 'referred_first_level') {
          this.pointsPersentage = Number(item.value)
        }
      } 
      console.log('params', param);
      this.userService.getPoints().then((data) => {
        console.log(data);
        this.pointsLoader = false;
        this.userPoints = data;
        for (let item of data) {
          if (item.state == 'ACT') {
            this.total_active_points += item.amount;
          }
        }
        }, (error) => {
          this.pointsLoader = false;
          this.configService.showToast(error, "toast-failed");
        });
      }, (error) => {
        this.pointsLoader = false;
        this.configService.showToast(error, "toast-failed");
      });
  }

}
