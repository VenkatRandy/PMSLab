import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CONSTANTS, FUNCTIONS } from '../variable-constants';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { ReviewService } from '../service/review.service';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../service/storage.service';
import { PopoverDirective } from 'ngx-bootstrap/popover/public_api';

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styles: [``]
})
export class ReleaseComponent implements OnInit {
  isEverythingSelected = false;
  isAtleastOnceSelected = false;
  flag; boolean;
  formArrayLength: number = 0;
  _isOpen: boolean;
  ConfirmationEmployeeList: any = [];
  MidYearEmployeeList: any = [];
  AnnualEmployeeList: any = [];
  EmployeeList: any = [];
  InitiatedEmployees: any = [];
  AllEmployees: any = [];
  status: string;
  statusModal: string;
  isDisabled1: boolean = false;
  isDisabled2: boolean = false;
  isDisabled3: boolean = false;
  isDisabled4: boolean = false;
  isCheckedConfirmation: boolean[] = [];
  isCheckedMidYear: boolean[] = [];
  isCheckedAnnual: boolean[] = [];
  searchText: string;
  p: number = 1;
  currentDate = new Date();
  date: string;
  tabNumber: number = 1;

  //Booleans
  _isConfirmation: boolean = true;
  _isMidYear: boolean = false;
  _isPip: boolean = false;
  _isAnnual: boolean = false;

  message: string;
  releaseForm: FormGroup;
  releaseFormData;
  userID;
  userDetails;
  _isEverythingChecked = false;
  templateRequests;
  selectedType;
  modalRef: BsModalRef;
  selectedReviewData;
  createList: any = [];
  _isTemplateAvailable: boolean;
  roleType = [];
  selectedRole;
  noManager = [];

  // Comments
  employeeRating = null;
  employeeComments = null;
  level1Rating = null;
  level1Comments = null;
  level2Rating = null;
  level2Comments = null;
  level3Rating = null;
  level3Comments = null;

  isDesc: boolean;
  column: string;
  direction: number;

  editRating = false;
  level1RatingBkp;
  selectedRow;

  statusMessage: string;

  rate;
  level;
  weightage;
  tempRating = 0;
  count = 0;
  popRef: PopoverDirective;

  @ViewChild('template', { static: true }) templateRef: ModalDirective;

  constructor(
    private titleService: Title,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private modalService: BsModalService,
    private review: ReviewService,
    private storage: StorageService
  ) {
    this.titleService.setTitle("Review Release");
  }

  log(event) {
    if (this.popRef) {
      this.popRef.hide();
    }
  }

  open(pop: PopoverDirective) {
    this.count = 1;
    this.popRef = pop;
    pop.show();
  }

  trackByFnR(index, row) {
    return row.uid
  }

  showChildModal(): void {
    this.templateRef.show();
  }

  hideChildModal(): void {
    this.templateRef.hide();
  }

  sortBy(property) {
    this.isDesc = !this.isDesc;
    this.column = property;
    this.direction = this.isDesc ? -1 : 1;
  }

  ngOnInit() {
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
    // console.log(value);
    this.searchText = '';
    if (this.InitiatedEmployees != null) {
      this.isEverythingSelected = false;
      this.InitiatedEmployees = [];
    }

    let reviewType = FUNCTIONS.REVIEWTYPE(value);
    this.release(reviewType);
    // if (value == 1) {
    //   this.release(value);
    // } else if (value == 2) {
    //   this.release(value);
    // } else if (value == 3) {
    //   this.release(value);
    // } else if (value == 4) {
    //   this.release(value);
    // }
  }

