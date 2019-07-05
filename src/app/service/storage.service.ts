import { Injectable } from '@angular/core';
import { FUNCTIONS } from '../variable-constants';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  constructor() { }

  public get(Key, Type, isEncoded) {
    if (FUNCTIONS.TRIM(Type) == session) {
      let data = sessionStorage.getItem(Key);
      if (isEncoded) {
        let decoded = JSON.parse(decodeURIComponent(JSON.parse(data)));
        return decoded ? decoded : null;
      } else {
        let parsed = JSON.parse(data);
        return parsed ? parsed : null;
      }
    } else if (FUNCTIONS.TRIM(Type) == local) {
      let data = localStorage.getItem(Key);
      if (isEncoded) {
        let decoded = JSON.parse(decodeURIComponent(JSON.parse(data)));
        return decoded ? decoded : null;
      } else {
        let parsed = JSON.parse(data);
        return parsed ? parsed : null;
      }
    }
  }

  public set(Key, Type, isEncoded, data) {
    if (FUNCTIONS.TRIM(Type) == session) {
      if (isEncoded) {
        let encoded = JSON.stringify(encodeURIComponent(JSON.stringify(data)));
        sessionStorage.setItem(Key, encoded);
      } else {
        let stringified = JSON.stringify(data);
        sessionStorage.setItem(Key, stringified);
      }
    } else if (FUNCTIONS.TRIM(Type) == local) {
      if (isEncoded) {
        let encoded = JSON.stringify(encodeURIComponent(JSON.stringify(data)));
        localStorage.setItem(Key, encoded);
      } else {
        let stringified = JSON.stringify(data);
        localStorage.setItem(Key, stringified);
      }
    }
  }

  public static remove(Key, Type) {
    if (FUNCTIONS.TRIM(Type) == session) {
      sessionStorage.removeItem(Key);
    } else if (FUNCTIONS.TRIM(Type) == local) {
      localStorage.removeItem(Key);
    }
  }

  public static clear(Type) {
    if (FUNCTIONS.TRIM(Type) == session) {
      sessionStorage.clear();
    } else if (FUNCTIONS.TRIM(Type) == local) {
      localStorage.clear();
    } else {
      sessionStorage.clear();
      localStorage.clear();
    }
  }
}

const session = 'session';
const local = 'local';
