import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { ReviewService } from 'src/app/service/review.service';
import { DataService } from 'src/app/service/data.service';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { CONSTANTS, FUNCTIONS } from 'src/app/variable-constants';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment'
import { FormService } from 'src/app/service/form.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styles: [``]
})

export class ReviewComponent implements OnInit, OnDestroy {
  @ViewChild('noManagerModal', { static: true }) noManagerRef: ModalDirective;
  isEverythingSelected = false;
  isAtleastOnceSelected = false;
  status: string;
  searchText: string;
  p: number = 1;
  currentDate = new Date();
  date: string;
  tabNumber: number = 1;
  type;
  userID;
  userDetails;
  _isEverythingChecked = false;
  modalRef: BsModalRef;
  noManager = [];
  isDesc: boolean;
  column: string;
  direction: number;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  modalStatus;
  statusMessage: string;
  initiated = [];
  checkBoxHide = false;
  form: FormGroup;

  reviewType;
  reviewEndDate: Date = new Date();
  minDate: Date = new Date();

  constructor(
    private titleService: Title,
    private fb: FormBuilder,
    private formservice: FormService,
    public spinner: NgxSpinnerService,
    private route: Router,
    private datePipe: DatePipe,
    private data: DataService,
    private modalService: BsModalService,
    private review: ReviewService
  ) {
    this.titleService.setTitle("Review Initiation");
  }

  trackByFnR(index, row) {
    return row.userId
  }