  openModal(template: TemplateRef<any>, row) {
    this.roleType = [];
    this.selectedRow = row;
    let rData = JSON.parse(row.reviewData);
    if (rData) {
      this.selectedReviewData = rData.data;
      if (this.selectedReviewData != undefined || this.selectedReviewData != null) {
        let templateResponses = this.selectedReviewData.templateResponses[0];
        let submittedObj = templateResponses.submitted;
        this.level1RatingBkp = templateResponses.level1Rating;
        if (submittedObj.employee != null) {
          this.roleType.push(CONSTANTS.EMPLOYEE);
        }
        if (submittedObj.level3 != null) {
          this.roleType.push(CONSTANTS.APPRAISERII);
        }
        if (submittedObj.level2 != null) {
          this.roleType.push(CONSTANTS.APPRAISERI);
        }
        if (submittedObj.level1 != null) {
          this.roleType.push(CONSTANTS.REVIEWER);
          this.selectedRole = CONSTANTS.REVIEWER;
        }
        this.createList = [];
        this.addToAccordian(this.selectedReviewData.templateResponses[0].categoryResponses);
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
        if (this.selectedReviewData.templateResponses[0]) {
          this._isTemplateAvailable = true;
          this.processRating();
        } else {
          this._isTemplateAvailable = false;
        }
      } else {
      }
    }
    this.modalRef = this.modalService.show(template, { class: 'modal-lg', ignoreBackdropClick: false });
    this.modalService.onHide.subscribe(data => {
      this.editRating = false;
      this.resetRating();
    })
  }

  processRating() {
    //Rating
    if (this.selectedRole == CONSTANTS.REVIEWER) {
      this.rate = this.selectedReviewData.templateResponses[0].level1Rating;
    } else if (this.selectedRole == CONSTANTS.APPRAISERI) {
      this.rate = this.selectedReviewData.templateResponses[0].level2Rating;
    } else if (this.selectedRole == CONSTANTS.APPRAISERII) {
      this.rate = this.selectedReviewData.templateResponses[0].level3Rating;
    } else if (this.selectedRole == CONSTANTS.EMPLOYEE) {
      this.rate = this.selectedReviewData.templateResponses[0].employeeRating;
    }

    if (this.rate) {
      if (this.tabNumber == 1) {
        if (this.rate == 4) {
          this.level = CONSTANTS.RATING_OUTSTANDING;
        } else if (this.rate == 3) {
          this.level = CONSTANTS.RATING_EXCEED;
        } else if (this.rate == 2) {
          this.level = CONSTANTS.RATING_MEET;
        } else if (this.rate == 1) {
          this.level = CONSTANTS.RATING_BELOW;
        }
      } else if (this.tabNumber == 3) {
        if (this.rate >= 90) {
          this.level = CONSTANTS.RATING_OUTSTANDING;
        } else if ((this.rate >= 80) && (this.rate <= 89)) {
          this.level = CONSTANTS.RATING_EXCEED;
        } else if ((this.rate >= 60) && (this.rate <= 79)) {
          this.level = CONSTANTS.RATING_MEET;
        } else if (this.rate < 60) {
          this.level = CONSTANTS.RATING_BELOW;
        }
      }
    } else {
      this.level = 'Below Expectations';
    }
  }

  reset2() {
    this.selectedReviewData.templateResponses[0].level1Rating = this.level1RatingBkp;
    if (this.selectedRole == 'Level 1') {
      this.editRating = true;
    } else {
      this.editRating = false;
    }
  }

  typeChanged() {
    this.processRating();
  }

  projectRating() {
    // this.dataservice.setRating(this.selectedReviewData.templateResponses[0].level1Rating);
    this.typeChanged()
  }

