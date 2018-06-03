import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ConfigService } from '../../providers/config-service';

/**
 * Generated class for the RegisterMedicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'register-medic'
})
@Component({
  selector: 'page-register-medic',
  templateUrl: 'register-medic.html',
})
export class RegisterMedicPage {


  regusterMedicForm: FormGroup = this.formBuilder.group({
    'firstName': ['', [Validators.required, Validators.minLength(3), this.configService.nameValidator.bind(this)]],
    'lastName': ['', [Validators.required, Validators.minLength(3), this.configService.nameValidator.bind(this)]],
    'phone': ['', [Validators.required, Validators.minLength(7)]],
    'email': ['', [Validators.required, Validators.email]],
    'password': ['', [Validators.required, Validators.minLength(6)]],
    'validatePassword': ['', [Validators.required, Validators.minLength(6)]],
    'profesional_card_id': ['', [Validators.required, Validators.minLength(7)]],
    'term_cond': [false, [Validators.required, Validators.requiredTrue]],
    'habeas_data': [false, [Validators.required, Validators.requiredTrue]],
    'email_notification': [false, [Validators.required, Validators.requiredTrue]],
  });


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private configService: ConfigService,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterMedicPage');
  }

  register(){
    console.log("RegisterMedicPage:register");
    
    
  }

}
