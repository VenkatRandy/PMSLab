import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ReviewHistoryService } from '../service/review-history.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CONSTANTS } from '../variable-constants';
import { Title } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormService } from '../service/form.service';
import { TemplateService } from '../service/template.service';
import { StorageService } from '../service/storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-review-history',
  templateUrl: './review-history.component.html',
  styleUrls: ['./review-history.component.scss']
})
export class ReviewHistoryComponent implements OnInit, OnDestroy {
  userDetails;
  self: any = 1;
  reviewId: any = 1;
  p: number = 1;
  selfHistory: boolean = false;
  selfReviewHistoryForm: FormGroup;
  revieweesReviewHistoryForm: FormGroup;
  list: any = [];
  confirmationRevieweeList: any = [];
  midYearRevieweeList: any = [];
  pipRevieweeList: any = [];
  annualRevieweeList: any = [];
  searchText = '';
  oldReviewId: number = 0;
  count = 1;
  userId;
  revieweeData;
  isDesc: boolean;
  column: string;
  direction: number;
  commentHolder: string;
  commentRef: BsModalRef | null;
  selectedData;
  statusMessage: string;
  status: string;
  yearList = [];
  selectedYear;

  constructor(
    private storage: StorageService,
    private template: TemplateService,
    private form: FormService,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private reviewHistoryService: ReviewHistoryService,
    private spinner: NgxSpinnerService,
    private modalservice: BsModalService,
    private date: DatePipe
  ) {
    this.titleService.setTitle("Review History");
  }

  ngOnInit() {
    this.selectedYear = new Date().getFullYear();
    localStorage.removeItem('reviewData');
    this.count = 1;
    this.route.queryParams.subscribe(params => {
      this.self = params.self,
        this.reviewId = params.review_id;
      this.init(this.self, this.reviewId);
      this.getRevieweeList(this.self, this.reviewId);
      if (this.reviewId != this.oldReviewId) {
        this.searchText = '';
      }
      this.oldReviewId = this.reviewId;
    });
  }

  filterYear() {
    if (this.selfHistory) {

    } else {
      this.getReview(this.selectedYear);
    }
  }

  init(self, reviewId) {
    this.userDetails = CONSTANTS.USER_DETAILS;
    this.userId = this.userDetails.userId;
    if (self == 1 && reviewId != null) {
      this.selfHistory = true;
      this.spinner.show();
      let reviewType;
      if (reviewId == 1) {
        reviewType = CONSTANTS.REVIEW_TYPE_CONFIRMATION;
      } else if (reviewId == 2) {
        reviewType = CONSTANTS.REVIEW_TYPE_MIDYEAR;
      } if (reviewId == 3) {
        reviewType = CONSTANTS.REVIEW_TYPE_ANNUAL;
      } if (reviewId == 4) {
        reviewType = CONSTANTS.REVIEW_TYPE_PIP;
      }

      this.reviewHistoryService.getSelfReviewHistory(reviewType, this.userId).subscribe(
        (data) => {
          this.selfReviewHistoryForm = this.fb.group({
            selfHistory: this.fb.array([])
          });
          this.list = data.data.performanceReviewResponses;
          this.patchValuesForSelfReviewHistory(this.list);
          this.spinner.hide();
        }, error => {
          this.selfReviewHistoryForm = undefined;
          this.spinner.hide();
        }
      );
    }
  }

  patchValuesForSelfReviewHistory(response) {
    let rows = this.selfReviewHistoryForm.get('selfHistory') as FormArray;
    response.forEach((x, idx) => {
      if (x.reviewData) {
        rows.push(this.fb.group({
          level1ReviewerName: x.level1ReviewerName,
          level2ReviewerName: x.level2ReviewerName,
          level3ReviewerName: x.level3ReviewerName,
          reviewType: x.reviewType,
          reviewStartDate: x.reviewStartDate,
          reviewEndDate: x.reviewEndDate,
          status: x.status,
          rating: x.rating,
          reviewData: x.reviewData,
          id: x.id,
          userId: x.userId
        }));
      }
    });
    this.getYears(this.reviewHistorySelf.value);
    this.sortBy('reviewEndDate');
  }

  get reviewHistorySelf() {
    if (this.selfReviewHistoryForm) {
      return this.selfReviewHistoryForm.get('selfHistory') as FormArray;
    } else {
      return null;
    }
  }