  async saveRating() {
    this.editRating = false;
    if (this.selectedRow) {
      delete this.selectedRow.checkbox_value;
      delete this.selectedRow.uid;
      if (this.selectedRow.reviewData) {
        // console.log(JSON.parse(data[q].reviewData));
        let reviewData = JSON.parse(this.selectedRow.reviewData).data;
        // console.log(JSON.stringify(reviewData));
        if (reviewData) {
          await this.convertTemplateResponse(reviewData.templateResponses);
          let templateRequests = this.templateRequests
          var insideRD = {
            'reviewType': reviewData.reviewType,
            'templateRequests': templateRequests
          };

          /* Comment this*/
          // insideRD.templateRequests[0].level1Rating = this.selectedReviewData.templateResponses[0].level1Rating;

          this.selectedRow.reviewData = encodeURIComponent(JSON.stringify({ 'data': insideRD }));
          this.selectedRow.rating = this.selectedReviewData.templateResponses[0].level1Rating
        }
      }


      var data = []

      data.push(this.selectedRow)

      var payload = {
        hrRelease: true,
        performanceReviewRequests: data
      }

      // console.log(payload);
      // return;

      this.spinner.show();
      this.review.updateAllReviews(payload).subscribe(data => {
        this.spinner.hide();
        // this.status = CONSTANTS.SUCCESS;
        this.statusModal = CONSTANTS.SUCCESS;
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }, error => {
        this.spinner.hide();
        // this.status = CONSTANTS.FAILURE;
        // this.statusModal = CONSTANTS.FAILURE;
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1500);
      });

    }


    // var reviewData = {
    //   'reviewType': type,
    //   'templateRequests': [
    //     {
    //       "employeeRating": this.employeeRating,
    //       "employeeComments": this.employeeComments,
    //       "level1Rating": this.level1Rating,
    //       "level1Comments": this.level1Comments,
    //       "level2Rating": this.level2Rating,
    //       "level2Comments": this.level2Comments,
    //       "level3Rating": this.level3Rating,
    //       "level3Comments": this.level3Comments,
    //       "categoryRequests": form.getRawValue().categoryRequests
    //     }
    //   ]

    // };

