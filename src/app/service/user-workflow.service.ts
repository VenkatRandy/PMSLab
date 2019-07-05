import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserWorkflowService {
  _baseURLPMS: string;

  constructor(private httpClient: HttpClient) {
    this._baseURLPMS = AppConstants.baseURLPMS;
  }

  public getAllUsers(): Observable<any> {
    return this.httpClient.get(this._baseURLPMS+"v1/users");
  }

  public getReviewees(userId): Observable<any> {
    return this.httpClient.get(this._baseURLPMS + "v1/reviews/levels/" + userId);
  }

  public getAllLevels(userId, level): Observable<any> {
    return this.httpClient.get(this._baseURLPMS + "v1/reviews/reviewers/" + userId + "/levels/" + level);
  }

  public updateLevels(data): Observable<any> {
    return this.httpClient.put(this._baseURLPMS + "v1/levels", {
      data
    }, { observe: "response" });
  }


}
