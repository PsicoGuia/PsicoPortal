import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { ConfigService } from "../../providers/config-service";
import { PQRService } from "../../providers/pqr-service";

@IonicPage({
  segment: "help"
})
@Component({
  selector: "page-faq-pqr",
  templateUrl: "faq-pqr.html"
})
export class FaqPqrPage {
  lastActiveFaq;
  loading = true;
  FAQS = [];
  page;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public configService: ConfigService,
    public PQRService: PQRService
  ) {
    this.page = this.configService.getPage("PqrPage");
    this.PQRService.getFAQS().then(data => {
      this.loading = false;
      this.FAQS = data;
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad FaqPqrPage");
  }

  activeFaq(faq) {
    if (faq.active) return delete faq.active;
    if (this.lastActiveFaq) delete this.lastActiveFaq.active;
    this.lastActiveFaq = faq;
    this.lastActiveFaq.active = true;
  }

  pushPage(page) {
    this.navCtrl.push(page.component, { "name": "normal", "id": "request" });
  }

  // PQRs
}
