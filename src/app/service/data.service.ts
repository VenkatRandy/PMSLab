import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // private dataSource = new BehaviorSubject('');
  // currentData = this.dataSource.asObservable();

  // private length = new BehaviorSubject('');
  // formLength = this.length.asObservable();

  // private prev = new BehaviorSubject('');
  // prevValue = this.prev.asObservable();

  private category = new BehaviorSubject('');
  categoryList = this.category.asObservable();

  private submitted = new BehaviorSubject(false);
  _isSubmitted = this.submitted.asObservable();

  private comments = new BehaviorSubject('');
  comment = this.comments.asObservable();

  private rating = new BehaviorSubject(0);
  lRating = this.rating.asObservable();

  private error = new BehaviorSubject(0);
  errorCode = this.error.asObservable();

  private selected = new BehaviorSubject(null);
  selectedRole = this.selected.asObservable();

  private search = new BehaviorSubject(null);
  searchText = this.search.asObservable();

  private categoryRequests = new BehaviorSubject(null);
  categoryReq = this.categoryRequests.asObservable();

  private accordian = new BehaviorSubject(false);
  _isAccordianChanged = this.accordian.asObservable();

  private screenSize = new BehaviorSubject(false);
  _isMobileView = this.screenSize.asObservable();

  // private temp = new BehaviorSubject('');
  // template = this.temp.asObservable();

  constructor() { }

  setScreen(data: boolean) {
    this.screenSize.next(data);
  }

  setAccordian(data: boolean) {
    this.accordian.next(data);
  }

  setCategoryRequests(data: any) {
    this.categoryRequests.next(data);
  }

  // setUserData(data: any) {
  //   this.dataSource.next(data)
  // }

  // setFormLength(data: any) {
  //   this.length.next(data);
  // }

  // setPrevValue(data: any) {
  //   this.prev.next(data);
  // }

  setCategoryList(data: any) {
    this.category.next(data);
  }

  setSubmitted(data: any) {
    this.submitted.next(data);
  }

  // setComment(data: any) {
  //   this.comments.next(data);
  // }

  // setRating(data: any) {
  //   this.rating.next(data);
  // }

  setErrorCode(data: any) {
    this.error.next(data);
  }

  setSelectedRole(data: any) {
    this.selected.next(data);
  }

  setSearchText(data: any) {
    this.search.next(data);
  }

  // setTemplateValue(data: any) {
  //   this.temp.next(data);
  // }
}
