import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from '../service/form.service';
import { ReviewService } from '../service/review.service';
import { CONSTANTS, FUNCTIONS } from '../variable-constants';
import { ReviewLogsService } from '../service/review-logs.service';
import { DataService } from '../service/data.service';
import { DatePipe } from '@angular/common';
import { TemplateService } from '../service/template.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-review-view-update',
  templateUrl: './review-view-update.component.html',
  styles: []
})
export class ReviewViewUpdateComponent implements OnInit, OnDestroy {
  reviewType;
  reviewId;
  searchText = '';
  p = 1;
  reviewForm: FormGroup;
  selectedType;
  type;
  isEveryThingChecked = false;
  isAtleastOnceSelected = false;
  checkedList = [];
  status;
  statusMessage;
  reviewData;
  modalRef: BsModalRef;
  selectedRole;
  roleType = [];
  createList = [];
  _isTemplateAvailable = false;
  isDesc: boolean;
  column: string;
  direction: number;
  minDate: Date = new Date();

  constructor(private title: Title, private route: ActivatedRoute,
    private spinner: NgxSpinnerService, private fb: FormBuilder,
    private formService: FormService, private review: ReviewService,
    private reviewLogsService: ReviewLogsService,
    public templateService: TemplateService,
    private modalService: BsModalService,
    private data: DataService,
    private date: DatePipe) {
    this.title.setTitle('All Reviews');
  }

  ngOnInit() {
    this.reviewForm = this.fb.group({
      "reviews": this.fb.array([])
    })
    this.type = localStorage.getItem('selectedType');
    if (this.type) {
      this.selectedType = this.type;
    } else {
      this.type = 'open';
      this.selectedType = 'open'
    }
    this.route.queryParams.subscribe(params => {
      this.reviewId = params.review_id;
      this.reviewType = FUNCTIONS.REVIEWTYPE(this.reviewId);
      if (this.selectedType == 'open') {
        this.getAllOpenReviews(this.reviewId);
      }
      if (this.selectedType == 'closed') {
        this.getAllClosedReviews();
      }
    });
    localStorage.setItem("selectedType", this.selectedType);
  }

  optionChanged(event) {
    if (event == 'open') {
      this.selectedType = 'open'
      localStorage.setItem("selectedType", this.selectedType);
      this.getAllOpenReviews(this.reviewId);
    }
    if (event == 'closed') {
      this.selectedType = 'closed'
      localStorage.setItem("selectedType", this.selectedType);
      this.getAllClosedReviews();
    }
  }

  getAllOpenReviews(reviewId) {
    this.reviewForm = this.fb.group({
      "reviews": this.fb.array([])
    })
    var list = [];
    this.isAtleastOnceSelected = false;
    this.isEveryThingChecked = false;
    this.spinner.show();
    this.reviewLogsService.getAllOpenReviews().subscribe(
      (response) => {
        response.data.performanceReviewResponses.forEach((element, index) => {
          if (element.reviewId == reviewId) {
            response.data.performanceReviewResponses[index].reviewEndDate = this.date.transform(element.reviewEndDate, 'dd-MMM-yyyy');
            response.data.performanceReviewResponses[index]['isChecked'] = false;
            response.data.performanceReviewResponses[index]['disable'] = true;
            list.push(response.data.performanceReviewResponses[index])
            this.reviewForm = this.fb.group({
              "reviews": this.formService.createFormArray(list)
            })
            this.isDesc = undefined;
            this.column = undefined;
            this.direction = undefined;
            this.sortBy('modifiedDate');
          }
        });
        this.spinner.hide();
      }, error => {
        this.reviewForm = this.fb.group({
          "reviews": this.fb.array([])
        })
        this.spinner.hide();
      }
    );
  }

  getAllClosedReviews() {
    this.spinner.show();
    this.review.getByStatus(this.reviewType, CONSTANTS.REVIEW_STATUS_CLOSED).subscribe(
      response => {
        this.reviewForm = this.fb.group({
          "reviews": this.formService.createFormArray(response.data.performanceReviewResponses)
        });
        this.isDesc = undefined;
        this.column = undefined;
        this.direction = undefined;
        this.sortBy('reviewStartDate');
        this.spinner.hide();
      }, error => {
        this.reviewForm = this.fb.group({
          "reviews": this.fb.array([])
        }
        )
        this.spinner.hide();
      }
    );
  }

  getMinDate(startDate: Date) {
    let minDate: Date = new Date(this.date.transform(startDate, 'dd-MMM-yyyy'));
    return minDate;
  }

  getReviews() {
    return this.reviewForm.get('reviews').value;
  }

  checkORUnCheckAll(event) {
    if (event.target.checked) {
      this.checkAllData();
      this.isEveryThingChecked = true;
      this.isAtleastOnceSelected = true;
    }
    else {
      for (let i = 0; i < this.getReviews().length; i++) {
        this.getReviews()[i]['isChecked'] = false;
        this.getReviews()[i]['disable'] = true;
      }
      this.isEveryThingChecked = false;
      this.isAtleastOnceSelected = false;
      this.checkedList = [];
    }
  }

