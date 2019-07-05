import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  _baseURL: string;

  constructor(private http: HttpClient) {
    this._baseURL = AppConstants.baseURLPMS;
  }

  //Employee Review
  public findAllReviewInitiatedRevieweesByReviewerUserId(userId, status): Observable<any> {
    //return this.http.get(this._baseURL + "v1/reviews/users/reviewers/" + userId + "/status/" + status);
    return this.http.get(this._baseURL + "v1/reviews/reviewers/" + userId + "/" + status);
  }

  public findAllReviewProcessedRevieweesByReviewerUserId(userId, status): Observable<any> {
    //return this.http.get(this._baseURL + "v1/reviews/users/reviewers/" + userId + "/status/" + status);
    return this.http.get(this._baseURL + "v1/reviews/appraisers/" + userId + "/" + status);
  }

  // Initiate Review
  public getEmployees(type): Observable<any> {
    return this.http.get(this._baseURL + "v1/reviews/" + type);
  }

  // HR getByStatus
  public getByStatus(reviewType, status): Observable<any> {
    return this.http.get(this._baseURL + "v1/reviews/" + reviewType + "/" + status);
  }

  public initiateEmployees(data): Observable<any> {
    return this.http.post(this._baseURL + "v1/reviews", {
      data
    })
  }

  public updateAllReviews(data): Observable<any> {
    return this.http.put(this._baseURL + "v1/reviews", {
      data
    }, { observe: "response" });
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
