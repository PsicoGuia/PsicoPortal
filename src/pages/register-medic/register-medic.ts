import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ConfigService } from '../../providers/config-service';
import { UserService } from '../../providers/user-service';

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
  loading = false;
  passEqualValidator(control: FormControl): { [s: string]: boolean } {
    console.log('passEqualValidator', control);
    if (this.registerMedicForm && this.registerMedicForm.value && this.registerMedicForm.value.password != control.value) {
      return { mismatchPasswords: true };
    }
  }

  registerMedicForm: FormGroup = this.formBuilder.group({
    'firstName': ['', [Validators.required, Validators.minLength(3), this.configService.nameValidator.bind(this)]],
    'lastName': ['', [Validators.required, Validators.minLength(3), this.configService.nameValidator.bind(this)]],
    'phone': ['', [Validators.required, Validators.minLength(7)]],
    'email': ['', [Validators.required, Validators.email]],
    'password': ['', [Validators.required, Validators.minLength(6)]],
    'validatePassword': ['', [Validators.required, Validators.minLength(6), this.passEqualValidator.bind(this)]],
    'profesional_card_id': ['', [Validators.required, Validators.minLength(7)]],
    'term_cond': [false, [Validators.required, Validators.requiredTrue]],
    'habeas_data': [false, [Validators.required, Validators.requiredTrue]],
    'email_notification': [false, []],
  });


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private configService: ConfigService,
    private userService: UserService,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterMedicPage');
    if (this.configService.debug) {
      this.registerMedicForm.setValue({
        firstName: "name test",
        lastName: "last name test",
        phone: "1234567",
        email: "1234567@yopmail.com",
        password: "1234567",
        validatePassword: "1234567",
        profesional_card_id: "1234567",
        term_cond: true,
        habeas_data: true,
        email_notification: true,
      });
    }
  }

  register() {
    console.log("RegisterMedicPage:register");
    this.loading = true;
    this.userService.signupmedic(
      this.registerMedicForm.value.firstName,
      this.registerMedicForm.value.lastName,
      undefined,
      this.registerMedicForm.value.profesional_card_id,
      this.registerMedicForm.value.email,
      this.registerMedicForm.value.phone,
      this.registerMedicForm.value.password,
      1.0,
      1.0,
      this.registerMedicForm.value.email_notification).then((data) => {
        console.log("register:OK", data);
        this.configService.showToast("Porfavor active su cuenta por correo antes de continuar", 'toast-success')
        this.navCtrl.setRoot('LoginMedicPage');
        this.loading = false;
      }).catch(err => {
        console.log("register:err", err);
        this.configService.showToast("Error al crear el usuario", "toast-failed")
        this.loading = false;
      })
  }
}
