import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * A simple settings/config class for storing key/value pairs with persistence.
 */
@Injectable()
export class Settings {
  private SETTINGS_KEY: string = '_settings';

  public settings: any;

  _defaults: any;
  _readyPromise: Promise<any>;
  private ready = false;

  constructor(
    public storage: Storage,
  ) {
  }

  load(defaults: any): Promise<any> {
    this._defaults = defaults;
    return this.storage.get(this.SETTINGS_KEY).then((value) => {
      if (value) {
        this.settings = value;
        return this._mergeDefaults(this._defaults).then((val) => {
          this.ready = true;
        })

      } else {
        return this.setAll(this._defaults).then((val) => {
          this.settings = val;
          this.ready = true;
        })
      }
    });
  }

  _mergeDefaults(defaults: any): Promise<any> {
    for (let k in defaults) {
      if (!(k in this.settings)) {
        this.settings[k] = defaults[k];
      }
    }
    return this.setAll(this.settings);
  }

  merge(settings: any): Promise<any> {
    for (let k in settings) {
      this.settings[k] = settings[k];
    }
    return this.save();
  }

  setValue(key: string, value: any) {
    this.settings[key] = value;
    return this.storage.set(this.SETTINGS_KEY, this.settings);
  }

  setAll(value: any): Promise<any> {
    return this.storage.set(this.SETTINGS_KEY, value);
  }

  getValue(key: string): Promise<any> {
    return this.storage.get(this.SETTINGS_KEY)
      .then(settings => {
        return settings[key];
      });
  }

  save(): Promise<any> {
    return this.setAll(this.settings);
  }

  onReady(tries = 10): Promise<any> {
    return new Promise((resolve, reject) => {
      if (tries <= 0) reject("max tries onReady")
      if (this.ready) {
        resolve(true);
      } else {
        setTimeout(() => {
          this.onReady(tries--).then((data) => {
            resolve(data);
          })
        }, 500);
      }
    });
  }

  get allSettings(): any {
    return this.settings;
  }
}
