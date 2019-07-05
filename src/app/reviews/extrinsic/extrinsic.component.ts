import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';
import { FormService } from 'src/app/service/form.service';
import { Title } from '@angular/platform-browser';
import { FUNCTIONS, CONSTANTS } from 'src/app/variable-constants';
import { NgScrollbar } from 'ngx-scrollbar';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/service/data.service';

class ROLE {
  Reviewee: boolean;
  Reviewer: boolean;
  AppraiserI: boolean;
  AppraiserII: boolean;
}

@Component({
  selector: 'app-extrinsic',
  templateUrl: './extrinsic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
  .card-block {
    min-height: 220px;
  }
  .hbd{
    border-color: #496f96;
  }
  `]
})
export class ExtrinsicComponent implements OnInit, AfterViewInit {
  userId;
  EXTRINSIC_DATA;
  REVIEW;
  accordianList = [];
  weightage;
  _isOnlyOneChecked: boolean;
  _isAtleastThreeChecked: boolean;
  roleType: ROLE = { Reviewee: false, Reviewer: false, AppraiserI: false, AppraiserII: false };
  onlyOpen: number;
  revieweeRate;
  revieweeRating;
  reviewerRate;
  reviewerRating
  appraiseriRate;
  appraiseriRating;
  appraiseriiRate;
  appraiseriiRating;
  reviewId: number;

  level1ReviewerName: string;
  level2ReviewerName: string;
  level3ReviewerName: string;
  revieweeName: string;

  submittedObj;


  @ViewChild('scrollable', { static: true }) scrollRef: NgScrollbar;

  constructor(
    private form: FormService,
    private storage: StorageService,
    private route: ActivatedRoute,
    private title: Title,
    private spinner: NgxSpinnerService,
    private data: DataService
  ) {
    this.title.setTitle('Review Overview');
  }

  ngAfterViewInit() {
    // this.scrollRef.scrollToLeft();
  }

  log(index: number, event: boolean) {
    this.data.setAccordian(event);
    // console.log(index, ` Accordion has been ${event ? 'opened' : 'closed'}`);
    if (event) {
      this.onlyOpen = index;
    } else {
      this.onlyOpen = null;
    }
  }

  ngOnInit() {
    this.onlyOpen = 0;
    this.route.queryParams.subscribe(param => {
      this.userId = param.ref ? atob(param.ref) : null
    });
    if (this.userId) {
      this.spinner.show();
      this.EXTRINSIC_DATA = this.storage.get(this.userId, 'Session', false);
      if (this.EXTRINSIC_DATA) {
        this.reviewId = this.EXTRINSIC_DATA.reviewId;
        if (this.EXTRINSIC_DATA.name) {
          this.level1ReviewerName = this.EXTRINSIC_DATA.name.level1ReviewerName;
          this.level2ReviewerName = this.EXTRINSIC_DATA.name.level2ReviewerName;
          this.level3ReviewerName = this.EXTRINSIC_DATA.name.level3ReviewerName;
          this.revieweeName = this.EXTRINSIC_DATA.name.revieweeName;
        }
        if (this.EXTRINSIC_DATA.type == 'response') {
          if (this.EXTRINSIC_DATA.reviewData) {
            let data = JSON.parse(this.EXTRINSIC_DATA.reviewData);
            let reviewData;
            if (typeof data == 'string') {
              reviewData = JSON.parse(data).data;
            } else {
              reviewData = data.data;
            }
            if (reviewData) {
              let templateResponses = reviewData.templateResponses[0];
              if (templateResponses) {
                if (1) {
                  this.submittedObj = templateResponses.submitted;
                  let cnt = 0;
                  if (this.submittedObj.employee != null) {
                    this.roleType.Reviewee = true;
                    cnt += 1;
                  }
                  if (this.submittedObj.level3 != null) {
                    this.roleType.AppraiserII = true;
                    cnt += 1;
                  }
                  if (this.submittedObj.level2 != null) {
                    this.roleType.AppraiserI = true;
                    cnt += 1;
                  }
                  if (this.submittedObj.level1 != null) {
                    this.roleType.Reviewer = true;
                    cnt += 1;
                  }
                  if (cnt >= 2) {
                    this._isAtleastThreeChecked = true;
                  } else {
                    this._isOnlyOneChecked = true;
                  }
                }
                this.REVIEW = this.form.convertTo(templateResponses);
                let categoryRequests = this.REVIEW.categoryRequests;
                if (categoryRequests) {
                  this.calculateRating(templateResponses);
                  this.addToAccordian(categoryRequests);
                  this.spinner.hide();
                  this.weightage = [];
                  for (let index = 0; index < this.accordianList.length; index++) {
                    let categoryName = this.accordianList[index].title;
                    let weightage = this.accordianList[index].weightage;
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
                }
              } else {
                this.spinner.hide();
              }
            } else {
              this.spinner.hide();
            }
          } else {
            this.spinner.hide();
          }
        } else if (this.EXTRINSIC_DATA.type == 'request') {
          if (this.EXTRINSIC_DATA.reviewData) {
            let reviewData = JSON.parse(this.EXTRINSIC_DATA.reviewData).data;
            if (reviewData) {
              this.REVIEW = reviewData.templateResponses[0];
              let categoryRequests = this.REVIEW.categoryRequests;
              if (categoryRequests) {
                this.addToAccordian(categoryRequests);
                this.spinner.hide();
                this.weightage = [];
                for (let index = 0; index < this.accordianList.length; index++) {
                  let categoryName = this.accordianList[index].title;
                  let weightage = this.accordianList[index].weightage;
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
              } else {
                this.spinner.hide();
              }
            } else {
              this.spinner.hide();
            }
          } else {
            this.spinner.hide();
          }
        }
      } else {
        this.spinner.hide();
      }
    } else {
      this.spinner.hide();
    }
  }

  // processData(categoryRequests) {

  // }

  calculateRating(reviewData) {
    let revieweeRating = reviewData.employeeRating;
    let reviewerRating = reviewData.level1Rating;
    let appraiserIRating = reviewData.level2Rating;
    let appraiserIIRating = reviewData.level3Rating;
    if (revieweeRating) {
      this.revieweeRate = revieweeRating;
      this.revieweeRating = this.processRating(this.revieweeRate);
    } else {
      this.revieweeRate = 0;
      this.revieweeRating = this.processRating(this.revieweeRate);
    }
    if (reviewerRating) {
      this.reviewerRate = reviewerRating;
      this.reviewerRating = this.processRating(this.reviewerRate);
    } else {
      this.reviewerRate = 0;
      this.reviewerRating = this.processRating(this.reviewerRate);
    }
    if (appraiserIRating) {
      this.appraiseriRate = appraiserIRating;
      this.appraiseriRating = this.processRating(this.appraiseriRate);
    } else {
      this.appraiseriRate = 0;
      this.appraiseriRating = this.processRating(this.appraiseriRate);
    }
    if (appraiserIIRating) {
      this.appraiseriiRate = appraiserIIRating;
      this.appraiseriiRating = this.processRating(this.appraiseriiRate);
    } else {
      this.appraiseriiRate = 0;
      this.appraiseriiRating = this.processRating(this.appraiseriiRate);
    }
  }

  processRating(rate) {
    if (this.reviewId == 1) {
      if (rate == 4) {
        return CONSTANTS.RATING_OUTSTANDING;
      } else if (rate == 3) {
        return CONSTANTS.RATING_EXCEED;
      } else if (rate == 2) {
        return CONSTANTS.RATING_MEET;
      } else if (rate == 1) {
        return CONSTANTS.RATING_BELOW;
      }
    } else if (this.reviewId == 3) {
      if (rate >= 90) {
        return CONSTANTS.RATING_OUTSTANDING;
      } else if ((rate >= 80) && (rate <= 89)) {
        return CONSTANTS.RATING_EXCEED;
      } else if ((rate >= 60) && (rate <= 79)) {
        return CONSTANTS.RATING_MEET;
      } else if (rate < 60) {
        return CONSTANTS.RATING_BELOW;
      }
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
        content: `Dynamic Group Body - ${this.accordianList.length + 1}`
      }
      if (
        FUNCTIONS.TRIM(categoryName).includes('ratings') ||
        FUNCTIONS.TRIM(categoryName).includes('comments') ||
        FUNCTIONS.TRIM(categoryName).includes('recommendation') ||
        FUNCTIONS.TRIM(categoryName).includes('summary')
      ) {
        grp.rejected = true
      }
      this.accordianList.push(grp);
    }
  }

  // Get_______________________________________________
  getTableValueRequests(weightageAgainstKRA, tableRequest, rows) {
    if (weightageAgainstKRA) {
      let data = [];
      let tableHeaderRequests = tableRequest.tableHeaderRequests;
      for (let v = 0; v < rows.tableValueRequests.length; v++) {
        let colName = tableHeaderRequests[v].columnName;
        let columnName = FUNCTIONS.TRIM(colName);
        if (columnName == 'weightage') {

        } else {
          data.push(rows.tableValueRequests[v]);
        }
      }
      return data;
    } else {
      return rows.tableValueRequests;
    }
  }

  getTableColumns(weightageAgainstKRA, tableRequest) {
    if (weightageAgainstKRA) {
      let data = [];
      let tableHeader = tableRequest.tableHeaderRequests;
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
      return tableRequest.tableHeaderRequests;
    }
  }

  /* trackBy */
  trackByReviewee(idx, data) {
    return data.id;
  }
  trackByReviewer(idx, data) {
    return data.id;
  }
  trackByAppi(idx, data) {
    return data.id;
  }
  trackByAppii(idx, data) {
    return data.id;
  }
}
