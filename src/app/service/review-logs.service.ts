import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewLogsService {

  _baseURLPMS: string;

  constructor(private httpClient: HttpClient) {
    this._baseURLPMS = AppConstants.baseURLPMS;
  }

  public getAllOpenReviews(): Observable<any> {
    return this.httpClient.get(this._baseURLPMS + "v1/reviews/status/open");
  }

  public getLogs(reviewType, userId, reviewYear): Observable<any> {
    return this.httpClient.get(this._baseURLPMS + "v1/reviews/" + reviewType + "/logs/" + userId + "/" + reviewYear);
  }

}