  get reviewHistoryReviewees() {
    return this.revieweesReviewHistoryForm.get('reviewees') as FormArray;
  }

  pathchValuesForRevieweesReviewHistory(response) {
    var rows = this.revieweesReviewHistoryForm.get('reviewees') as FormGroup;
    if (response.data.confirmationRevieweeResponses != null) {
      let confirmation = this.filterResponses(response.data.confirmationRevieweeResponses);
      rows.addControl('confirmationRevieweeResponses', this.addFormArray(confirmation));
    }
    if (response.data.confirmationRevieweeResponses == null) {
      rows.addControl('confirmationRevieweeResponses', this.fb.control(null));
    }
    if (response.data.midYearRevieweeResponses != null) {
      let midyear = this.filterResponses(response.data.midYearRevieweeResponses);
      rows.addControl('midYearRevieweeResponses', this.addFormArray(midyear));
    }
    if (response.data.midYearRevieweeResponses == null) {
      rows.addControl('midYearRevieweeResponses', this.fb.control(null));
    }

    if (response.data.pipRevieweeResponses != null) {
      let pip = this.filterResponses(response.data.pipRevieweeResponses);
      rows.addControl('pipRevieweeResponses', this.addFormArray(pip));
    } if (response.data.pipRevieweeResponses == null) {
      rows.addControl('pipRevieweeResponses', this.fb.control(null));
    }

    if (response.data.annualRevieweeResponses != null) {
      let annual = this.filterResponses(response.data.annualRevieweeResponses);
      rows.addControl('annualRevieweeResponses', this.addFormArray(annual));
    } if (response.data.annualRevieweeResponses == null) {
      rows.addControl('annualRevieweeResponses', this.fb.control(null));
    }
    this.getYears(this.getOGValuesReviewees());
    this.sortBy('reviewEndDate');
  }

  getYears(data) {
    if (data) {
      if (data.length > 0) {
        this.yearList = [];
        for (let r = 0; r < data.length; r++) {
          let startDate = this.date.transform(data[r].reviewStartDate, 'yyyy');
          let present = this.yearList.some(data => { return data == startDate });
          if (present) {

          } else {
            this.yearList.push(startDate);
          }
        }
        if (this.yearList.length > 0) {
          this.yearList.sort((a, b) => b - a);
          this.selectedYear = this.yearList[0];
        }
      }
    }
  }

  getOGValuesReviewees() {
    if (this.reviewId == 1) {
      return this.revieweesReviewHistoryForm.get(`reviewees.confirmationRevieweeResponses`).value
    } else if (this.reviewId == 2) {
      return this.revieweesReviewHistoryForm.get(`reviewees.midYearRevieweeResponses`).value
    } else if (this.reviewId == 3) {
      return this.revieweesReviewHistoryForm.get(`reviewees.annualRevieweeResponses`).value
    } else if (this.reviewId == 4) {
      return this.revieweesReviewHistoryForm.get(`reviewees.pipRevieweeResponses`).value
    }
  }

  /*
  Filters data based on Workflow
 */
  filterResponses(responses) {
    let name = CONSTANTS.USER_NAME;
    let RESPONSE = [];
    for (let r = 0; r < responses.length; r++) {
      let level1ReviewerName = responses[r].level1ReviewerName;
      let level2ReviewerName = responses[r].level2ReviewerName;
      let level3ReviewerName = responses[r].level3ReviewerName;
      if (name == level1ReviewerName || name == level2ReviewerName || name == level3ReviewerName) {
        RESPONSE.push(responses[r]);
      }
    }
    return RESPONSE;
  }

