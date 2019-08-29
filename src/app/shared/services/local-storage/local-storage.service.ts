import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LocalStorageService {
  constructor() {}

  setLocalStorageItem(key: string, value: string) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorageItem(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  clearLocalStorage() {
    localStorage.clear();
  }
}
