import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ConfigService, URL_API } from '../providers/config-service';
import { Storage } from '@ionic/storage';
import { ApiService } from './api';
import { Settings } from './settings';


@Injectable()
export class MedicService {

  private user: any;

  constructor(
    private api: ApiService,
    private configService: ConfigService,
    private settigsService: Settings,
  ) {
    console.debug('Hello MedicService Provider');
  }
  getProfiles(): Promise<any> {
    console.debug("MedicService:getProfiles");
    return this.settigsService.onReady().then(() => { return this.api.get(URL_API + 'medic/profile/') });
  }



}