  checkAllData() {
    this.checkedList = [];
    for (let i = 0; i < this.getReviews().length; i++) {
      this.getReviews()[i]['isChecked'] = true;
      this.getReviews()[i]['disable'] = false;
      this.checkedList.push(this.getReviews()[i]);
    }
  }

  findChecked(event, userId) {
    this.isEveryThingChecked = false;
    if (event.target.checked) {
      for (let i = 0; i < this.getReviews().length; i++) {
        if (this.getReviews()[i].userId == userId) {
          this.getReviews()[i]['isChecked'] = true;
          this.getReviews()[i]['disable'] = false;
          this.checkedList.push(this.getReviews()[i]);
        }
      }
    }
    else {
      for (let i = 0; i < this.getReviews().length; i++) {
        if (this.getReviews()[i].userId == userId) {
          this.getReviews()[i]['isChecked'] = false;
          this.getReviews()[i]['disable'] = true;
          for (let j = 0; j < this.checkedList.length; j++) {
            if (userId == this.checkedList[j].userId) {
              this.checkedList.splice(j, 1);
            }
          }
        }
      }
    }
    if (this.checkedList.length > 0) {
      this.isAtleastOnceSelected = true;
    } else {
      this.isAtleastOnceSelected = false;
    }
    if (this.getReviews().length == this.checkedList.length) {
      this.isEveryThingChecked = true;
    }
  }

  submit() {
    var payload = {
      "saveAsDraft": false,
      "reviewEndDateChange": true,
      'performanceReviewRequests': []
    }
    var reviewData = {
      reviewType: this.reviewType,
      templateRequests: []
    }
    let data = JSON.parse(JSON.stringify(this.checkedList));
    data.forEach(element => {
      if (element.reviewData != null) {
        let response = JSON.parse(element.reviewData).data.templateResponses;
        response.forEach(element => {
          let converted = this.formService.convertTo(element);
          if (converted) {
            for (let q = 0; q < converted.categoryRequests.length; q++) {
              for (let w = 0; w < converted.categoryRequests[q].subCategoryRequests.length; w++) {
                if (converted.categoryRequests[q].subCategoryRequests[w].tableRequest) {
                  if (converted.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests) {
                    for (let r = 0; r < converted.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests.length; r++) {
                      for (let t = 0; t < converted.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests.length; t++) {
                        delete converted.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].dropDownDefaultRequests;
                      }
                    }
                  }
                }
              }
            }
          }
          reviewData.templateRequests.push(converted);
        });
        element.reviewData = encodeURIComponent(JSON.stringify({ 'data': reviewData }));
      }
      element.reviewEndDate = this.date.transform(element.reviewEndDate, 'yyyy-MM-dd');
      payload.performanceReviewRequests.push(element);
    });

    this.spinner.show();
    this.templateService.editTemplate(payload).subscribe(data => {
      this.spinner.hide();
      this.status = CONSTANTS.SUCCESS;
      this.statusMessage = CONSTANTS.SUCCESS;
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }, error => {
      this.spinner.hide();
      this.status = CONSTANTS.FAILURE;
      this.statusMessage = CONSTANTS.FAILURE;
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    });
  }

  calculateRate() {
    this.data.setSelectedRole(this.selectedRole);
  }

  addToAccordian(control) {
    for (let index = 0; index < control.length; index++) {
      let categoryName = control[index].name;
      this.createList.push({
        title: categoryName,
        content: `Dynamic Group Body - ${this.createList.length + 1}`
      });
    }
  }

  openModal(template, reviewData, level1, level2, level3) {
    this.createList = [];
    let rData = JSON.parse(reviewData);
    if (rData != null && rData) {
      this.reviewData = rData.data;
      let templateResponses = this.reviewData.templateResponses[0];
      let submittedObj = templateResponses.submitted;
      this.roleType = [];
      this.setRoleType(submittedObj);
      this.addToAccordian(this.reviewData.templateResponses[0].categoryResponses);
      if (this.reviewData.templateResponses[0]) {
        this._isTemplateAvailable = true;
      } else {
        this._isTemplateAvailable = false;
      }
      this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    }
  }

  setRoleType(submittedObj) {
    let employee = submittedObj.employee;
    let level1 = submittedObj.level1;
    let level2 = submittedObj.level2;
    let level3 = submittedObj.level3;
    if (employee) {
      this.roleType.push(CONSTANTS.EMPLOYEE);
    }
    if (level3) {
      this.roleType.push(CONSTANTS.APPRAISERII);
    }
    if (level2) {
      this.roleType.push(CONSTANTS.APPRAISERI);
    }
    if (level1) {
      this.roleType.push(CONSTANTS.REVIEWER);
    }
    if (this.roleType.length > 0) {
      this.selectedRole = this.roleType[0];
      this.data.setSelectedRole(this.selectedRole);
    }
  }

  sortBy(property) {
    this.isDesc = !this.isDesc;
    this.column = property;
    this.direction = this.isDesc ? -1 : 1;
  }

  ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
}