  addFormArray(data) {
    var formArray = new FormArray([]);
    for (let index = 0; index < data.length; index++) {
      if (data[index].reviewData) {
        var formgroup = new FormGroup({});
        formgroup.addControl('userId', new FormControl(data[index].userId));
        formgroup.addControl('level1ReviewerName', new FormControl(data[index].level1ReviewerName));
        formgroup.addControl('level2ReviewerName', new FormControl(data[index].level2ReviewerName));
        formgroup.addControl('level3ReviewerName', new FormControl(data[index].level3ReviewerName));
        formgroup.addControl('reviewId', new FormControl(data[index].reviewId));
        formgroup.addControl('name', new FormControl(data[index].name));
        formgroup.addControl('reviewType', new FormControl(data[index].reviewType));
        formgroup.addControl('reviewStartDate', new FormControl(data[index].reviewStartDate));
        formgroup.addControl('reviewEndDate', new FormControl(data[index].reviewEndDate));
        formgroup.addControl('status', new FormControl(data[index].status));
        formgroup.addControl('createdDate', new FormControl(data[index].createdDate));
        formgroup.addControl('reviewData', new FormControl(data[index].reviewData));
        formgroup.addControl('rating', new FormControl(data[index].rating));
        formArray.push(formgroup)
      }
    }
    return formArray;
  }


  confirmationRevieweeListFromGroup(selectedYear) {
    if (this.revieweesReviewHistoryForm) {
      var list = this.revieweesReviewHistoryForm.get('reviewees').value.confirmationRevieweeResponses;
      if (list != null) {
        this.confirmationRevieweeList = [];
        for (let index = 0; index < list.length; index++) {
          let startDate = this.date.transform(list[index].reviewStartDate, 'yyyy');
          if (selectedYear == startDate) {
            this.confirmationRevieweeList.push(list[index]);
          }
        }
        return this.confirmationRevieweeList;
      }
    }
    return null;
  }

  midYearRevieweeListFromGroup(selectedYear) {
    if (this.revieweesReviewHistoryForm) {
      var list = this.revieweesReviewHistoryForm.get('reviewees').value.midYearRevieweeResponses;
      if (list != null) {
        this.midYearRevieweeList = [];
        for (let index = 0; index < list.length; index++) {
          let startDate = this.date.transform(list[index].reviewStartDate, 'yyyy');
          if (selectedYear == startDate) {
            this.midYearRevieweeList.push(list[index]);
          }
        }
        return this.midYearRevieweeList;
      }
    }
    return null;
  }

  annualRevieweeListFromGroup(selectedYear) {
    if (this.revieweesReviewHistoryForm) {
      var list = this.revieweesReviewHistoryForm.get('reviewees').value.annualRevieweeResponses;
      if (list != null) {
        this.annualRevieweeList = [];
        for (let index = 0; index < list.length; index++) {
          let startDate = this.date.transform(list[index].reviewStartDate, 'yyyy');
          if (selectedYear == startDate) {
            this.annualRevieweeList.push(list[index]);
          }
        }
        return this.annualRevieweeList;
      }
    }
    return null;
  }

  pipRevieweeListFromGroup(selectedYear) {
    if (this.revieweesReviewHistoryForm) {
      var list = this.revieweesReviewHistoryForm.get('reviewees').value.pipRevieweeResponses;
      if (list != null) {
        this.pipRevieweeList = [];
        for (let index = 0; index < list.length; index++) {
          let startDate = this.date.transform(list[index].reviewStartDate, 'yyyy');
          if (selectedYear == startDate) {
            this.pipRevieweeList.push(list[index]);
          }
        }
        return this.pipRevieweeList;
      }
    }
    return null;
  }

  // confirmationRevieweeListFromGroup() {
  //   if (this.revieweesReviewHistoryForm) {
  //     var list = this.revieweesReviewHistoryForm.get('reviewees').value.confirmationRevieweeResponses;
  //     if (list != null) {
  //       this.confirmationRevieweeList = [];
  //       for (let index = 0; index < list.length; index++) {
  //         this.confirmationRevieweeList.push(list[index]);
  //       }
  //       return this.confirmationRevieweeList;
  //     }
  //   }
  //   return null;
  // }

  // midYearRevieweeListFromGroup() {
  //   if (this.revieweesReviewHistoryForm) {
  //     var list = this.revieweesReviewHistoryForm.get('reviewees').value.midYearRevieweeResponses;
  //     if (list != null) {
  //       this.midYearRevieweeList = [];

  //       for (let index = 0; index < list.length; index++) {
  //         this.midYearRevieweeList.push(list[index]);
  //       }
  //       return this.midYearRevieweeList;
  //     }
  //   }
  //   return null;
  // }

