import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ConfigService, URL_API } from '../providers/config-service';
import { Storage } from '@ionic/storage';
import { ApiService } from './api';
import { Settings } from './settings';


@Injectable()
export class MedicService {

  private user: any;
  private _categories: any;

  constructor(
    private api: ApiService,
    private configService: ConfigService,
    private settigsService: Settings,
  ) {
    console.debug('Hello MedicService Provider');
  }

  getProfileDetail(id, params = {}): Promise<any> {
    console.debug("MedicService:getProfiles");
    return this.settigsService.onReady().then(() => { return this.api.get(URL_API + 'medic/profile/' + id + "/", params) });
  }

  getProfiles(params = {}): Promise<any> {
    console.debug("MedicService:getProfiles");
    return this.settigsService.onReady().then(() => { return this.api.get(URL_API + 'medic/profile/', params) });
  }

  getMyProfiles(params = {}): Promise<any> {
    console.debug("MedicService:getMyProfiles");
    return this.settigsService.onReady().then(() => { return this.api.get(URL_API + 'medic/profile/my-profile', params) });
  }

  getPatologies(): Promise<any> {
    console.debug("MedicService:getPatologies", this._categories);
    if (this._categories) {
      return Promise.resolve(this._categories);
    }
    return this.settigsService.onReady()
      .then(() => { return this.api.get(URL_API + 'medic/categoryPatology/') })
      .then(data => { return this._categories = data; });
  }



}
