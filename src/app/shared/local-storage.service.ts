import { Injectable } from '@angular/core';
import { LocalStorageConfig } from './local-storage-config';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private CONFIGS_KEY: string = 'LOCAL_STORAGE_SERVICE_CONFIGS';
  private localStorage: Storage;
  private configs = {};

  constructor() {
    this.localStorage = window.localStorage;
  }

  // optional method to set non-default config for a key
  register(key: string, sessionScope: boolean, expireTimeMinutes: number) {
    console.log('Registering key ' + key + ' with sessionScope: ' + sessionScope + '; expireTimeMinutes: ' + expireTimeMinutes);
    let config = new LocalStorageConfig();
    config.sessionScope = sessionScope;
    config.expireTimeMinutes = expireTimeMinutes;
    this.saveConfig(key, config);
  }

  private saveConfig(key: string, config: LocalStorageConfig) {
    console.log('Saving config for key ' + key + ' with config: ', config);
    config.key = key;
    let configs = this.getConfigs();
    configs[key] = config;
    this.localStorage.setItem(this.CONFIGS_KEY, JSON.stringify(configs));
  }

  // provided to be called by auth service whenever user changes
  handleUserChange() {
    console.log('handling user change in local storage');
    let configs = this.getConfigs();
    Object.keys(configs).forEach(configKey => {
      let config = configs[configKey];
      if (config.sessionScope) {
        console.log('Removing session scoped key "' + config.key + '" from storage due to user change.');
        this.remove(config.key);
      }
    });
  }

  private getConfig(key: string): LocalStorageConfig {
    return this.getConfigs()[key];
  }

  private getConfigs() {
    console.log('configs: ', this.configs);
    if (Object.keys(this.configs).length == 0) {
      // service may have been reset; try loading configs from local storage
      console.log('attempting to load configs from local storage');
      let lcConfigs = JSON.parse(this.localStorage.getItem(this.CONFIGS_KEY));
      console.log('configs from local storage: ', lcConfigs);
      if (lcConfigs != null && lcConfigs != undefined) {
        console.log('settings configs from local storage');
        this.configs = lcConfigs;
      }
    }
    return this.configs;
  }

  get(key: string, caller: string): any {
    console.log('getting for ' + key + ' by ' + caller);
    if (this.isLocalStorageSupported()) {
      let config = this.getConfig(key);
      console.log('config: ', config);
      if (config != null && config != undefined) {
        if (config.expireTimeMinutes > 0) {
          if (config.lastStoreTime != null && config.lastStoreTime != undefined) {
            let time = new Date().getTime();
            let ageMinutes = (time - config.lastStoreTime)/60000;
            console.log(key + ' age in minutes: ' + ageMinutes + ' (expire age: ' + config.expireTimeMinutes + ')');
            if (ageMinutes >= config.expireTimeMinutes) {
              console.log('expiring ' + key + ' due to age.');
              this.remove(key);
            }
          } else {
            console.log('expiring ' + key + ' due to no store time information.');
            this.remove(key);
          }
        }
        let rval = JSON.parse(this.localStorage.getItem(key));
        console.log('value is: ', rval);
        return rval;
      }
    }
    console.log('trap fall through -- returning null');
    return null;
  }

  set(key: string, value: any): boolean {
    if (this.isLocalStorageSupported()) {
      console.log('set called for key ' + key + ': ', value);
      this.localStorage.setItem(key, JSON.stringify(value));
      let config = this.getConfig(key);
      if (config === null || config === undefined) {
        console.log('auto-generating default config for key on set: ' + key);
        config = new LocalStorageConfig();
      }
      config.lastStoreTime = new Date().getTime();
      this.saveConfig(key, config);
      return true;
    }
    return false;
  }

  remove(key: string): boolean {
    if (this.isLocalStorageSupported()) {
      this.localStorage.removeItem(key);
      return true;
    }
    return false;
  }

  private isLocalStorageSupported(): boolean {
    return !!this.localStorage;
  }
}