  // pipRevieweeListFromGroup() {
  //   if (this.revieweesReviewHistoryForm) {
  //     var list = this.revieweesReviewHistoryForm.get('reviewees').value.pipRevieweeResponses;
  //     if (list != null) {
  //       this.pipRevieweeList = [];
  //       for (let index = 0; index < list.length; index++) {
  //         this.pipRevieweeList.push(list[index]);
  //       }
  //       return this.pipRevieweeList;
  //     }
  //   }
  //   return null;
  // }

  // annualRevieweeListFromGroup() {
  //   if (this.revieweesReviewHistoryForm) {
  //     var list = this.revieweesReviewHistoryForm.get('reviewees').value.annualRevieweeResponses;
  //     if (list != null) {
  //       this.annualRevieweeList = [];
  //       for (let index = 0; index < list.length; index++) {
  //         this.annualRevieweeList.push(list[index]);
  //       }
  //       return this.annualRevieweeList;
  //     }
  //   }
  //   return null;
  // }

  getRevieweeList(self, reviewId) {
    if (this.count == 1 && self == 0) {
      this.count++;
      this.selfHistory = false;
      this.spinner.show();
      this.reviewHistoryService.getEmployeeReviewHistory(this.userId).subscribe(data => {
        this.spinner.hide();
        this.revieweesReviewHistoryForm = this.fb.group({
          reviewees: this.fb.group({})
        });
        this.pathchValuesForRevieweesReviewHistory(data);
      }, error => {
        this.spinner.hide();
      }
      );

    }
    else if (this.count > 1 && self == 0) {
      this.selfHistory = false;
      this.getReview(this.selectedYear);
    }

    //   this.selfHistory = false;
    //   if (reviewId == 1) {
    //     return this.confirmationRevieweeListFromGroup();
    //   }
    //   else if (reviewId == 2) {
    //     return this.midYearRevieweeListFromGroup();
    //   }
    //   else if (reviewId == 3) {
    //     return this.annualRevieweeListFromGroup();
    //   }
    //   else if (reviewId == 4) {
    //     return this.pipRevieweeListFromGroup();
    //   }
    // }
  }

  getReview(selectedYear) {
    if (this.reviewId == 1) {
      return this.confirmationRevieweeListFromGroup(selectedYear);
    }
    else if (this.reviewId == 2) {
      return this.midYearRevieweeListFromGroup(selectedYear);
    }
    else if (this.reviewId == 3) {
      return this.annualRevieweeListFromGroup(selectedYear);
    }
    else if (this.reviewId == 4) {
      return this.pipRevieweeListFromGroup(selectedYear);
    }
  }

  getSelf(selectedYear) {
    let data = this.reviewHistorySelf.value;
    let self = [];
    for (let z = 0; z < data.length; z++) {
      let startDate = this.date.transform(data[z].reviewStartDate, 'yyyy');
      if (selectedYear == startDate) {
        self.push(data[z]);
      }
    }
    return self;
  }

  // getReview() {
  //   if (this.reviewId == 1) {
  //     return this.confirmationRevieweeListFromGroup();
  //   }
  //   else if (this.reviewId == 2) {
  //     return this.midYearRevieweeListFromGroup();
  //   }
  //   else if (this.reviewId == 3) {
  //     return this.annualRevieweeListFromGroup();
  //   }
  //   else if (this.reviewId == 4) {
  //     return this.pipRevieweeListFromGroup();
  //   }
  // }

  viewSelfHistory(reviewType, reviewData) {
    if (reviewData) {
      localStorage.setItem('reviewData', JSON.stringify(JSON.parse(reviewData).data));
      this.router.navigate(['review-history/view'], { queryParams: { self: this.self, review_id: this.reviewId } });
    }
  }

  viewReviewHistory(reviewType, reviewData) {
    if (reviewData) {
      localStorage.setItem('reviewData', JSON.stringify(JSON.parse(reviewData).data));
      this.router.navigate(['review-history/view'], { queryParams: { self: this.self, review_id: this.reviewId } });
    }
  }

  sortBy(property) {
    this.isDesc = !this.isDesc;
    this.column = property;
    this.direction = this.isDesc ? -1 : 1;
  }

