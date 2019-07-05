import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
import { CONSTANTS, FUNCTIONS } from 'src/app/variable-constants';
import { PopoverDirective } from 'ngx-bootstrap/popover/public_api';

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styles: ['']
})
export class ViewHistoryComponent implements OnInit {
  payload;
  // roleType = ['Self', 'Level 1', 'Level 2', 'Level 3'];
  // roleType: any = ['Self', 'Level 1 - Manager', 'Level 2 - Lead', 'Level 3 - Developer & QA Analyst'];
  roleType: any = [];
  selectedRole;
  _isTemplateAvailable: boolean;
  form: FormGroup;
  createList: any = [];
  self: number;
  reviewId: number;
  role;

  level;
  rate;
  comments: string;
  weightage;
  count = 0;
  popRef: PopoverDirective;

  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router) {
    this.titleService.setTitle("Review History");
    this.route.queryParams.subscribe(params => {
      this.self = params.self,
        this.reviewId = params.review_id;
    });
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

  ngOnInit() {
    // console.log(localStorage.getItem('reviewData'));
    this.payload = JSON.parse(localStorage.getItem('reviewData'));
    // console.log(JSON.stringify(this.payload));
    if (this.payload != undefined || this.payload != null) {
      this._isTemplateAvailable = true;
      this.addToAccordian(this.payload.templateResponses[0].categoryResponses);
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
      this.comments = this.payload.templateResponses[0].postReviewRevieweeComments;
    } else {
      this._isTemplateAvailable = false;
    }
    if (this.payload) {
      let templateResponses = this.payload.templateResponses[0];
      let submittedObj = templateResponses.submitted;
      if (submittedObj.employee != null) {
        this.roleType.push(CONSTANTS.EMPLOYEE);
        this.selectedRole = CONSTANTS.EMPLOYEE;
      }
      if (submittedObj.level3 != null) {
        this.roleType.push(CONSTANTS.APPRAISERII);
        this.selectedRole = CONSTANTS.APPRAISERII;
      }
      if (submittedObj.level2 != null) {
        this.roleType.push(CONSTANTS.APPRAISERI);
        this.selectedRole = CONSTANTS.APPRAISERI;
      }
      if (submittedObj.level1 != null) {
        this.roleType.push(CONSTANTS.REVIEWER);
        this.selectedRole = CONSTANTS.REVIEWER;
      }
    }
    this.processRating();
  }

  initializeForm() {
    this.form = this.fb.group({
      categoryRequests: this.fb.array([])
    });
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

  goBack() {
    this.router.navigate(['review-history'], { queryParams: { self: this.self, review_id: this.reviewId } })
  }

  processRating() {
    if (this.selectedRole == CONSTANTS.REVIEWER) {
      this.rate = this.payload.templateResponses[0].level1Rating;
    } else if (this.selectedRole == CONSTANTS.APPRAISERI) {
      this.rate = this.payload.templateResponses[0].level2Rating;
    } else if (this.selectedRole == CONSTANTS.APPRAISERII) {
      this.rate = this.payload.templateResponses[0].level3Rating;
    } else if (this.selectedRole == CONSTANTS.EMPLOYEE) {
      this.rate = this.payload.templateResponses[0].employeeRating
    }

    if (this.rate) {
      if (this.reviewId == 1) {
        if (this.rate == 4) {
          this.level = CONSTANTS.RATING_OUTSTANDING;
        } else if (this.rate == 3) {
          this.level = CONSTANTS.RATING_EXCEED;
        } else if (this.rate == 2) {
          this.level = CONSTANTS.RATING_MEET;
        } else if (this.rate == 1) {
          this.level = CONSTANTS.RATING_BELOW;
        }
      } else if (this.reviewId == 3) {
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
      this.level = CONSTANTS.RATING_BELOW;
    }
  }

  typeChanged() {
    this.processRating();
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
}
