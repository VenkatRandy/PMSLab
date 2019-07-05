import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { CONSTANTS, FUNCTIONS } from 'src/app/variable-constants';
import { Router } from '@angular/router';
import { TemplateService } from 'src/app/service/template.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataService } from 'src/app/service/data.service';
import { PopoverDirective } from 'ngx-bootstrap/popover/public_api';

@Component({
  selector: 'app-my-review',
  templateUrl: './my-review.component.html',
  styles: []
})
export class MyReviewComponent implements OnInit, OnDestroy {
  reviewType = 'Confirmation Review Template';
  reviewList: any;
  userDetails;
  userId;
  payload;
  p: number = 1;
  currentRoute;
  status;
  selectedType = 'review';
  reviewRef: BsModalRef | null;
  createList = []
  _isTemplateAvailable: boolean = false;
  roleType = [];
  level;
  reviewId;
  json;
  reviewRateValue;
  reviewRate;
  weightage;
  reviewerResponse;
  count = 0;
  popRef: PopoverDirective;

  constructor(private dataService: DataService, private modalservice: BsModalService, private titleService: Title, private route: Router, private template: TemplateService, private spinner: NgxSpinnerService) {
    this.titleService.setTitle("My Review");
  }

  ngOnInit() {
    localStorage.removeItem('reviewTypeFromMine');
    localStorage.removeItem('reviewTypeFromEmployee');
    this.currentRoute = CONSTANTS.CURRENT_ROUTE;
    this.userDetails = CONSTANTS.USER_DETAILS;
    this.userId = this.userDetails.userId;
    this.getReviews(this.selectedType);
    this.reviewerResponse = CONSTANTS.REVIEWER_RESPONSE;
  }

  log(event: boolean) {
    if (this.popRef) {
      this.popRef.hide();
    }
  }

  open(pop: PopoverDirective) {
    this.count = 1;
    this.popRef = pop;
    pop.show();
  }

  getReviews(value) {
    var status;
    if (value == 'review') {
      status = CONSTANTS.REVIEW_PENDING
    } else {
      status = CONSTANTS.REVIEW_STATUS_OPEN
    }
    this.spinner.show();
    this.payload = undefined;
    this.template.getTemplates(this.userId, status).subscribe(data => {
      if (data.data.performanceReviewResponses) {
        if (value == 'review') {
          for (let p = 0; p < data.data.performanceReviewResponses.length; p++) {
            if (data.data.performanceReviewResponses[p]) {
              if (data.data.performanceReviewResponses[p].status == CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_EMPLOYEE
                || data.data.performanceReviewResponses[p].status == CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_EMPLOYEE) {
                this.payload = data.data.performanceReviewResponses[p];
              }
            }
          }
          if (this.payload) {
            this.resetIfSelfChecked();
          }
        } else {
          for (let p = 0; p < data.data.performanceReviewResponses.length; p++) {
            if (data.data.performanceReviewResponses[p]) {
              if (
                data.data.performanceReviewResponses[p].status != CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_EMPLOYEE
                && data.data.performanceReviewResponses[p].status != CONSTANTS.REVIEW_STATUS_REVIEW_INITIATED
                && data.data.performanceReviewResponses[p].status != CONSTANTS.REVIEW_STATUS_CLOSED
                && data.data.performanceReviewResponses[p].status != CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_EMPLOYEE
              ) {
                this.payload = data.data.performanceReviewResponses[p];
              }
            }
          }
          if (this.payload) {
            this.resetIfSelfChecked();
          }
        }
      }
      this.spinner.hide();
    }, error => {
      this.payload = undefined;
      this.spinner.hide();
    });
  }

  resetIfSelfChecked() {
    if (FUNCTIONS.TRIM(this.payload.reviewType) == FUNCTIONS.TRIM(CONSTANTS.REVIEW_TYPE_CONFIRMATION)) {
      if (this.reviewerResponse) {
        if (this.reviewerResponse.confirmationReviewerResponse) {
          if (!this.reviewerResponse.confirmationReviewerResponse.self) {
            this.payload = undefined;
          }
        }
      }
    } else if (FUNCTIONS.TRIM(this.payload.reviewType) == FUNCTIONS.TRIM(CONSTANTS.REVIEW_TYPE_MIDYEAR)) {
      if (this.reviewerResponse) {
        if (this.reviewerResponse.midyearReviewerResponse) {
          if (!this.reviewerResponse.midyearReviewerResponse.self) {
            this.payload = undefined;
          }
        }
      }
    } else if (FUNCTIONS.TRIM(this.payload.reviewType) == FUNCTIONS.TRIM(CONSTANTS.REVIEW_TYPE_ANNUAL)) {
      if (this.reviewerResponse) {
        if (this.reviewerResponse.annualReviewerResponse) {
          if (!this.reviewerResponse.annualReviewerResponse.self) {
            this.payload = undefined;
          }
        }
      }
    } else if (FUNCTIONS.TRIM(this.payload.reviewType) == FUNCTIONS.TRIM(CONSTANTS.REVIEW_TYPE_PIP)) {
      if (this.reviewerResponse) {
        if (this.reviewerResponse.pipReviewerResponse) {
          if (!this.reviewerResponse.pipReviewerResponse.self) {
            this.payload = undefined;
          }
        }
      }
    }
  }

