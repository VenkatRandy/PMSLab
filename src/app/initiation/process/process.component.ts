import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { TemplateService } from 'src/app/service/template.service';
import { ReviewService } from 'src/app/service/review.service';
import { REVIEW_STATUS_REVIEW_INITIATED } from 'src/app/variable-constants';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styles: ['']
})
export class ProcessComponent implements OnInit {
  userDetails;
  observable
  payloadV = {
    "data": {
      "code": null, "responseDescription": null, "responseStatus": "success", "reviewType": "Confirmation", "pmsTemplateResponses": [
        { "roleType": null, "categoryResponses": [{ "id": 3, "name": "Skills", "type": null, "subCategoryResponses": [{ "id": 3, "name": "Rating", "description": "Rating", "type": "table", "tableResponse": { "tableHeaderResponses": [{ "id": 1, "name": null, "description": "c1", "type": "text", "columnName": "c1", "dropDownDefaultResponses": null }, { "id": 2, "name": null, "description": "c2", "type": "dropdown", "columnName": "c2", "dropDownDefaultResponses": [{ "id": 1, "key": "", "value": "1" }, { "id": 2, "key": "", "value": "2" }, { "id": 3, "key": "", "value": "3" }] }] }, "dropDownResponse": null }] }] },
        // { "roleType": null, "categoryResponses": [{ "id": 3, "name": "Skills", "type": null, "subCategoryResponses": [{ "id": 3, "name": "Rating", "description": "Rating", "type": "table", "tableResponse": { "tableHeaderResponses": [{ "id": 1, "name": null, "description": "c1", "type": "text", "columnName": "c1", "dropDownDefaultResponses": null }, { "id": 2, "name": null, "description": "c2", "type": "dropdown", "columnName": "c2", "dropDownDefaultResponses": [{ "id": 1, "key": "", "value": "1" }, { "id": 2, "key": "", "value": "2" }, { "id": 3, "key": "", "value": "3" }] }] }, "dropDownResponse": null }] }] },
        // { "roleType": null, "categoryResponses": [{ "id": 3, "name": "Skills", "type": null, "subCategoryResponses": [{ "id": 3, "name": "Rating", "description": "Rating", "type": "table", "tableResponse": { "tableHeaderResponses": [{ "id": 1, "name": null, "description": "c1", "type": "text", "columnName": "c1", "dropDownDefaultResponses": null }, { "id": 2, "name": null, "description": "c2", "type": "dropdown", "columnName": "c2", "dropDownDefaultResponses": [{ "id": 1, "key": "", "value": "1" }, { "id": 2, "key": "", "value": "2" }, { "id": 3, "key": "", "value": "3" }] }] }, "dropDownResponse": null }] }] },
        // { "roleType": null, "categoryResponses": [{ "id": 3, "name": "Skills", "type": null, "subCategoryResponses": [{ "id": 3, "name": "Rating", "description": "Rating", "type": "table", "tableResponse": { "tableHeaderResponses": [{ "id": 1, "name": null, "description": "c1", "type": "text", "columnName": "c1", "dropDownDefaultResponses": null }, { "id": 2, "name": null, "description": "c2", "type": "dropdown", "columnName": "c2", "dropDownDefaultResponses": [{ "id": 1, "key": "", "value": "1" }, { "id": 2, "key": "", "value": "2" }, { "id": 3, "key": "", "value": "3" }] }] }, "dropDownResponse": null }] }] },
        // { "roleType": null, "categoryResponses": [{ "id": 3, "name": "Skills", "type": null, "subCategoryResponses": [{ "id": 3, "name": "Rating", "description": "Rating", "type": "table", "tableResponse": { "tableHeaderResponses": [{ "id": 1, "name": null, "description": "c1", "type": "text", "columnName": "c1", "dropDownDefaultResponses": null }, { "id": 2, "name": null, "description": "c2", "type": "dropdown", "columnName": "c2", "dropDownDefaultResponses": [{ "id": 1, "key": "", "value": "1" }, { "id": 2, "key": "", "value": "2" }, { "id": 3, "key": "", "value": "3" }] }] }, "dropDownResponse": null }] }] }
      ]
    }
  }

