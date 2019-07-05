import { Injectable } from '@angular/core';
import { AppConstants } from '../constants';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HrmsService {
  _baseURLPMS: string;
  _baseURLAPPS: string;
  constructor(private http: HttpClient) {
    this._baseURLPMS = AppConstants.baseURLPMS;
  }

  public login(data): Observable<any> {
    // console.warn(this._baseURLPMS + "/api/pms/login")
    return this.http.post(this._baseURLPMS + "login", {
      data
    }, { observe: "response" });
  }

  public session(): Observable<any> {
    return this.http.get(this._baseURLPMS + "session");
  }

  public logout(): Observable<any> {
    return this.http.get(this._baseURLPMS + "logout");
  }

  //GET
  // public hrms(username): Observable<any> {
  //   return this.http.get(this._baseURL + "");
  // }

  //POST
  // public login(data): Observable<any> {
  //   return this.http.post(this._baseURL + "", {
  //     data
  //   }, { observe: "response" });
  // }

  //   public getUsers(): Observable<any> {
  //   return this.http.get("https://jsonplaceholder.typicode.com/users");
  // }
}