    // var payload = {
    //   "saveAsDraft": false,
    //   'performanceReviewRequests': [{
    //     "id": this.selectedRow.id,
    //     "userId": this.selectedRow.userId,
    //     "reviewId": parseInt(this.selectedRow.reviewId),
    //     "reviewType": this.selectedRow.type,
    //     "reviewYear": this.selectedRow.reviewYear,
    //     "reviewData": encodeURIComponent(JSON.stringify({ 'data': reviewData })),
    //     "status": this.selectedRow.status,
    //     "rating": this.selectedRow.rating
    //   }]
    // }
  }

  resetRating() {
    this.selectedReviewData.templateResponses[0].level1Rating = this.level1RatingBkp;
    // this.dataservice.setRating(this.selectedReviewData.templateResponses[0].level1Rating);
    this.processRating();
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

  release(reviewType) {
    this.spinner.show();
    this.review.getByStatus(reviewType, CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_HR).subscribe(data => {
      this.spinner.hide();
      if (data.data.performanceReviewResponses) {
        this.releaseFormData = data.data.performanceReviewResponses;
        if (this.releaseFormData) {
          this.releaseFormData.forEach((element, index) => {
            element['uid'] = ((index + 7) * 11)
            element['checkbox_value'] = null
          });
        }
        this.releaseForm = this.fb.group({
          rows: this.fb.array([])
        });
        // this.patchValues(this.releaseFormData);
      }
    }, error => {
      this.releaseForm = undefined;
      this.releaseFormData = undefined;
      this.spinner.hide();
    }, () => {
      this.sortBy('reviewStartDate');
    }
    )
  }

  get releaseFormArray() {
    if (this.releaseForm) {
      let rows = this.releaseForm.get('rows') as FormArray;
      return rows;
    }
  }

  patchValues(releaseFormData) {
    let rows = this.releaseForm.get('rows') as FormArray;
    while (rows.length !== 0) {
      rows.removeAt(0)
    }
    releaseFormData.forEach((x, index) => {
      if (this.tabNumber == x.reviewId) {
        rows.push(this.fb.group({
          checkbox_value: [null],
          uid: (index + 1) * 7,
          id: x.id,
          name: x.name,
          rating: x.rating,
          reviewData: x.reviewData,
          reviewId: x.reviewId,
          reviewType: x.reviewType,
          reviewStartDate: x.reviewStartDate,
          reviewEndDate: x.reviewEndDate,
          status: x.status,
          userId: x.userId
        }));
      }
    });
  }

  releaseAll(check) {
    this.releaseFormData.forEach((x, index) => {
      if (check) {
        this._isEverythingChecked = true;
        this.isAtleastOnceSelected = true;
        this.releaseFormData[index].checkbox_value = true;
      } else {
        this._isEverythingChecked = false;
        this.isAtleastOnceSelected = false;
        this.releaseFormData[index].checkbox_value = false;
      }
    });
  }

  releaseOne(index, check, uid) {
    this._isEverythingChecked = false;
    // console.log(uid);
    let form = this.releaseFormData;
    for (let index = 0; index < form.length; index++) {
      if (form[index].uid == uid) {
        if (check) {
          form[index].checkbox_value = true;
        } else {
          form[index].checkbox_value = false;
        }
      }
    }
    this.isAtleastOnceSelected = false;
    form.forEach((element, index) => {
      if (element.checkbox_value) {
        this.isAtleastOnceSelected = true;
      }
    });
  }

  async releaseTo(releaseType) {
    let form = this.releaseFormData;
    var data = [];
    form.forEach((x, index) => {
      if (x.checkbox_value) {
        // console.log(x);        
        data.push(x);
      }
    });
    if (data) {
      if (data.length > 0) {
        for (let index = 0; index < data.length; index++) {
          delete data[index].checkbox_value;
        }
      }
    }
    for (let q = 0; q < data.length; q++) {
      if (data[q].reviewData) {
        // console.log(JSON.parse(data[q].reviewData));
        let reviewData = JSON.parse(data[q].reviewData).data;
        if (reviewData) {
          await this.convertTemplateResponse(reviewData.templateResponses);
          let templateRequests = this.templateRequests;
          var insideRD = {
            'reviewType': reviewData.reviewType,
            'templateRequests': templateRequests
          };
          // console.log(insideRD);
          data[q].reviewData = encodeURIComponent(JSON.stringify({ 'data': insideRD }));
          if (this.tabNumber == 1 || this.tabNumber == 3) {
            data[q].rating = templateRequests[0].level1Rating;
          }
        }
      }
    }

    let rel = true;
    if (releaseType == 'release') {
      rel = true;
    } else {
      rel = false;
    }

    var payload = {
      hrRelease: rel,
      performanceReviewRequests: data
    }

    // console.log(payload);
    // return;

    this.spinner.show();
    this.review.updateAllReviews(payload).subscribe(data => {
      this.spinner.hide();
      if (releaseType == 'release') {
        this.statusMessage = CONSTANTS.REVIEW_RELEASE_SUCCESS;
      } else {
        this.statusMessage = CONSTANTS.REVIEW_SENT_BACK_SUCCESS;
      }
      this.status = CONSTANTS.SUCCESS;
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }, error => {
      this.spinner.hide();
      this.statusMessage = CONSTANTS.FAILURE;
      this.status = CONSTANTS.FAILURE;
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    });

  }

  async convertTemplateResponse(data) {
    for (let z = 0; z < data.length; z++) {
      let vault = {
        submitted: data[z].submitted,
        roleType: data[z].roleType,
        employeeRating: data[z].employeeRating,
        employeeComments: data[z].employeeComments,
        level1Rating: data[z].level1Rating,
        level1Comments: data[z].level1Comments,
        level2Rating: data[z].level2Rating,
        level2Comments: data[z].level2Comments,
        level3Rating: data[z].level3Rating,
        level3Comments: data[z].level3Comments,
        postReviewRevieweeComments: data[z].postReviewRevieweeComments,
        categoryRequests: data[z].categoryResponses
      }
      await this.removeResponses(vault);
      await this.deleteResponses(vault);
      // console.log(this.templateRequests);      
    }
  }

  removeResponses(vault) {
    for (let q = 0; q < vault.categoryRequests.length; q++) {
      vault.categoryRequests[q]['textRequest'] = vault.categoryRequests[q].textResponse;
      vault.categoryRequests[q]['subCategoryRequests'] = vault.categoryRequests[q].subCategoryResponses;
      if (vault.categoryRequests[q].subCategoryRequests) {
        for (let w = 0; w < vault.categoryRequests[q].subCategoryRequests.length; w++) {
          vault.categoryRequests[q].subCategoryRequests[w]['textRequest'] = vault.categoryRequests[q].subCategoryRequests[w].textResponse;
          vault.categoryRequests[q].subCategoryRequests[w]['textAreaRequest'] = vault.categoryRequests[q].subCategoryRequests[w].textAreaResponse;
          vault.categoryRequests[q].subCategoryRequests[w]['dateRequest'] = vault.categoryRequests[q].subCategoryRequests[w].dateResponse;
          vault.categoryRequests[q].subCategoryRequests[w]['dropDownRequest'] = vault.categoryRequests[q].subCategoryRequests[w].dropDownResponse;
          if (vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest != null) {
            vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownDefaultRequests = vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownDefaultResponses;
            vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownSelectedRequest = vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownSelectedResponse;
          }
          vault.categoryRequests[q].subCategoryRequests[w]['tableRequest'] = vault.categoryRequests[q].subCategoryRequests[w].tableResponse;
          if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest != null) {
            vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListResponses;
            if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests) {
              for (let r = 0; r < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests.length; r++) {
                vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r]['tableValueRequests'] = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueResponses;
                if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests) {
                  for (let t = 0; t < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests.length; t++) {
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t]['textRequest'] = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].textResponse;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t]['textAreaRequest'] = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].textAreaResponse;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t]['dateRequest'] = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].dateResponse;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t]['dropDownSelectedRequest'] = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].dropDownSelectedResponse;
                  }
                }
              }
            }
            vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderResponses;
            if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests) {
              for (let e = 0; e < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests.length; e++) {
                vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e]['dropDownDefaultRequests'] = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].dropDownDefaultResponses;
              }
            }
          }
        }
      }
    }
  }

  deleteResponses(vault) {
    for (let q = 0; q < vault.categoryRequests.length; q++) {
      delete vault.categoryRequests[q].textResponse;
      delete vault.categoryRequests[q].subCategoryResponses;
      for (let w = 0; w < vault.categoryRequests[q].subCategoryRequests.length; w++) {
        delete vault.categoryRequests[q].subCategoryRequests[w].textResponse;
        delete vault.categoryRequests[q].subCategoryRequests[w].textAreaResponse;
        delete vault.categoryRequests[q].subCategoryRequests[w].dateResponse;
        if (vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest != null) {
          delete vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownDefaultResponses;
          delete vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownSelectedResponse;
        }
        delete vault.categoryRequests[q].subCategoryRequests[w].dropDownResponse;
        if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest != null) {
          delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderResponses;
        }
        delete vault.categoryRequests[q].subCategoryRequests[w].tableResponse;
        if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest) {
          delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListResponses;
          for (let r = 0; r < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests.length; r++) {
            delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueResponses
            for (let t = 0; t < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests.length; t++) {
              delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].textResponse;
              delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].textAreaResponse;
              delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].dateResponse;
              delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].dropDownSelectedResponse;
            }
          }
          for (let e = 0; e < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests.length; e++) {
            delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].dropDownDefaultResponses;
          }
        }
      }
    }
    let templateRequests = [];
    templateRequests.push(vault);
    this.templateRequests = templateRequests;
  }

  compare() {
    var review = this.selectedRow;
    if (review) {
      let userId = review.userId;
      let reviewData = review.reviewData;
      let reviewContent = {
        userId: userId,
        reviewId: this.tabNumber,
        name: {
          level1ReviewerName: review.level1ReviewerName,
          level2ReviewerName: review.level2ReviewerName,
          level3ReviewerName: review.level3ReviewerName,
          revieweeName: review.name
        },
        reviewData: reviewData,
        type: 'response',
        visibilityLevel: CONSTANTS.REVIEW_STATUS_OPEN
      }
      this.storage.set(userId, 'Session', false, reviewContent);
      window.open('compare?ref=' + btoa(userId) + '', '_blank');
    }
  }

  ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.hide()
    }
  }
}