  getRating(rating) {
    if (this.reviewId == 1) {
      if (rating == 4) {
        return CONSTANTS.RATING_OUTSTANDING
      } else if (rating == 3) {
        return CONSTANTS.RATING_EXCEED
      } else if (rating == 2) {
        return CONSTANTS.RATING_MEET
      } else if (rating == 1) {
        return CONSTANTS.RATING_BELOW;
      }
    } else if (this.reviewId == 3) {
      if (rating >= 90) {
        return CONSTANTS.RATING_OUTSTANDING;
      } else if ((rating >= 80) && (rating <= 89)) {
        return CONSTANTS.RATING_EXCEED;
      } else if ((rating >= 60) && (rating <= 79)) {
        return CONSTANTS.RATING_MEET;
      } else if (rating < 60) {
        return CONSTANTS.RATING_BELOW;
      }
    }
  }

  canComment(reviewData) {
    if (reviewData) {
      let review = JSON.parse(reviewData).data.templateResponses[0].postReviewRevieweeComments;
      if (review) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  openComment(comment: TemplateRef<any>, data) {
    this.selectedData = data;
    this.commentRef = this.modalservice.show(comment, { class: 'modal-md', animated: true, ignoreBackdropClick: false, backdrop: true })
    this.modalservice.onHide.subscribe(event => {
      this.commentHolder = undefined;
    });
  }

  isDisabled(value) {
    if (value) {
      if (value == '') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }


  compare(data, type) {
    if (data) {
      let userId = data.userId;
      let reviewData = data.reviewData;
      let name;
      if (type == 'self') {
        name = CONSTANTS.USER_NAME;
      } else {
        name = data.name;
      }
      let reviewContent = {
        userId: userId,
        name: {
          level1ReviewerName: data.level1ReviewerName,
          level2ReviewerName: data.level2ReviewerName,
          level3ReviewerName: data.level3ReviewerName,
          revieweeName: name
        },
        reviewId: this.reviewId,
        reviewData: reviewData,
        type: 'response',
        visibilityLevel: CONSTANTS.REVIEW_STATUS_OPEN
      }
      this.storage.set(userId, 'Session', false, reviewContent);
      window.open('compare?ref=' + btoa(userId) + '', '_blank');
    }
  }

  // compare(i, type) {
  //   var review;
  //   if (type == 'self') {
  //     review = this.reviewHistorySelf.value;
  //   } else {
  //     review = this.getReview();
  //   }
  //   if (review) {
  //     let userId = review[i].userId;
  //     let reviewData = review[i].reviewData;
  //     let name;
  //     if (type == 'self') {
  //       name = CONSTANTS.USER_NAME;
  //     } else {
  //       name = review[i].name;
  //     }
  //     let reviewContent = {
  //       userId: userId,
  //       name: {
  //         level1ReviewerName: review[i].level1ReviewerName,
  //         level2ReviewerName: review[i].level2ReviewerName,
  //         level3ReviewerName: review[i].level3ReviewerName,
  //         revieweeName: name
  //       },
  //       reviewId: this.reviewId,
  //       reviewData: reviewData,
  //       type: 'response',
  //       visibilityLevel: CONSTANTS.REVIEW_STATUS_OPEN
  //     }
  //     this.storage.set(userId, 'Session', false, reviewContent);
  //     window.open('compare?ref=' + btoa(userId) + '', '_blank');
  //   }
  // }

  async postComment() {
    if (this.selectedData) {
      let review = JSON.parse(this.selectedData.reviewData);
      let reviewData = review.data.templateResponses[0];
      let vault = this.form.convertTo(reviewData);
      let categoryRequests = vault.categoryRequests;
      if (categoryRequests) {
        await this.setNull(vault.categoryRequests);
        if (vault) {
          vault.postReviewRevieweeComments = this.commentHolder;
          var type = '';
          if (this.reviewId == 1) {
            type = CONSTANTS.REVIEW_TYPE_CONFIRMATION;
          } else if (this.reviewId == 2) {
            type = CONSTANTS.REVIEW_TYPE_MIDYEAR;
          } else if (this.reviewId == 3) {
            type = CONSTANTS.REVIEW_TYPE_ANNUAL;
          } else if (this.reviewId == 4) {
            type = CONSTANTS.REVIEW_TYPE_PIP;
          }
          var data = {
            'reviewType': type,
            'templateRequests': []
          };
          data.templateRequests.push(vault);
          var payload = {
            "saveAsDraft": false,
            "hrRelease": true,
            'performanceReviewRequests': [{
              "id": this.selectedData.id,
              "userId": this.selectedData.userId,
              "reviewId": parseInt(this.reviewId),
              "reviewType": this.selectedData.reviewType,
              "reviewStartDate": this.selectedData.reviewStartDate,
              "reviewEndDate": this.selectedData.reviewEndDate,
              "reviewData": encodeURIComponent(JSON.stringify({ 'data': data })),
              "status": CONSTANTS.REVIEW_STATUS_CLOSED,
              "rating": this.selectedData.rating
            }]
          }
          // console.log(payload);
          this.spinner.show();
          this.template.editTemplate(payload).subscribe(data => {
            this.spinner.hide();
            if (this.commentRef) {
              this.commentRef.hide();
            }
            this.statusMessage = CONSTANTS.SUCCESS;
            this.status = CONSTANTS.SUCCESS;
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }, error => {
            this.spinner.hide();
            if (this.commentRef) {
              this.commentRef.hide();
            }
            this.statusMessage = CONSTANTS.FAILURE;
            this.status = CONSTANTS.FAILURE;
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          });
        }
      }
    }
  }

  setNull(categoryRequests) {
    for (let z = 0; z < categoryRequests.length; z++) {
      let subcategoryRequests = categoryRequests[z].subCategoryRequests;
      if (subcategoryRequests) {
        for (let x = 0; x < subcategoryRequests.length; x++) {
          let type = subcategoryRequests[x].type.toLowerCase().replace(/\s*/g, '');
          if (type == 'text') {
            subcategoryRequests[x].textAreaRequest = null;
            subcategoryRequests[x].dateRequest = null;
            subcategoryRequests[x].dropDownRequest = null;
            subcategoryRequests[x].tableRequest = null;
          } else if (type == 'textarea') {
            subcategoryRequests[x].textRequest = null;
            subcategoryRequests[x].dateRequest = null;
            subcategoryRequests[x].dropDownRequest = null;
            subcategoryRequests[x].tableRequest = null;
          } else if (type == 'date') {
            subcategoryRequests[x].textRequest = null;
            subcategoryRequests[x].textAreaRequest = null;
            subcategoryRequests[x].dropDownRequest = null;
            subcategoryRequests[x].tableRequest = null;
          } else if (type == 'dropdown') {
            subcategoryRequests[x].textRequest = null;
            subcategoryRequests[x].textAreaRequest = null;
            subcategoryRequests[x].dateRequest = null;
            subcategoryRequests[x].tableRequest = null;
          } else if (type == 'table') {
            subcategoryRequests[x].textRequest = null;
            subcategoryRequests[x].textAreaRequest = null;
            subcategoryRequests[x].dateRequest = null;
            subcategoryRequests[x].dropDownRequest = null;
            let tableRequest = subcategoryRequests[x].tableRequest;
            if (tableRequest) {
              let tableValueList = tableRequest.tableValueListRequests;
              for (let c = 0; c < tableValueList.length; c++) {
                let tableValue = tableValueList[c].tableValueRequests;
                if (tableValue) {
                  for (let v = 0; v < tableValue.length; v++) {
                    let type = tableValue[v].type.toLowerCase().replace(/\s*/g, '');
                    if (type == 'text') {
                      delete tableValue[v].dropDownDefaultRequests;
                      tableValue[v].textAreaRequest = null;
                      tableValue[v].dateRequest = null;
                      tableValue[v].dropDownSelectedRequest = null;
                    } else if (type == 'textarea') {
                      delete tableValue[v].dropDownDefaultRequests;
                      tableValue[v].textRequest = null;
                      tableValue[v].dateRequest = null;
                      tableValue[v].dropDownSelectedRequest = null;
                    } else if (type == 'date') {
                      delete tableValue[v].dropDownDefaultRequests;
                      tableValue[v].textRequest = null;
                      tableValue[v].textAreaRequest = null;
                      tableValue[v].dropDownSelectedRequest = null;
                    } else if (type == 'dropdown') {
                      delete tableValue[v].dropDownDefaultRequests;
                      tableValue[v].textRequest = null;
                      tableValue[v].textAreaRequest = null;
                      tableValue[v].dateRequest = null;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.commentRef) {
      this.commentRef.hide();
    }
  }
}
