import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from '../../providers/config-service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

/**
 * Generated class for the FaqPqrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: "help"
})
@Component({
  selector: 'page-faq-pqr',
  templateUrl: 'faq-pqr.html',
})
export class FaqPqrPage {
  lastActiveFaq;
  FAQS = [
    { title: "Mi FirstPQR", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum" },
    { title: "2 FirstPQR", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum" },
  ]
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public configService: ConfigService,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FaqPqrPage');
  }

  activeFaq(faq) {
    if (this.lastActiveFaq)
      delete this.lastActiveFaq.active;
    this.lastActiveFaq = faq;
    this.lastActiveFaq.active = true;
  }

  // PQRs

  /**
   * name_request_user = models.TextField()
    email_request_user = models.TextField()
    phone_request_user = models.TextField()
    profile = models.ForeignKey(
        Profile, on_delete=models.SET_NULL, null=True, blank=True)
    request_order = models.ForeignKey(
        RequestOrderMedicDate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True)
    description = models.TextField()
   */
  loading = false;  
  registerPQRForm: FormGroup = this.formBuilder.group({
    'name_request_user': ['', [Validators.required, Validators.minLength(3)]],
    'email_request_user': ['', [Validators.required, Validators.email]],
    'phone_request_user': ['', [Validators.required, Validators.minLength(7)]],
    'description': ['', [Validators.required]],
    'email_notification': [],
    'term_cond': [false, [Validators.required, Validators.requiredTrue]],
  });

  registerPQR() {
    console.log("registerPQR");

  }

}
