import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewHistoryService {
  _baseURL: string;

  constructor(private http: HttpClient) {
    this._baseURL = AppConstants.baseURLPMS;
  }

  public getSelfReviewHistory(reviewType, userId): Observable<any> {
    return this.http.get(this._baseURL + "v1/reviews/" + reviewType + "/users/" + userId);
  }

  public getEmployeeReviewHistory(userId): Observable<any> {
    return this.http.get(this._baseURL + "v1/reviews/reviewers/" + userId);
  }
}
