import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private localStoage: Storage;

  constructor() {
    this.localStoage = window.localStorage;
  }

  get(key: string): any {
    if (this.isLocalStorageSupported()) {
      return JSON.parse(this.localStoage.getItem(key));
    }
    return null;
  }

  set(key: string, value: any): boolean {
    if (this.isLocalStorageSupported()) {
      this.localStoage.setItem(key, JSON.stringify(value));
      return true;
    }
    return false;
  }

  remove(key: string): boolean {
    if (this.isLocalStorageSupported()) {
      this.localStoage.removeItem(key);
      return true;
    }
    return false;
  }

  private isLocalStorageSupported(): boolean {
    return !!this.localStoage;
  }
}
