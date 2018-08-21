import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import {
  Validators,
  FormGroup,
  FormBuilder,
  FormControl
} from "@angular/forms";
import { PQRService } from "../../providers/pqr-service";
import { ConfigService } from "../../providers/config-service";

@IonicPage({
  segment: "pqr/:name/:id"
})
@Component({
  selector: "page-pqr",
  templateUrl: "pqr.html"
})
export class PqrPage {
  idParam;
  nameProfile;
  isProfile;
  isOrder;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public PQRService: PQRService,
    public configService: ConfigService
  ) {
    this.idParam = this.navParams.get("id");
    this.nameProfile = this.navParams.get("name");
    if (this.nameProfile == "order") this.isOrder = true;
    if (this.nameProfile != "order" && this.nameProfile != "normal")
      this.isProfile = true;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PqrPage", this.nameProfile, this.idParam);
  }

  loading = false;
  registerPQRForm: FormGroup = this.formBuilder.group({
    name_request_user: ["", [Validators.required, Validators.minLength(3)]],
    email_request_user: ["", [Validators.required, Validators.email]],
    phone_request_user: ["", [Validators.required, Validators.minLength(7)]],
    description: ["", [Validators.required]]
  });

  registerPQR() {
    if (this.loading) return;
    console.log("registerPQR");
    let params: any = {
      name_request_user: this.registerPQRForm.value.name_request_user,
      email_request_user: this.registerPQRForm.value.email_request_user,
      phone_request_user: this.registerPQRForm.value.phone_request_user,
      description: this.registerPQRForm.value.description
    };
    if (this.isProfile) params.profile = this.idParam;
    this.loading = true;
    this.PQRService.createPQR(params)
      .then(() => {
        this.configService.showToast(
          "Su PQR há sido guardado, espere la respueste en su correo."
        );
        this.configService.openPage(this.configService.getPage("Home"));
        this.loading = false;
      })
      .catch(() => {
        this.configService.showToast(
          "Tuvimos un error con su PQR.",
          "toast-error"
        );
        this.loading = false;
      });
  }
}