  search(event) {
    if (event == '' || event == undefined) {
      this.checkBoxHide = false;
    }
    else {
      this.checkBoxHide = true;
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  closeModal(template: TemplateRef<any>) {
    if (this.modalStatus == 'success') {
      this.modalRef.hide();
      window.location.reload();
    } else {
      this.modalRef.hide();
    }
  }

  sortBy(property) {
    this.isDesc = !this.isDesc;
    this.column = property;
    this.direction = this.isDesc ? -1 : 1;
  }

  ngOnInit() {
    this.form = this.fb.group({
      rows: this.fb.array([])
    });
    this.userDetails = CONSTANTS.USER_DETAILS;
    if (this.userDetails) {
      this.userID = this.userDetails.userId;
    }
    this.date = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')
  }

  getTabNumber(value) {
    this.tabNumber = value;
    this.isAtleastOnceSelected = false;
    this._isEverythingChecked = false;
    this.p = 1;
    this.searchText = '';
    this.isEverythingSelected = false;
    let rows = <FormArray>this.form.get('rows');
    while (rows.length !== 0) {
      rows.removeAt(0)
    }
    if (value == 1) {
      this.reviewType = CONSTANTS.REVIEW_TYPE_CONFIRMATION;
    } else if (value == 2) {
      this.reviewType = CONSTANTS.REVIEW_TYPE_MIDYEAR;
    } else if (value == 3) {
      this.reviewType = CONSTANTS.REVIEW_TYPE_ANNUAL;
    } else if (value == 4) {
      this.reviewType = CONSTANTS.REVIEW_TYPE_PIP;
    }
    this.spinner.show();
    this.review.getEmployees(this.reviewType).subscribe((data) => {
      if (data) {
        if (data.data) {
          this.patchValues(data.data, value);
        }
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  patchValues(data, reviewId) {
    let rows = <FormArray>this.form.get('rows');
    while (rows.length !== 0) {
      rows.removeAt(0)
    }
    // var date = "06";
    // var month = moment(new Date()).add(1, 'month').format('MMM');
    // var year = moment(new Date()).format('YYYY');
    // var newDate = date + "-" + month + "-" + year;
    this.reviewEndDate = new Date();
    this.reviewEndDate.setDate(6);
    this.reviewEndDate.setMonth(this.reviewEndDate.getMonth() + 1);
    if (this.reviewEndDate.getMonth() == 11) {
      this.reviewEndDate.setFullYear(this.reviewEndDate.getFullYear() + 1);
    }
    data.forEach((x, index) => {
      rows.push(this.fb.group({
        checkbox_value: null,
        uid: (index + 1) * 7,
        userId: x.userId,
        reviewId: reviewId,
        reviewData: null,
        status: null,
        rating: null,
        designation: x.designation,
        reviewType: FUNCTIONS.REVIEWTYPE(reviewId),
        manager: x.reportingManagerResponse,
        name: x.firstName + ' ' + x.lastName,
        reviewStartDate: this.date,
        reviewEndDate: this.reviewEndDate,
        isDisabled: true
      }));
    });
    this.sortBy('reviewStartDate');
  }

  injectReportingManager(data) {
    if (data) {
      return this.formservice.createFormGroup(data);
    } else {
      return null
    }
  }

  // setDate(event, uid) {
  //   for (let l = 0; l < this.list.length; l++) {
  //     if (this.list[l].uid == uid) {
  //       let date = this.datePipe.transform(event, 'dd-MMM-yyyy');
  //       let rows = <FormControl>this.form.get(`rows.${l}.reviewEndDate`);
  //       rows.setValue(date);
  //     }
  //   }
  // }

  get list() {
    return this.form.get('rows').value;
  }

  trackByFn(index, employee) {
    return employee.uid;
  }

  checkEmployees(event, employee) {
    let check = event.target.checked;
    this.isEverythingSelected = false;
    let uid = employee.uid;
    if (event.target.checked) {
      for (let l = 0; l < this.list.length; l++) {
        if (this.list[l].uid == uid) {
          this.form.get(`rows.${l}.isDisabled`).setValue(false);
        }
      }
    }
    else {
      for (let l = 0; l < this.list.length; l++) {
        if (this.list[l].uid == uid) {
          this.form.get(`rows.${l}.isDisabled`).setValue(true);
        }
      }
    }
    for (let l = 0; l < this.list.length; l++) {
      if (this.list[l].uid == uid) {
        let rows = <FormControl>this.form.get(`rows.${l}.checkbox_value`);
        rows.setValue(check);
      }
    }
    if (this.checkIfAtleastOnceChecked()) {
      this.isAtleastOnceSelected = true;
    } else {
      this.isAtleastOnceSelected = false;
    }

    let checked = this.checkIfAllChecked();
    if (checked) {
      this.isEverythingSelected = true;
    }
  }

  checkIfAtleastOnceChecked() {
    let checked = this.list.some(data => { return data.checkbox_value; });
    return checked;
  }

  checkIfAllChecked() {
    let data = this.list;
    let VAULT = [];
    data.forEach(element => {
      if (element.checkbox_value) {
      } else {
        VAULT.push(element);
      }
    });
    if (VAULT.length > 0) {
      return false
    } else {
      return true;
    }
  }

  checkAllEmployees(type, event) {
    if (event.target.checked) {
      this.isEverythingSelected = true;
      this.isAtleastOnceSelected = true;
      for (let m = 0; m < this.list.length; m++) {
        this.form.get(`rows.${m}.isDisabled`).setValue(false);
        this.form.get(`rows.${m}.checkbox_value`).setValue(true);
      }
    } else {
      this.isEverythingSelected = false;
      this.isAtleastOnceSelected = false;
      for (let m = 0; m < this.list.length; m++) {
        this.form.get(`rows.${m}.isDisabled`).setValue(true);
        this.form.get(`rows.${m}.checkbox_value`).setValue(false);
      }
    }
  }

  initiateEmployee(modal) {
    if (this.list) {
      this.initiated = [];
      this.noManager = [];
      let payload = JSON.parse(JSON.stringify(this.list));
      payload = payload.filter(data => { return data.checkbox_value == true; });
      payload.forEach((element) => {
        element.reviewEndDate = this.datePipe.transform(element.reviewEndDate, 'yyyy-MM-dd');
        if (element.manager) {
          this.initiated.push(element)
        } else {
          this.noManager.push(element);
        }
      });

      if (this.initiated.length > 0) {
        let employees = { performanceReviewRequests: this.initiated };
        this.spinner.show();
        this.review.initiateEmployees(employees).subscribe((data: any) => {
          this.spinner.hide();
          this.modalStatus = 'success';
          if (this.noManager.length > 0) {
            this.openModal(modal);
          } else {
            this.statusMessage = CONSTANTS.REVIEW_INITIATION_SUCCESS;
            this.status = CONSTANTS.SUCCESS;
            setTimeout(() => {
              if (this.noManager.length > 0) {
                this.closeModal(modal);
              }
              window.location.reload();
            }, 2000);
          }
        }, error => {
          this.statusMessage = CONSTANTS.FAILURE;
          this.status = CONSTANTS.FAILURE;
          this.spinner.hide();
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        })
      } else {
        if (this.noManager.length > 0) {
          this.openModal(modal)
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.hide()
    }
  }
}
