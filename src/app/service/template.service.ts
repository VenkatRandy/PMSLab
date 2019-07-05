import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  _baseURLPMS: string;
  _baseURLAPPS: string;

  constructor(private http: HttpClient) {
    this._baseURLPMS = AppConstants.baseURLPMS;
    this._baseURLAPPS = AppConstants.baseURLAPPS;
  }

  // SAAS
  // public getTemplates(type): Observable<any> {
  //   return this.http.get("http://saasadmin.encoress.com/saasadmin/pms/v1/templates/" + type);
  // }

  public getTemplates(userId, status): Observable<any> {
    return this.http.get(this._baseURLPMS + "v1/reviews/users/" + userId + "/" + status);
  }

  public getTemplatesUntouched(type): Observable<any> {
    return this.http.get(this._baseURLAPPS + "v1/templates/" + type);
  }

  public getTemplatesTouched(type): Observable<any> {
    return this.http.get(this._baseURLPMS + "v1/templates/" + type);
  }

  // Template Edit By Manager
  public editTemplate(data): Observable<any> {
    return this.http.put(this._baseURLPMS + "v1/reviews", {
      data
    }, { observe: "response" });
  }

  public rejectRequest(data): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: { data }
    };
    return this.http.delete(this._baseURLPMS + "v1/reviews",
      options);
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
}
