import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { TemplateService } from 'src/app/service/template.service';
import { ReviewService } from 'src/app/service/review.service';
import { CONSTANTS, FUNCTIONS } from 'src/app/variable-constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
import { FormService } from 'src/app/service/form.service';

@Component({
  selector: 'app-employee-review',
  templateUrl: './employee-review.component.html',
  styles: [``]
})
export class EmployeeReviewComponent implements OnInit, OnDestroy {
  vault;
  templateResponses;
  templateRequests;
  userDetails;
  observable
  userId;
  employeeList: any;
  selectedUser;
  selectedUserName;
  selectedIdx;
  selectedStatus;
  payload = [];
  templatePayload;
  reviewType = 'Confirmation Review Template';
  roleType = []
  p: number = 1;
  searchText = '';
  head = ["Emp. No.", "Name", "Review Start Date", "Action"];
  head1 = ["Emp. No.", "Name", "Review Start Date", "Action"];
  _isDeclined = false;
  reviewId: number;
  _isFirstTime = true;
  _isManager = true;
  option;
  currentRoute;
  status;
  selectedReviewData;
  selectedIndex;
  selectedReviewYear;
  selectedRole;
  createList: any = [];
  _isTemplateAvailable: boolean;
  isDesc: boolean;
  column: string;
  direction: number;
  selected;
  id;
  type;
  selectedType;
  dropType = 'default';
  revieweeResponse;
  statusMessage: string;
  _isShown: boolean;
  reviewEndDate;
  bankVault;
  USER_DETAILS;
  MY_NAME;
  submittedObj;
  chooseTemplateRef: BsModalRef;
  viewTemplateRef: BsModalRef;
  submittedRef: BsModalRef;
  workflowRef: BsModalRef;

  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private reviewService: ReviewService,
    private route: Router,
    private router: ActivatedRoute,
    private data: DataService,
    private modalService: BsModalService,
    public template: TemplateService,
    private formservice: FormService
  ) {
    this.titleService.setTitle("Employee Review");
  }

  ngOnInit() {
    this.MY_NAME = CONSTANTS.USER_NAME;
    localStorage.removeItem('reviewTypeFromEmployee');
    localStorage.removeItem('reviewTypeFromMine');
    this.type = localStorage.getItem('typeForEmployeeReview');
    this.dropType = localStorage.getItem('dropType');
    if (this.type) {
      this.selectedType = this.type;
    } else {
      this.type = 'initiate';
      this.selectedType = 'initiate'
    }
    this.currentRoute = CONSTANTS.CURRENT_ROUTE;
    this.userDetails = CONSTANTS.USER_DETAILS;
    this.revieweeResponse = CONSTANTS.REVIEWEE_RESPONSE;
    if (this.userDetails) {
      this.userId = this.userDetails.userId;
    }
    if (this.revieweeResponse) {
      if (this.revieweeResponse.annualRevieweeResponse) {
        if (this.revieweeResponse.annualRevieweeResponse.level1Response
        ) {
          this._isShown = true;
          this._isManager = true;
        } else if (this.revieweeResponse.annualRevieweeResponse.level2Response || this.revieweeResponse.annualRevieweeResponse.level3Response) {
          this._isManager = false;
        }
      }
      if (this.revieweeResponse.confirmationRevieweeResponse) {
        if (this.revieweeResponse.confirmationRevieweeResponse.level1Response
        ) {
          this._isShown = true;
          this._isManager = true;
        } else if (this.revieweeResponse.confirmationRevieweeResponse.level2Response || this.revieweeResponse.confirmationRevieweeResponse.level3Response) {
          this._isManager = false;
        }
      }
      if (this.revieweeResponse.midyearRevieweeResponse) {
        if (this.revieweeResponse.midyearRevieweeResponse.level1Response
        ) {
          this._isShown = true;
          this._isManager = true;
        } else if (this.revieweeResponse.midyearRevieweeResponse.level2Response || this.revieweeResponse.midyearRevieweeResponse.level3Response) {
          this._isManager = false;
        }
      }
      if (this.revieweeResponse.pipRevieweeResponse) {
        if (this.revieweeResponse.pipRevieweeResponse.level1Response
        ) {
          this._isShown = true;
          this._isManager = true;
        } else if (this.revieweeResponse.pipRevieweeResponse.level2Response || this.revieweeResponse.pipRevieweeResponse.level3Response) {
          this._isManager = false;
        }
      }
    } else {
      this._isShown = false;
      this._isManager = false;
    }
    if (this._isManager) {
      if (this.selectedType == 'initiate') {
        this.option = 'initiate';
        this.getAllReviewInitiated();
      } else if (this.selectedType == 'review') {
        this.option = 'review';
        let status = this.fetchStatus();
        this.getAllEmployees(status);
      } else if (this.selectedType == 'fromhr') {
        this.option = 'fromhr';
        let status = this.fetchStatus();
        this.getAllEmployees(status);
      } else if (this.selectedType == 'open') {
        this.option = 'open';
        let status = this.fetchStatus();
        this.getAllEmployees(status);
      }
    }
    else {
      if (this.selectedType == 'initiate') {
        this.selectedType = 'review';
        this.option = 'review';
      } else if (this.selectedType == 'review') {
        this.option = 'review';
        let status = this.fetchStatus();
        this.getAllEmployees(status);
      } else if (this.selectedType == 'open') {
        this.option = 'open';
        let status = this.fetchStatus();
        this.getAllEmployees(status);
      }
    }

    this.router.queryParams.subscribe(params => {
      if (params.pgno) {
        this.p = params.pgno;
      }
    });
    this.sortBy('reviewStartDate');
  }

  optionChanged(event) {
    this.option = event;
    localStorage.setItem('typeForEmployeeReview', this.option)
    if (event == 'initiate') {
      this.selectedType = 'initiate';
      this.employeeList = [];
      this.searchText = '';
      this.getAllReviewInitiated();
    } else if (event == 'review') {
      this.selectedType = 'review';
      this.employeeList = [];
      this.searchText = '';
      let status = this.fetchStatus();
      this.getAllEmployees(status);
    } else if (event == 'fromhr') {
      this.selectedType = 'fromhr';
      this.employeeList = [];
      this.searchText = '';
      let status = this.fetchStatus();
      this.getAllEmployees(status);
    }
    else if (event == 'open') {
      this.selectedType = 'open';
      this.employeeList = [];
      this.searchText = '';
      this.getAllEmployees('open');
    }
  }

  fetchStatus() {
    if (this.selectedType == 'review') {
      return CONSTANTS.REVIEW_STATUS_OPEN;
    } else if (this.selectedType == 'fromhr') {
      return CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_HR;
    } else if (this.selectedType == 'open') {
      return CONSTANTS.REVIEW_STATUS_OPEN;
    }
  }

  sortBy(property) {
    this.isDesc = !this.isDesc;
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  }

  sortFn(col) {
    if (FUNCTIONS.TRIM(col) == 'emp.no.') {
      this.sortBy('userId');
    } else if (FUNCTIONS.TRIM(col) == 'name') {
      this.sortBy('name');
    } else if (FUNCTIONS.TRIM(col) == 'reviewstartdate') {
      this.sortBy('reviewStartDate');
    }
  }

  getTabNumber(value) {
    this.p = 1;
    if (value == 1) {
      this.reviewId = value;
      this.reviewType = 'Confirmation Review Template';
      this.filterByType(1);
    } else if (value == 2) {
      this.reviewId = value;
      this.reviewType = 'Mid Year Review Templates';
      this.filterByType(2);
    } else if (value == 3) {
      this.reviewId = value;
      this.reviewType = 'Annual Review Templates';
      this.filterByType(3);
    } else if (value == 4) {
      this.reviewId = value;
      this.reviewType = 'PIP Template';
      this.filterByType(4);
    }
  }

  filterByType(type) {
    this.employeeList = [];
    if (this.selectedType == 'open') {
      if (type == 1) {
        for (let index = 0; index < this.payload.length; index++) {
          if ((this.payload[index].reviewType.toLowerCase()).includes('confirmation')) {
            this.filterByLevelForOpen(this.payload[index]);
          }
        }
      } else if (type == 2) {
        for (let index = 0; index < this.payload.length; index++) {
          if ((this.payload[index].reviewType.toLowerCase()).includes('mid-year')) {
            this.filterByLevelForOpen(this.payload[index]);
          }
        }
      } else if (type == 3) {
        for (let index = 0; index < this.payload.length; index++) {
          if ((this.payload[index].reviewType.toLowerCase()).includes('annual')) {
            this.filterByLevelForOpen(this.payload[index]);
          }
        }
      } else if (type == 4) {
        for (let index = 0; index < this.payload.length; index++) {
          if ((this.payload[index].reviewType.toLowerCase()).includes('performance')) {
            this.filterByLevelForOpen(this.payload[index]);
          }
        }
      }
    } else if (this.selectedType == 'review') {
      if (type == 1) {
        for (let index = 0; index < this.payload.length; index++) {
          if ((this.payload[index].reviewType.toLowerCase()).includes('confirmation')) {
            this.filterByLevelForPending(this.payload[index])
          }
        }
      } else if (type == 2) {
        for (let index = 0; index < this.payload.length; index++) {
          if ((this.payload[index].reviewType.toLowerCase()).includes('mid-year')) {
            this.filterByLevelForPending(this.payload[index])
          }
        }
      } else if (type == 3) {
        for (let index = 0; index < this.payload.length; index++) {
          if ((this.payload[index].reviewType.toLowerCase()).includes('annual')) {
            this.filterByLevelForPending(this.payload[index])
          }
        }
      } else if (type == 4) {
        for (let index = 0; index < this.payload.length; index++) {
          if ((this.payload[index].reviewType.toLowerCase()).includes('performance')) {
            this.filterByLevelForPending(this.payload[index])
          }
        }
      }
    } else if (this.selectedType == 'fromhr') {
      if (type == 1) {
        for (let index = 0; index < this.payload.length; index++) {
          if ((this.payload[index].reviewType.toLowerCase()).includes('confirmation')) {
            this.filterByLevelFormHR(this.payload[index])
          }
        }
      } else if (type == 2) {
        for (let index = 0; index < this.payload.length; index++) {
          if ((this.payload[index].reviewType.toLowerCase()).includes('mid-year')) {
            this.filterByLevelFormHR(this.payload[index])
          }
        }
      } else if (type == 3) {
        for (let index = 0; index < this.payload.length; index++) {
          if ((this.payload[index].reviewType.toLowerCase()).includes('annual')) {
            this.filterByLevelFormHR(this.payload[index])
          }
        }
      } else if (type == 4) {
        for (let index = 0; index < this.payload.length; index++) {
          if ((this.payload[index].reviewType.toLowerCase()).includes('performance')) {
            this.filterByLevelFormHR(this.payload[index])
          }
        }
      }
    } else {
      if (type == 1) {
        for (let index = 0; index < this.payload.length; index++) {
          if ((this.payload[index].reviewType.toLowerCase()).includes('confirmation')) {
            this.employeeList.push(this.payload[index]);
          }
        }
      } else if (type == 2) {
        for (let index = 0; index < this.payload.length; index++) {
          if ((this.payload[index].reviewType.toLowerCase()).includes('mid-year')) {
            this.employeeList.push(this.payload[index]);
          }
        }
      } else if (type == 3) {
        for (let index = 0; index < this.payload.length; index++) {
          if ((this.payload[index].reviewType.toLowerCase()).includes('annual')) {
            this.employeeList.push(this.payload[index]);
          }
        }
      } else if (type == 4) {
        for (let index = 0; index < this.payload.length; index++) {
          if ((this.payload[index].reviewType.toLowerCase()).includes('performance')) {
            this.employeeList.push(this.payload[index]);
          }
        }
      }
    }
  }

  filterByLevelForOpen(payload) {
    let status = payload.status.toLowerCase();
    let level = this.fetchLevelForOpen(status, payload.level1ReviewerName, payload.level2ReviewerName, payload.level3ReviewerName);
    if (level == CONSTANTS.REVIEWER) {
      let statusDB = [
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_HR.toLowerCase(),
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_HR.toLowerCase()
      ]
      if (statusDB.includes(status)) {
        this.employeeList.push(payload);
      }
    } else if (level == CONSTANTS.APPRAISERI) {
      let statusDB = [
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_LEVEL2.toLowerCase(),
        CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL1.toLowerCase(),
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_HR.toLowerCase(),
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_HR.toLowerCase()
      ]
      if (statusDB.includes(status)) {
        this.employeeList.push(payload);
      }
    } else if (level == CONSTANTS.APPRAISERII) {
      let statusDB = [
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL2.toLowerCase(),
        CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL2.toLowerCase(),
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_LEVEL2.toLowerCase(),
        CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL1.toLowerCase(),
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_HR.toLowerCase(),
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_HR.toLowerCase()
      ]
      if (statusDB.includes(status)) {
        this.employeeList.push(payload);
      }
    } else if (level == CONSTANTS.EMPLOYEE) {
      let statusDB = [
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL3.toLowerCase(),
        CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL3.toLowerCase(),
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL2.toLowerCase(),
        CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL2.toLowerCase(),
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_EMPLOYEE.toLowerCase(),
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_LEVEL2.toLowerCase(),
        CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL1.toLowerCase(),
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_HR.toLowerCase(),
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_HR.toLowerCase()
      ]
      if (statusDB.includes(status)) {
        this.employeeList.push(payload);
      }
    }
  }

  filterByLevelForPending(payload) {
    let status = payload.status.toLowerCase();
    let level = this.fetchLevelForPending(status, payload.level1ReviewerName, payload.level2ReviewerName, payload.level3ReviewerName);
    if (level == CONSTANTS.REVIEWER) {
      let statusDB = [
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_EMPLOYEE.toLowerCase(),
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_LEVEL2.toLowerCase(),
        CONSTANTS.REVIEW_STATUS_TEMPLATE_SELECTED_BY_LEVEL1.toLowerCase(),
        CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL1.toLowerCase(),
      ]
      if (statusDB.includes(status)) {
        this.employeeList.push(payload);
      }
    } else if (level == CONSTANTS.APPRAISERI) {
      let statusDB = [
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL2.toLowerCase(),
        CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL2.toLowerCase(),
      ]
      if (statusDB.includes(status)) {
        this.employeeList.push(payload);
      }
    } else if (level == CONSTANTS.APPRAISERII) {
      let statusDB = [
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL3.toLowerCase(),
        CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL3.toLowerCase()
      ]
      if (statusDB.includes(status)) {
        this.employeeList.push(payload);
      }
    } else if (level == CONSTANTS.EMPLOYEE) {
      let statusDB = [
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_EMPLOYEE.toLowerCase(),
        CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_EMPLOYEE.toLowerCase()
      ]
      if (statusDB.includes(status)) {
        this.employeeList.push(payload);
      }
    }
  }

  filterByLevelFormHR(payload) {
    let status = payload.status.toLowerCase();
    let level = this.fetchLevelForOpen(status, payload.level1ReviewerName, payload.level2ReviewerName, payload.level3ReviewerName);
    if (level == CONSTANTS.REVIEWER) {
      let statusDB = [
        CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_HR.toLowerCase()
      ]
      if (statusDB.includes(status)) {
        this.employeeList.push(payload);
      }
    } else if (level == CONSTANTS.APPRAISERI) {

    } else if (level == CONSTANTS.APPRAISERII) {

    } else if (level == CONSTANTS.EMPLOYEE) {

    }
  }

  fetchLevelForPending(status, level1, level2, level3) {
    if (this.MY_NAME) {
      let MY_NAME = this.MY_NAME.toLowerCase();
      if (level1) {
        if (MY_NAME == level1.toLowerCase()) {
          let statusDB = [
            CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_EMPLOYEE.toLowerCase(),
            CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_LEVEL2.toLowerCase(),
            CONSTANTS.REVIEW_STATUS_TEMPLATE_SELECTED_BY_LEVEL1.toLowerCase(),
            CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL1.toLowerCase(),
          ]
          if (statusDB.includes(status)) {
            return CONSTANTS.REVIEWER;
          }
        }
      }
      if (level2) {
        if (MY_NAME == level2.toLowerCase()) {
          let statusDB = [
            CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL2.toLowerCase(),
            CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL2.toLowerCase(),
          ]
          if (statusDB.includes(status)) {
            return CONSTANTS.APPRAISERI;
          }
        }
      }
      if (level3) {
        if (MY_NAME == level3.toLowerCase()) {
          let statusDB = [
            CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL3.toLowerCase(),
            CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL3.toLowerCase(),
          ]
          if (statusDB.includes(status)) {
            return CONSTANTS.APPRAISERII;
          }
        }
      }
    }
  }

  fetchLevelForOpen(status, level1, level2, level3) {
    if (this.MY_NAME) {
      let MY_NAME = this.MY_NAME.toLowerCase();
      if (level1) {
        if (MY_NAME == level1.toLowerCase()) {
          let statusDB = [
            CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_HR.toLowerCase(),
            CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_HR.toLowerCase()
          ]
          if (statusDB.includes(status)) {
            return CONSTANTS.REVIEWER;
          }
        }
      }
      if (level2) {
        if (MY_NAME == level2.toLowerCase()) {
          let statusDB = [
            CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_LEVEL2.toLowerCase(),
            CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL1.toLowerCase(),
            CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_HR.toLowerCase(),
            CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_HR.toLowerCase()
          ]
          if (statusDB.includes(status)) {
            return CONSTANTS.APPRAISERI;
          }
        }
      }
      if (level3) {
        if (MY_NAME == level3.toLowerCase()) {
          let statusDB = [
            CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL2.toLowerCase(),
            CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL2.toLowerCase(),
            CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_LEVEL2.toLowerCase(),
            CONSTANTS.TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL1.toLowerCase(),
            CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_HR.toLowerCase(),
            CONSTANTS.REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_HR.toLowerCase()
          ]
          if (statusDB.includes(status)) {
            return CONSTANTS.APPRAISERII;
          }
        }
      }
    }
  }

  getAllReviewInitiated() {
    this.spinner.show();
    this.reviewService.findAllReviewInitiatedRevieweesByReviewerUserId(this.userId, CONSTANTS.REVIEW_STATUS_REVIEW_INITIATED).subscribe((data) => {
      // console.log(data,' getAllReviewsInitiated');
      this.payload = data.data.performanceReviewResponses;
      this.filterByType(this.reviewId);
      this.spinner.hide();
    }, error => {
      this.payload = [];
      this.spinner.hide();
    });
  }

  getAllEmployees(status) {
    this.spinner.show();
    let STATUS = status;
    this.employeeList = [];
    this.reviewService.findAllReviewProcessedRevieweesByReviewerUserId(this.userId, STATUS).subscribe((data) => {
      this.payload = data.data.performanceReviewResponses;
      this.filterByType(this.reviewId);
      this.spinner.hide();
    }, error => {
      this.payload = [];
      this.spinner.hide();
    });
  }

  trackById(index, row) {
    return row.userId;
  }

  confirm() {
    sessionStorage.setItem('searchText', this.selectedUserName);
    this.route.navigate(['workflow']);
  }

  decline() {
    this._isDeclined = true;
    this.workflowRef.hide();
    let backup = this.bankVault;
    this.openModal(backup.row, backup.workflow, backup.chooseTemplate, backup.submitted);
  }
  // MODAL____________________________________________________________
  openModal(row, workflow: TemplateRef<any>, chooseTemplate: TemplateRef<any>, submitted: TemplateRef<any>) {
    this.id = row.id;
    this.selectedUser = row.userId;
    this.selectedUserName = row.name;
    this.selectedStatus = row.status;
    this.selectedReviewYear = row.reviewStartDate;
    this.reviewEndDate = row.reviewEndDate;
    let getIndex = (object, array): number => {
      let idx: number;
      for (let x = 0; x < array.length; x++) {
        if (array[x] == object) {
          idx = x;
        }
      }
      return idx;
    }
    let index: number = getIndex(row, this.employeeList);
    if (this.selectedType == 'initiate' && !this._isDeclined) {
      let backup = {
        row: row,
        workflow: workflow,
        chooseTemplate: chooseTemplate,
        index: index,
        id: row.id,
        userId: row.userId,
        name: row.name,
        reviewData: row.reviewData,
        status: row.status,
        reviewStartDate: row.reviewStartDate,
        reviewEndDate: row.reviewEndDate,
        level1: row.level1ReviewerName,
        level2: row.level2ReviewerName,
        level3: row.level3ReviewerName
      }
      this.bankVault = backup;
      this.workflowRef = this.modalService.show(workflow, { class: 'modal-sm', ignoreBackdropClick: true })
      return;
    }
    this._isDeclined = false;
    if (this.selectedType == 'initiate') {
      let reviewType = FUNCTIONS.REVIEWTYPE(this.reviewId);
      this.spinner.show();
      this.template.getTemplatesUntouched(reviewType).subscribe(data => {
        this.templateResponses = data.data.pmsTemplateResponses;
        this.chooseTemplateRef = this.modalService.show(chooseTemplate, { class: 'modal-md' });
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.status = CONSTANTS.FAILURE;
        this.statusMessage = CONSTANTS.FAILURE;
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
    } else if (this.selectedType == 'review' || this.selectedType == 'fromhr') {
      let content = {
        reviewId: this.reviewId,
        userId: this.selectedUser,
        name: {
          level1ReviewerName: row.level1ReviewerName,
          level2ReviewerName: row.level2ReviewerName,
          level3ReviewerName: row.level3ReviewerName,
          revieweeName: name
        },
        roleType: null,
        index: null,
        status: status,
        reviewData: JSON.stringify(row.reviewData),
        reviewStartDate: this.selectedReviewYear,
        reviewEndDate: this.reviewEndDate,
        route: this.currentRoute,
        id: this.id,
        dropType: this.dropType,
        level: this.fetchLevel(row.level1ReviewerName, row.level2ReviewerName, row.level3ReviewerName)
      }
      localStorage.setItem('reviewTypeFromEmployee', this.reviewId.toString());
      sessionStorage.setItem('content', encodeURIComponent(JSON.stringify(content)));
      this.route.navigate(['review']);
    } else if (this.selectedType == 'open') {
      let rData = JSON.parse(row.reviewData);
      if (rData != null && rData) {
        this.selectedReviewData = rData.data;
        let templateResponses = this.selectedReviewData.templateResponses[0];
        if (templateResponses) {
          this.submittedObj = templateResponses.submitted;
          let level = this.fetchLevel(row.level1ReviewerName, row.level2ReviewerName, row.level3ReviewerName);
          this.fetchRole(level);
          this.createList = [];
          this.addToAccordian(this.selectedReviewData.templateResponses[0].categoryResponses);
          this._isTemplateAvailable = true;
        } else {
          this._isTemplateAvailable = false;
        }
        this.submittedRef = this.modalService.show(submitted, { class: 'modal-lg' });
      }
    }
  }

  fetchLevel(level1, level2, level3) {
    if (this.MY_NAME) {
      let MY_NAME = this.MY_NAME.toLowerCase();
      if (level1) {
        if (MY_NAME == level1.toLowerCase()) {
          return CONSTANTS.REVIEWER;
        }
      }
      if (level2) {
        if (MY_NAME == level2.toLowerCase()) {
          return CONSTANTS.APPRAISERI;
        }
      }
      if (level3) {
        if (MY_NAME == level3.toLowerCase()) {
          return CONSTANTS.APPRAISERII;
        }
      }
    }
  }

  openReview(reviewRef, userId, reviewData, status, level1, level2, level3) {
    let rData = JSON.parse(reviewData);
    if (rData != null && rData) {
      this.selectedReviewData = rData.data;
      let templateResponses = this.selectedReviewData.templateResponses[0];
      if (templateResponses) {
        this.submittedObj = templateResponses.submitted;
        let level = this.fetchLevel(level1, level2, level3);
        this.fetchRole(level);
        this.createList = [];
        this.addToAccordian(this.selectedReviewData.templateResponses[0].categoryResponses);
        this._isTemplateAvailable = true;
      } else {
        this._isTemplateAvailable = false;
      }
      this.submittedRef = this.modalService.show(reviewRef, { class: 'modal-lg' });
    }
  }

  // Only Higher level can view
  fetchRole(level) {
    this.roleType = [];
    if (level == CONSTANTS.REVIEWER) {
      if (this.submittedObj.employee != null) {
        this.roleType.push(CONSTANTS.EMPLOYEE);
      }
      if (this.submittedObj.level3 != null) {
        this.roleType.push(CONSTANTS.APPRAISERII);
      }
      if (this.submittedObj.level2 != null) {
        this.roleType.push(CONSTANTS.APPRAISERI);
      }
      if (this.submittedObj.level1 != null) {
        this.roleType.push(CONSTANTS.REVIEWER);
      }
    } else if (level == CONSTANTS.APPRAISERI) {
      if (this.submittedObj.employee != null) {
        this.roleType.push(CONSTANTS.EMPLOYEE);
      }
      if (this.submittedObj.level3 != null) {
        this.roleType.push(CONSTANTS.APPRAISERII);
      }
      if (this.submittedObj.level2 != null) {
        this.roleType.push(CONSTANTS.APPRAISERI);
      }
    } else if (level == CONSTANTS.APPRAISERII) {
      if (this.submittedObj.employee != null) {
        this.roleType.push(CONSTANTS.EMPLOYEE);
      }
      if (this.submittedObj.level3 != null) {
        this.roleType.push(CONSTANTS.APPRAISERII);
      }
    } else if (level == CONSTANTS.EMPLOYEE) {

    }
    if (this.roleType.length > 0) {
      this.selectedRole = this.roleType[0];
      this.data.setSelectedRole(this.selectedRole);
    }
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

  openNestedModal(viewTemplate: TemplateRef<any>, index) {
    if (true) {
      this.selectedIdx = index;
      this.viewTemplateRef = this.modalService.show(viewTemplate, { class: 'second modal-lg' });
    }
  }

  closeFirstModal() {
    if (!this.chooseTemplateRef) {
      return;
    }
    this.chooseTemplateRef.hide();
    this.chooseTemplateRef = null;
  }

  async saveTemplate() {
    await this.initiateProcess(this.selectedIndex);
  }

  async editTemplate(x) {
    let response = JSON.parse(JSON.stringify(this.templateResponses[x]));
    let requests = this.formservice.convertToRequests(response, x, this.reviewId, true);
    localStorage.setItem('Template', encodeURI(JSON.stringify(requests)));
    let otherData = {
      id: this.id,
      userId: this.selectedUser,
      pgno: this.p,
      reviewId: this.reviewId,
      status: this.selectedStatus,
      reviewStartDate: this.selectedReviewYear,
      reviewEndDate: this.reviewEndDate
    }
    localStorage.setItem('otherData', JSON.stringify(otherData));
    this.route.navigate(['template', 'edit']);
  }


  async initiateProcess(index) {
    this.spinner.show();
    var type;
    if (this.reviewId == 1) {
      type = CONSTANTS.REVIEW_TYPE_CONFIRMATION
    } else if (this.reviewId == 2) {
      type = CONSTANTS.REVIEW_TYPE_MIDYEAR
    } else if (this.reviewId == 3) {
      type = CONSTANTS.REVIEW_TYPE_ANNUAL
    } else if (this.reviewId == 4) {
      type = CONSTANTS.REVIEW_TYPE_PIP
    }
    await this.convertTemplateResponse(index);
    let templateRequests = this.templateRequests
    var reviewData = {
      'reviewType': type,
      'templateRequests': templateRequests
    };

    // console.log(reviewData);

    var payload = {
      "saveAsDraft": false,
      'performanceReviewRequests': [{
        "id": this.id,
        "userId": this.selectedUser,
        "reviewId": this.reviewId,
        'reviewType': type,
        "reviewStartDate": this.selectedReviewYear,
        "reviewEndDate": this.reviewEndDate,
        "reviewData": encodeURIComponent(JSON.stringify({ 'data': reviewData })),
        "status": this.selectedStatus,
        "rating": null
      }]
    }
    this.template.editTemplate(payload).subscribe((data: any) => {
      this.spinner.hide();
      this.statusMessage = CONSTANTS.REVIEW_PROCESSES_SUCCESS;
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
    // this.vault = templateRequests;
  }

  async convertTemplateResponse(index) {
    let vault = {
      "submitted": {
        "employee": null,
        "level3": null,
        "level2": null,
        "level1": null
      },
      "roleType": this.templateResponses[index].roleType,
      "employeeRating": null,
      "employeeComments": null,
      "level1Rating": null,
      "level1Comments": null,
      "level2Rating": null,
      "level2Comments": null,
      "level3Rating": null,
      "level3Comments": null,
      "categoryRequests": this.templateResponses[index].categoryResponses
    }
    await this.removeResponses(vault);
    await this.deleteResponses(vault);
  }

  async removeResponses(vault) {
    for (let q = 0; q < vault.categoryRequests.length; q++) {
      vault.categoryRequests[q]['subCategoryRequests'] = vault.categoryRequests[q].subCategoryResponses;
      if (vault.categoryRequests[q].subCategoryRequests) {
        for (let w = 0; w < vault.categoryRequests[q].subCategoryRequests.length; w++) {
          if ((vault.categoryRequests[q].subCategoryRequests[w].type.toLowerCase()) == 'text') {
            vault.categoryRequests[q].subCategoryRequests[w]['textRequest'] = this.buildLevel();
            vault.categoryRequests[q].subCategoryRequests[w]['textAreaRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['dropDownRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['tableRequest'] = null;
          }
          else if ((vault.categoryRequests[q].subCategoryRequests[w].type.toLowerCase()) == 'textarea' || (vault.categoryRequests[q].subCategoryRequests[w].type.toLowerCase()) == 'text area') {
            vault.categoryRequests[q].subCategoryRequests[w]['textAreaRequest'] = this.buildLevel();
            vault.categoryRequests[q].subCategoryRequests[w]['textRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['dropDownRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['tableRequest'] = null;
          } else if ((vault.categoryRequests[q].subCategoryRequests[w].type.toLowerCase()) == 'dropdown') {
            vault.categoryRequests[q].subCategoryRequests[w]['textAreaRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['textRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['tableRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['dropDownRequest'] = vault.categoryRequests[q].subCategoryRequests[w].dropDownResponse;
            if (vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest != null) {
              vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownDefaultRequests = vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownDefaultResponses;
              vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownSelectedRequest = this.buildLevel();
            }
          } else if ((vault.categoryRequests[q].subCategoryRequests[w].type.toLowerCase()) == 'table') {
            vault.categoryRequests[q].subCategoryRequests[w]['textAreaRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['textRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['dropDownRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['tableRequest'] = vault.categoryRequests[q].subCategoryRequests[w].tableResponse;
            if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest != null) {
              vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderResponses;
              // vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests = await this.buildHeader(vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderResponses);
              if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests) {
                vault.categoryRequests[q].subCategoryRequests[w].tableRequest['tableValueListRequests'] = null;
                // vault.categoryRequests[q].subCategoryRequests[w].tableRequest['tableValueListRequests'] = await this.replicateHeader(vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderResponses);
              }
              if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests) {
                for (let e = 0; e < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests.length; e++) {
                  if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].type == 'text') {
                    // vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e]['textRequest'] = this.buildLevel();
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e]['dropDownDefaultRequests'] = null;
                  } else if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].type == 'dropdown') {
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e]['dropDownDefaultRequests'] = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].dropDownDefaultResponses;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // buildHeader(header) {
  //   if (header) {
  //     let headerValue = []
  //     for (let index = 0; index < header.length; index++) {
  //       let head = header[index];
  //       delete header[index].textRequest;
  //       delete header[index].dropDownSelectedRequest;
  //       headerValue.push(head)
  //     }
  //     return headerValue;
  //   } else {
  //     return null;
  //   }
  // }

  // replicateHeader(header) {
  //   if (header) {
  //     let valueList = [
  //       {
  //         // tid: 0,
  //         tableValueRequests: []
  //       }
  //     ];
  //     for (let index = 0; index < header.length; index++) {
  //       let head = header[index]
  //       delete head.id;
  //       delete head.name;
  //       delete head.columnName;
  //       delete head.dropDownDefaultRequests;
  //       // head['t_id'] = index
  //       if (head.type.toLowerCase() == 'text') {
  //         head['textRequest'] = this.buildLevel();
  //         head['dropDownSelectedRequest'] = null;
  //       } else if (head.type.toLowerCase() == 'dropdown') {
  //         head['textRequest'] = null;
  //         head['dropDownSelectedRequest'] = this.buildLevel();
  //       }
  //       valueList[0].tableValueRequests.push(head);
  //     }
  //     return valueList;
  //   } else {
  //     return null;
  //   }
  // }

  deleteResponses(vault) {
    for (let q = 0; q < vault.categoryRequests.length; q++) {
      delete vault.categoryRequests[q].subCategoryResponses;
      for (let w = 0; w < vault.categoryRequests[q].subCategoryRequests.length; w++) {
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
          if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests) {
            for (let e = 0; e < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests.length; e++) {
              delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].textRequest;
              delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].dropDownSelectedRequest;
              delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].dropDownDefaultResponses;
            }
          }
          // if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests) {
          //   for (let r = 0; r < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests.length; r++) {
          //     for (let t = 0; t < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests.length; t++) {
          //       delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].id;
          //       delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].name;
          //       delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].columnName;
          //       delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].dropDownDefaultRequests;
          //     }
          //   }
          // }
        }
      }
    }
    let templateRequests = [];
    templateRequests.push(vault);
    this.templateRequests = templateRequests;
  }

  buildLevel() {
    let level = {
      employee: null,
      level1: null,
      level2: null,
      level3: null
    }
    return level;
  }

  ngOnDestroy() {
    if (this.chooseTemplateRef) {
      this.chooseTemplateRef.hide()
    }
    if (this.viewTemplateRef) {
      this.viewTemplateRef.hide()
    }
    if (this.submittedRef) {
      this.submittedRef.hide()
    }
    if (this.workflowRef) {
      this.workflowRef.hide()
    }
  }
}