  optionChanged(value) {
    this.selectedType = value;
    this.getReviews(this.selectedType);
  }

  start() {
    if (this.payload.reviewData) {
      let content = {
        id: this.payload.id,
        reviewId: this.payload.reviewId,
        userId: this.payload.userId,
        roleType: null,
        index: null,
        status: this.payload.status,
        reviewStartDate: this.payload.reviewStartDate,
        reviewEndDate: this.payload.reviewEndDate,
        reviewData: JSON.stringify(this.payload.reviewData),
        route: this.currentRoute
      }
      localStorage.setItem('reviewTypeFromMine', this.payload.reviewId);
      sessionStorage.setItem('content', encodeURIComponent(JSON.stringify(content)));
      this.route.navigate(['review']);
    } else {
      console.log('Something Went Wrong');
    }
  }

  view(review: TemplateRef<any>) {
    if (this.payload) {
      let reviewData = JSON.parse(this.payload.reviewData);
      if (reviewData) {
        this.json = reviewData.data.templateResponses[0];
        if (this.json) {
          this.createList = [];
          this.reviewRateValue = this.json.employeeRating;
          this.setReviewRate(this.reviewRateValue);
          this.addToAccordian(this.json.categoryResponses);
          this.weightage = [];
          for (let index = 0; index < this.createList.length; index++) {
            let categoryName = this.createList[index].title;
            let weightage = this.createList[index].weightage;
            let grp = {
              id: index,
              value: weightage,
              rejected: false,
            }
            if (
              FUNCTIONS.TRIM(categoryName).includes('ratings') ||
              FUNCTIONS.TRIM(categoryName).includes('comments') ||
              FUNCTIONS.TRIM(categoryName).includes('recommendation') ||
              FUNCTIONS.TRIM(categoryName).includes('summary')
            ) {
              grp.rejected = true
            }
            this.weightage.push(grp)
          }
          this._isTemplateAvailable = true;
          this.reviewRef = this.modalservice.show(review, { class: 'modal-lg', ignoreBackdropClick: false })
        } else {
          this._isTemplateAvailable = false;
        }
      }
    }
  }

  setReviewRate(rating) {
    if (rating >= 90) {
      this.reviewRate = 'Outstanding';
    } else if ((rating >= 80) && (rating <= 89)) {
      this.reviewRate = 'Exceed Expectations';
    } else if ((rating >= 60) && (rating <= 79)) {
      this.reviewRate = 'Meets Expectations';
    } else if (rating < 60) {
      this.reviewRate = 'Below Expectations';
    }
  }

  addToAccordian(control) {
    for (let index = 0; index < control.length; index++) {
      let categoryName = control[index].name;
      let weightage = control[index].weightage;
      let grp = {
        id: index,
        title: categoryName,
        rejected: false,
        weightage: weightage,
        content: `Dynamic Group Body - ${this.createList.length + 1}`
      }
      if (
        FUNCTIONS.TRIM(categoryName).includes('ratings') ||
        FUNCTIONS.TRIM(categoryName).includes('comments') ||
        FUNCTIONS.TRIM(categoryName).includes('recommendation') ||
        FUNCTIONS.TRIM(categoryName).includes('summary')
      ) {
        grp.rejected = true
      }
      this.createList.push(grp);
    }
  }

  // Get_______________________________________________
  getTableValueResponses(weightageAgainstKRA, tableResponse, rows) {
    if (weightageAgainstKRA) {
      let data = [];
      let tableHeaderResponses = tableResponse.tableHeaderResponses;
      for (let v = 0; v < rows.tableValueResponses.length; v++) {
        let colName = tableHeaderResponses[v].columnName;
        let columnName = FUNCTIONS.TRIM(colName);
        if (columnName == 'weightage') {

        } else {
          data.push(rows.tableValueResponses[v]);
        }
      }
      return data;
    } else {
      return rows.tableValueResponses;
    }
  }

  getTableColumns(weightageAgainstKRA, tableResponse) {
    if (weightageAgainstKRA) {
      let data = [];
      let tableHeader = tableResponse.tableHeaderResponses;
      for (let h = 0; h < tableHeader.length; h++) {
        let colName = tableHeader[h].columnName;
        let columnName = FUNCTIONS.TRIM(colName);
        if (columnName == 'weightage') {

        } else {
          data.push(tableHeader[h]);
        }
      }
      return data;
    } else {
      return tableResponse.tableHeaderResponses;
    }
  }

  ngOnDestroy() {
    if (this.reviewRef) {
      this.reviewRef.hide();
    }
  }
}