  payloadJ = { "data": { "reviewType": "Confirmation", "templateResponses": [{ "employeeRating": "", "employeeComments": "", "level1Rating": "", "level1Comments": "", "level2Rating": "", "level2Comments": "", "level3Rating": "", "level3Comments": "", "roleType": null, "categoryResponses": [{ "name": "Factor", "type": null, "subCategoryResponses": [{ "name": "Skills", "description": null, "type": "Table", "tableResponse": { "tableHeaderResponses": [{ "name": null, "description": "Skills Type", "type": "Text", "columnName": "Skills Type", "dropDownDefaultResponses": null }, { "name": null, "description": "Skills Description", "type": "Text", "columnName": "Skills Description", "dropDownDefaultResponses": null }, { "name": null, "description": null, "type": "DropDown", "columnName": "Rating", "dropDownDefaultResponses": [{ "key": "Outstanding", "value": "4" }, { "key": "Exceed Expectations", "value": "3" }, { "key": "Meet Expectations", "value": "2" }, { "key": "Below Expectations", "value": "1" }] }, { "name": null, "description": null, "type": "DropDown", "columnName": "Rating", "dropDownDefaultResponses": [{ "key": "Outstandddddddddddddding", "value": "4" }, { "key": "Exceed Esssadasdxpectations", "value": "3" }, { "key": "Meet Expeasfasfctations", "value": "2" }, { "key": "Belowasfsaf Expectations", "value": "1" }] }], "tableValueListResponses": [{ "tableValueResponses": [{ "type": "Text", "textResponse": { "employee": "", "level1": "rgfhrr", "level2": "", "level3": "" }, "dropDownSelectedResponse": null }, { "type": "Text", "textResponse": { "employee": "", "level1": "", "level2": "", "level3": "" }, "dropDownSelectedResponse": null }, { "type": "DropDown", "textResponse": null, "dropDownSelectedResponse": { "employee": "", "level1": "", "level2": "", "level3": "4" } }, { "type": "DropDown", "textResponse": null, "dropDownSelectedResponse": { "employee": "", "level1": "", "level2": "", "level3": "" } }] }] }, "dropDownResponse": null, "textAreaResponse": null, "textResponse": null }, { "name": "Communication", "description": null, "type": "Text", "textResponse": { "employee": "22", "level1": "rejrje", "level2": "", "level3": "" }, "tableResponse": null, "textAreaResponse": null, "dropDownResponse": null }, { "name": "Explanation of Performance Rating", "description": null, "type": "DropDown", "textResponse": null, "textAreaResponse": null, "tableResponse": null, "dropDownResponse": { "dropDownDefaultResponses": [{ "key": "Outstanding", "value": "4" }, { "key": "Exceed Expectations", "value": "3" }, { "key": "Meet Expectations", "value": "2" }, { "key": "Below Expectations", "value": "1" }], "dropDownSelectedResponse": { "employee": "", "level1": "rehedhr", "level2": "", "level3": "" } } }] }, { "name": "Summary", "type": null, "subCategoryResponses": [{ "name": "Reviewer’s summary of Reviewee’s performance", "description": null, "type": "Text Area", "textAreaResponse": { "employee": "", "level1": "", "level2": "", "level3": "" }, "textResponse": null, "tableResponse": null, "dropDownResponse": null }] }, { "name": "Recommendations", "type": null, "subCategoryResponses": [{ "name": "Confirmation Recommendations - Reviewer:", "description": null, "type": "Text Area", "textAreaResponse": { "employee": "", "level1": "", "level2": "", "level3": "" }, "textResponse": null, "tableResponse": null, "dropDownResponse": null }] }] }] } }

  userId;
  employeeList: any;
  selectedUser;
  payload = [];
  templatePayload;
  reviewType = 'Confirmation Review Template';
  roleType = ['Level 1', 'Level 2', 'Level 3']
  p: number = 1;
  searchText = '';
  head = ["Emp. No.", "Name", "Review Date", "Status", "Initiate"];
  modalRef: BsModalRef | null;
  modalRef2: BsModalRef;
  reviewId: number;
  _isFirstTime = true;
  status;

  constructor(private spinner: NgxSpinnerService, private reviewService: ReviewService, private route: Router, private router: ActivatedRoute, private data: DataService, private modalService: BsModalService, public template: TemplateService) { }

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem('User Details'));
    this.userId = this.userDetails.userId;
    this.router.queryParams.subscribe(params => {
      this.reviewId = params.reviewId;
      if (params.pgno) {
        this.p = params.pgno;
      }
      // console.log("Im Called");
      this.getAllReviewInitiated();
    })
  }

  getTabNumber(value) {
    // console.log(value);
    if (value == 1) {
      this.reviewType = 'Confirmation Review Template';
      this.filterByType(1);
    } else if (value == 2) {
      this.reviewType = 'Mid Year Review Templates';
      this.filterByType(2);
    } else if (value == 3) {
      this.reviewType = 'Annual Review Templates';
      this.filterByType(3);
    } else if (value == 4) {
      this.reviewType = 'PIP Template';
      this.filterByType(4);
    }
  }

  filterByType(type) {
    // console.log(this.payload);
    this.employeeList = [];
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

  getAllReviewInitiated() {
    this.spinner.show();
    this.reviewService.findAllReviewInitiatedRevieweesByReviewerUserId(this.userId, REVIEW_STATUS_REVIEW_INITIATED).subscribe((data) => {
      this.payload = data.data.performanceReviewResponses;
      // console.log(this.payload);
      this.filterByType(this.reviewId);
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
    });
  }

  trackById(index, row) {
    return row.userId;
  }

  // MODAL____________________________________________________________
  openModal(template: TemplateRef<any>, index, userId) {
    this.selectedUser = userId;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, { class: 'second modal-lg' });
  }
  closeFirstModal() {
    if (!this.modalRef) {
      return;
    }
    this.modalRef.hide();
    this.modalRef = null;
  }
  // \.MODAL___________________________________________________________

  editTemplate() {
    //this.data.setTemplateValue(this.payload.data.templateResponses[0]);
    localStorage.setItem('Template Data', encodeURI(JSON.stringify(this.payloadJ.data.templateResponses[0])));
    this.route.navigate(['edit/template'], { queryParams: { pgno: this.p, reviewId: this.reviewId, userId: this.selectedUser } });
  }

  // ngOnDestroy() {
  //   this.serviceSubscription.unsubscribe();
  // }
}
