import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { ConfigService, URL_API } from "../providers/config-service";
import { Storage } from "@ionic/storage";
import { ApiService } from "./api";
import { Settings } from "./settings";

@Injectable()
export class PQRService {
  private user: any;
  private _categories: any;

  constructor(
    private api: ApiService,
    private configService: ConfigService,
    private settigsService: Settings
  ) {
    console.debug("Hello MedicService Provider");
  }

  getFAQS(params = {}): Promise<any> {
    console.debug("PQRService:getFAQS");
    return this.settigsService.onReady().then(() => {
      return this.api.get(URL_API + "pqr/faq/", params);
    });
  }

  createPQR(params): Promise<any> {
    console.debug("PQRService:createPQR");
    return this.settigsService.onReady().then(() => {
      return this.api.post(URL_API + "pqr/requestpqr/create/", params);
    });
  }
}
