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
    config.key = key;
    let configs = this.getConfigs();
    configs[key] = config;
    this.localStorage.setItem(this.CONFIGS_KEY, JSON.stringify(configs));
  }

  // provided to be called by auth service whenever user changes
  handleUserChange() {
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
    if (Object.keys(this.configs).length == 0) {
      // service may have been reset; try loading configs from local storage
      let lcConfigs = JSON.parse(this.localStorage.getItem(this.CONFIGS_KEY));
      if (lcConfigs != null && lcConfigs != undefined) {
        this.configs = lcConfigs;
      }
    }
    return this.configs;
  }

  get(key: string, caller: string): any {
    if (this.isLocalStorageSupported()) {
      let config = this.getConfig(key);
      if (config != null && config != undefined) {
        if (config.expireTimeMinutes > 0) {
          if (config.lastStoreTime != null && config.lastStoreTime != undefined) {
            let time = new Date().getTime();
            let ageMinutes = (time - config.lastStoreTime)/60000;
            if (ageMinutes >= config.expireTimeMinutes) {
              console.log('expiring ' + key + ' due to age.');
              this.remove(key);
            }
          } else {
            console.log('expiring ' + key + ' due to no store time information.');
            this.remove(key);
          }
        }
        return JSON.parse(this.localStorage.getItem(key));
      }
    }
    return null;
  }

  set(key: string, value: any): boolean {
    if (this.isLocalStorageSupported()) {
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
