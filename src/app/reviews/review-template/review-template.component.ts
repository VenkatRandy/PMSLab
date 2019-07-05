import { Component, OnInit, TemplateRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TemplateService } from 'src/app/service/template.service';
import { CONSTANTS, FUNCTIONS } from 'src/app/variable-constants';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/service/data.service';
import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormService } from 'src/app/service/form.service';
import { Title } from '@angular/platform-browser';
import { StorageService } from 'src/app/service/storage.service';
import { PopoverDirective } from 'ngx-bootstrap/popover/public_api';

@Component({
  selector: 'app-review-template',
  templateUrl: './review-template.component.html',
  styles: ['']
})

export class ReviewTemplateComponent implements OnInit, OnDestroy {
  currentRoute;
  review;
  form: FormGroup;
  createList: any = [];
  weightage;
  createReviewList: any = [];
  closeOthers = true;
  openAll = false;
  level: string;
  _isEditMode: boolean = false;
  _isAddMode: boolean = false;
  _insideTable = 'insideTable';
  _outsideTable = 'outsideTable';
  submitted = false;
  reviewId;
  userId;
  roleType = [];
  reviewData;
  index;
  reviewType;
  prevStatus;
  // curDate;
  response;
  status;
  disableButton = false;
  modalRef: BsModalRef;
  modalReviewRef: BsModalRef;
  modalRefList: BsModalRef | null;
  modalRefView: BsModalRef;
  currentRef: BsModalRef | null;
  config = {
    backdrop: true,
    ignoreBackdropClick: false
  };
  invalidR = false;
  performanceReviewResponses;
  previousStatus;
  content;
  id;
  @ViewChild('choose', { static: false }) chooseTemplate: ElementRef;
  // Comments
  employeeRating = null;
  employeeComments = null;
  level1Rating = null;
  level1Comments = null;
  level2Rating = null;
  level2Comments = null;
  level3Rating = null;
  level3Comments = null;
  _isCommentsEntered = false;
  comments;
  dropType = false;
  // overallCmt;
  // overallRtg;
  statusMessage: string;

  selectedRole;
  _isTemplateAvailable: boolean;

  otherForm;

  weightageRef: BsModalRef | null;
  reviewStartDate: Date;
  saveType;
  rate;
  rateValue;

  reviewRate;
  reviewRateValue;

  reviewEndDate;

  invalid: string;
  WEIGHTAGE_EXCEED = [];

  level1ReviewerName;
  level2ReviewerName;
  level3ReviewerName;
  revieweeName;
  submittedObj;

  count = 0;
  popRef: PopoverDirective;

  goBack() {
    if (this.currentRoute) {
      if (this.currentRoute.includes('/review/employee')) {
        // localStorage.setItem('reviewTypeFromEmployee', this.reviewId);
        this.route.navigate(['review', 'employee']);
      } else {
        this.route.navigate(['review', 'self']);
      }
    } else {
      this.route.navigate(['review', 'self']);
    }
  }

  constructor(
    private titleService: Title,
    private route: Router,
    private router: ActivatedRoute,
    private template: TemplateService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private dataService: DataService,
    private datePipe: DatePipe,
    private modalService: BsModalService,
    private formbuilder: FormService,
    private storage: StorageService
  ) {
    this.titleService.setTitle("Review");
  }

  open(pop: PopoverDirective) {
    this.count = 1;
    this.popRef = pop;
    pop.show();
  }

  ngOnInit() {
    this.spinner.show();
    this.invalid = CONSTANTS.INVALID_FORM;
    this.form = undefined;
    this.dataService.setSubmitted(false);
    this.content = CONSTANTS.CONTENT;
    // console.log(this.content);
    if (this.content) {
      this.currentRoute = this.content.route;
      if (this.currentRoute.includes('/review/employee')) {
        this.reviewId = this.content.reviewId;
        this.userId = this.content.userId;
        // this.roleType = this.content.roleType;
        this.index = this.content.index;
        this.prevStatus = this.content.status;
        this.id = this.content.id;
        this.reviewStartDate = this.content.reviewStartDate;
        this.reviewEndDate = this.content.reviewEndDate;
        this.level1ReviewerName = this.content.name.level1ReviewerName;
        this.level2ReviewerName = this.content.name.level2ReviewerName;
        this.level3ReviewerName = this.content.name.level3ReviewerName;
        this.revieweeName = this.content.name.revieweeName;
        this.level = this.content.level;
        if (this.content.reviewData) {
          this.reviewData = JSON.parse(JSON.parse(this.content.reviewData));
        }
        this.bulkCallBackEmployee();
      } else {
        this.reviewId = this.content.reviewId;
        this.userId = this.content.userId;
        // this.roleType = this.content.roleType;
        this.index = this.content.index;
        this.prevStatus = this.content.status;
        this.id = this.content.id;
        this.reviewStartDate = this.content.reviewStartDate;
        this.reviewEndDate = this.content.reviewEndDate;
        if (this.content.reviewData) {
          this.reviewData = JSON.parse(JSON.parse(this.content.reviewData));
        }
        this.level = CONSTANTS.EMPLOYEE;
        this.bulkCallBackSelf();
      }
    }

    // if (this.reviewId != 3) {
    //   this.overallCmt = 2;
    //   this.overallRtg = 1;
    // } else {
    //   this.overallCmt = 1;
    //   this.overallRtg = 0;
    // }
    // setTimeout(() => {
    //   console.warn(this.form);
    // }, 5000);

    // // ROLE
    // this.fetchRole();

    // setTimeout(() => {
    //   console.warn(JSON.stringify(this.form.value));
    // }, 5000);
  }

  // Only Higher level can view
  fetchRole() {
    this.roleType = [];
    if (this.level == CONSTANTS.REVIEWER) {
      if (this.submittedObj.employee != null) {
        this.roleType.push(CONSTANTS.EMPLOYEE);
      }
      if (this.submittedObj.level3 != null) {
        this.roleType.push(CONSTANTS.APPRAISERII);
      }
      if (this.submittedObj.level2 != null) {
        this.roleType.push(CONSTANTS.APPRAISERI);
      }
    } else if (this.level == CONSTANTS.APPRAISERI) {
      if (this.submittedObj.employee != null) {
        this.roleType.push(CONSTANTS.EMPLOYEE);
      }
      if (this.submittedObj.level3 != null) {
        this.roleType.push(CONSTANTS.APPRAISERII);
      }
    } else if (this.level == CONSTANTS.APPRAISERII) {
      if (this.submittedObj.employee != null) {
        this.roleType.push(CONSTANTS.EMPLOYEE);
      }
    } else if (this.level == CONSTANTS.EMPLOYEE) {

    }
    if (this.roleType.length > 0) {
      this.selectedRole = this.roleType[0];
    }
  }


  async bulkCallBackEmployee() {
    await this.initializeForm();
    this.submittedObj = this.reviewData.data.templateResponses[0].submitted;
    console.log(this.submittedObj);
    
    let categoryResponses = this.reviewData.data.templateResponses[0].categoryResponses;
    this.employeeComments = this.reviewData.data.templateResponses[0].employeeComments;
    this.level1Comments = this.reviewData.data.templateResponses[0].level1Comments;
    this.level2Comments = this.reviewData.data.templateResponses[0].level2Comments;
    this.level3Comments = this.reviewData.data.templateResponses[0].level3Comments;
    this.employeeRating = this.reviewData.data.templateResponses[0].employeeRating;
    this.level1Rating = this.reviewData.data.templateResponses[0].level1Rating;
    this.level2Rating = this.reviewData.data.templateResponses[0].level2Rating;
    this.level3Rating = this.reviewData.data.templateResponses[0].level3Rating;
    await this.processLevel();
    await this.patch(categoryResponses);
    await this.scanCategoryForKRA();
  }

  async bulkCallBackSelf() {
    await this.initializeForm();
    this.submittedObj = this.reviewData.data.templateResponses[0].submitted;
    this.employeeComments = this.reviewData.data.templateResponses[0].employeeComments;
    this.level1Comments = this.reviewData.data.templateResponses[0].level1Comments;
    this.level2Comments = this.reviewData.data.templateResponses[0].level2Comments;
    this.level3Comments = this.reviewData.data.templateResponses[0].level3Comments;
    this.employeeRating = this.reviewData.data.templateResponses[0].employeeRating;
    this.level1Rating = this.reviewData.data.templateResponses[0].level1Rating;
    this.level2Rating = this.reviewData.data.templateResponses[0].level2Rating;
    this.level3Rating = this.reviewData.data.templateResponses[0].level3Rating;
    let categoryResponses = this.reviewData.data.templateResponses[0].categoryResponses;
    await this.patch(categoryResponses);
    await this.scanCategoryForKRA();
  }

  initializeForm() {
    this.form = this.fb.group({
      categoryRequests: this.fb.array([])
    });
  }

  processLevel() {
    this.fetchRole();
  }

  /**
* validateWeightage
*  */
  // validateWeightage(z) {
  //   let categoryRequests = this.form.get(`categoryRequests.${z}.textRequest`).value;
  //   if (categoryRequests) {
  //     let value;
  //     if (this.level == CONSTANTS.EMPLOYEE) {
  //       value = this.form.get(`categoryRequests.${z}.textRequest.employee`).value;
  //     } else if (this.level == CONSTANTS.REVIEWER) {
  //       value = this.form.get(`categoryRequests.${z}.textRequest.level1`).value;
  //     } else if (this.level == CONSTANTS.APPRAISERI) {
  //       value = this.form.get(`categoryRequests.${z}.textRequest.level2`).value;
  //     } else if (this.level == CONSTANTS.APPRAISERII) {
  //       value = this.form.get(`categoryRequests.${z}.textRequest.level3`).value;
  //     }
  //     if (value) {
  //       if (value >= categoryRequests.weightage) {
  //         console.warn(categoryRequests.textRequest, " - ", categoryRequests.weightage);
  //         let weight = value.toString().slice(0, -1);
  //         if (this.level == CONSTANTS.EMPLOYEE) {
  //           value = this.form.get(`categoryRequests.${z}.textRequest.employee`).setValue(weight);
  //         } else if (this.level == CONSTANTS.REVIEWER) {
  //           value = this.form.get(`categoryRequests.${z}.textRequest.level1`).setValue(weight);
  //         } else if (this.level == CONSTANTS.APPRAISERI) {
  //           value = this.form.get(`categoryRequests.${z}.textRequest.level2`).setValue(weight);
  //         } else if (this.level == CONSTANTS.APPRAISERII) {
  //           value = this.form.get(`categoryRequests.${z}.textRequest.level3`).setValue(weight);
  //         }
  //       }
  //     }
  //   }
  // }

  // public removeValidators(form: FormGroup) {
  //   for (const key in form.controls) {
  //     form.get(key).clearValidators();
  //     form.get(key).updateValueAndValidity();
  //   }
  // }

  public scanCategoryForKRA() {
    let categoryRequests = this.form.get(`categoryRequests`).value;
    for (let m = 0; m < categoryRequests.length; m++) {
      let weightageAgainstKRA = this.form.get(`categoryRequests.${m}.weightageAgainstKRA`).value;
      if (weightageAgainstKRA) {
        // this.form.get(`categoryRequests.${m}.kra`).setValidators([Validators.required]);
        let subCategoryRequests = this.form.get(`categoryRequests.${m}.subCategoryRequests`).value;
        for (let n = 0; n < subCategoryRequests.length; n++) {
          let trimString = subCategoryRequests[n].type;
          let type = FUNCTIONS.TRIM(trimString);
          if (type == 'table') {
            let tableValueListRequests = this.form.get(`categoryRequests.${m}.subCategoryRequests.${n}.tableRequest.tableValueListRequests`).value;
            for (let b = 0; b < tableValueListRequests.length; b++) {
              let tableValueRequest = this.form.get(`categoryRequests.${m}.subCategoryRequests.${n}.tableRequest.tableValueListRequests.${b}.tableValueRequests`).value;
              for (let v = 0; v < tableValueRequest.length; v++) {
                let columnName = FUNCTIONS.TRIM(tableValueRequest[v].columnName);
                if (columnName == 'weightage') {
                  let type = FUNCTIONS.TRIM(tableValueRequest[v].type);
                  if (type == 'text') {
                    let textRequest = <FormGroup>this.form.get(`categoryRequests.${m}.subCategoryRequests.${n}.tableRequest.tableValueListRequests.${b}.tableValueRequests.${v}.textRequest`);
                    // FUNCTIONS.removeValidators(textRequest);
                  } else if (type == 'dropdown') {
                    let dropDownSelectedRequest = <FormGroup>this.form.get(`categoryRequests.${m}.subCategoryRequests.${n}.tableRequest.tableValueListRequests.${b}.tableValueRequests.${v}.dropDownSelectedRequest`);
                    // FUNCTIONS.removeValidators(dropDownSelectedRequest);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  getWeightageError(z) {
    if (this.level == CONSTANTS.EMPLOYEE) {
      let kra = this.form.get(`categoryRequests.${z}.textRequest.employee`);
      return kra.hasError('required');
    } else if (this.level == CONSTANTS.REVIEWER) {
      let kra = this.form.get(`categoryRequests.${z}.textRequest.level1`);
      return kra.hasError('required');
    } else if (this.level == CONSTANTS.APPRAISERI) {
      let kra = this.form.get(`categoryRequests.${z}.textRequest.level2`);
      return kra.hasError('required');
    } else if (this.level == CONSTANTS.APPRAISERII) {
      let kra = this.form.get(`categoryRequests.${z}.textRequest.level3`);
      return kra.hasError('required');
    }
  }

  addToAccordian(control) {
    for (let index = 0; index < control.length; index++) {
      let categoryName = control[index].name;
      let weightage = control[index].weightage;
      if (weightage) {

      } else {
        weightage = 0
      }
      this.createList.push({
        weightage: weightage,
        title: categoryName,
        open: true,
        content: `Dynamic Group Body - ${this.createList.length + 1}`
      });
    }
  }

  addToReviewAccordian(control) {
    for (let index = 0; index < control.length; index++) {
      let categoryName = control[index].name;
      let weightage = control[index].weightage;
      let grp = {
        id: index,
        title: categoryName,
        rejected: false,
        weightage: weightage,
        content: `Dynamic Group Body - ${this.createReviewList.length + 1}`
      }
      if (
        FUNCTIONS.TRIM(categoryName).includes('ratings') ||
        FUNCTIONS.TRIM(categoryName).includes('comments') ||
        FUNCTIONS.TRIM(categoryName).includes('recommendation') ||
        FUNCTIONS.TRIM(categoryName).includes('summary')
      ) {
        grp.rejected = true
      }
      this.createReviewList.push(grp);
    }
  }

  async patch(categoryResponses) {
    const control = <FormArray>this.form.get(`categoryRequests`);
    // console.log(categoryResponses);
    if (categoryResponses) {
      for (let index = 0; index < categoryResponses.length; index++) {
        let MY_GRP = new FormGroup({});
        for (let obj = 0; obj < Object.entries(categoryResponses[index]).length; obj++) {
          var key = Object.entries(categoryResponses[index])[obj][0];
          var value = this.fb.control(Object.entries(categoryResponses[index])[obj][1]);
          MY_GRP.addControl(key, value);
        }
        control.push(MY_GRP);

        /* *** KRA WEIGHTAGE *** */
        let categoryRequest = <FormGroup>this.form.get(`categoryRequests.${index}`);
        let textResponse = categoryResponses[index].textResponse;
        if (textResponse) {
          if (categoryRequest) {
            categoryRequest.removeControl('textRequest');
            if (textResponse) {
              categoryRequest.addControl('textRequest', this.buildLevelsWithValues(textResponse));
            }
          }
        } else {
          categoryRequest.addControl('textRequest', new FormControl(null));
        }
        /* *** |KRA WEIGHTAGE| *** */

        let subCategoryResponses = categoryResponses[index].subCategoryResponses;
        this.patchSubCategory(index, subCategoryResponses);
      }
      const formValue = this.form.getRawValue().categoryRequests;
      this.dataService.setCategoryList(formValue);
      await this.addToAccordian(formValue);
      this.spinner.hide();
    }
  }

  patchSubCategory(idx, data) {
    const control = <FormGroup>this.form.get(`categoryRequests.${idx}`);
    control.removeControl('textResponse');
    control.removeControl('subCategoryResponses');
    var key = 'subCategoryRequests';
    var value = this.fb.array([]);
    control.addControl(key, value);
    this.insideSubCategory(idx, data);
  }

  insideSubCategory(idx, data) {
    const control = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests`);
    for (let index = 0; index < data.length; index++) {
      var MY_GRP = new FormGroup({});
      for (let sub = 0; sub < Object.entries(data[index]).length; sub++) {
        var key = Object.entries(data[index])[sub][0];
        var value = this.fb.control(
          Object.entries(data[index])[sub][1]);
        MY_GRP.addControl(key, value);
      }
      control.push(MY_GRP);
      MY_GRP.addControl('weightage', new FormControl(0));
      this.insideSubCategoryObject(idx, index, data[index])
    }
  }

  insideSubCategoryObject(idx, index, data) {
    const control = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}`);
    control.removeControl('tableResponse');
    control.removeControl('dropDownResponse');
    control.removeControl('textResponse');
    control.removeControl('textAreaResponse');
    control.removeControl('dateResponse');

    if (data.dropDownResponse != null) {
      var key = 'dropDownRequest';
      var value = this.captureDropdown(data);
      control.addControl(key, value)
      this.insideDropDown(idx, index, data);
    } else {
      control.addControl('dropDownRequest', new FormControl(null));
    }

    if (data.tableResponse != null) {
      var key = 'tableRequest';
      control.addControl(key, new FormGroup({
        "tableHeaderRequests": this.fb.array([]),
        "tableValueListRequests": this.fb.array([]),
      }));
      this.captureTable(idx, index, data);
    } else {
      var key = 'tableRequest';
      control.addControl(key, new FormControl(null));
    }

    if (control.value.type.toLowerCase() == 'text') {
      var key = 'textRequest';
      let value = this.buildLevelsWithValues(data.textResponse);
      control.addControl(key, value)
    } else {
      control.addControl('textRequest', new FormControl(null));
    }
    if (control.value.type.toLowerCase() == 'textarea') {
      var key = 'textAreaRequest';
      let value = this.buildLevelsWithValues(data.textAreaResponse);
      control.addControl(key, value);
    } else {
      control.addControl('textAreaRequest', new FormControl(null));
    }
    if (control.value.type.toLowerCase() == 'date') {
      var key = 'dateRequest';
      let value = this.buildLevelsWithValues(data.dateResponse);
      control.addControl(key, value)
    } else {
      control.addControl('dateRequest', new FormControl(null));
    }
  }

  captureDropdown(data) {
    var MY_GRP = new FormGroup({});
    for (let drop = 0; drop < Object.entries(data.dropDownResponse).length; drop++) {
      var key = Object.entries(data.dropDownResponse)[drop][0];
      var value = this.fb.control(Object.entries(data.dropDownResponse)[drop][1]);
      MY_GRP.addControl(key, value);
    }
    return MY_GRP;
  }

  insideDropDown(idx, index, data) {
    const control = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.dropDownRequest`);
    control.removeControl('dropDownDefaultResponses');
    control.removeControl('dropDownSelectedResponse');
    if (data.dropDownResponse.dropDownDefaultResponses) {
      var key = 'dropDownDefaultRequests';
      var value = this.fb.array([]);
      control.addControl(key, value);
      this.captureDropdownDefault(idx, index, data);
    } else {
      var key = 'dropDownDefaultRequests';
      var value = this.fb.array([]);
      control.addControl('dropDownDefaultRequests', new FormControl(null));
    }
    if (data.dropDownResponse.dropDownSelectedResponse) {
      var key = 'dropDownSelectedRequest'
      var val = this.buildLevelsWithValues(data.dropDownResponse.dropDownSelectedResponse);
      control.addControl(key, val);
    } else {
      control.addControl('dropDownSelectedRequest', this.buildLevels());
    }
  }

  captureDropdownDefault(idx, index, data) {
    const control = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.dropDownRequest.dropDownDefaultRequests`);
    for (let index = 0; index < data.dropDownResponse.dropDownDefaultResponses.length; index++) {
      var MY_GRP = new FormGroup({});
      for (let obj = 0; obj < Object.entries(data.dropDownResponse.dropDownDefaultResponses[index]).length; obj++) {
        var key = Object.entries(data.dropDownResponse.dropDownDefaultResponses[index])[obj][0];
        var value = this.fb.control(
          Object.entries(data.dropDownResponse.dropDownDefaultResponses[index])[obj][1]);
        MY_GRP.addControl(key, value);
      }
      control.push(MY_GRP);
    }
  }

  // TABLE______________________________________________________________________________________________
  async captureTable(idx, index, data) {
    await this.captureTableHeader(idx, index, data);
    await this.captureTableValueList(idx, index, data);
  }

  //_Table Header________________________________________________________________
  captureTableHeader(idx, index, data) {
    const control = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests`);
    if (data.tableResponse.tableHeaderResponses) {
      for (let indexT = 0; indexT < data.tableResponse.tableHeaderResponses.length; indexT++) {
        var MY_GRP = new FormGroup({});
        for (let ins = 0; ins < Object.entries(data.tableResponse.tableHeaderResponses[indexT]).length; ins++) {
          var key = Object.entries(data.tableResponse.tableHeaderResponses[indexT])[ins][0];
          var value = this.fb.control(Object.entries(data.tableResponse.tableHeaderResponses[indexT])[ins][1]);
          MY_GRP.addControl(key, value);
        }
        control.push(MY_GRP);
      }
      this.injectTableHeader(idx, index, data);
    }
  }

  injectTableHeader(idx, index, data) {
    const control = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests`);
    for (let a = 0; a < control.length; a++) {
      const controlH = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${a}`);
      controlH.removeControl('dropDownDefaultResponses');
      const defaultResponses = data.tableResponse.tableHeaderResponses[a].dropDownDefaultResponses;
      if ((data.tableResponse.tableHeaderResponses[a].type.toLowerCase()) == 'dropdown') {
        if (defaultResponses) {
          controlH.addControl('dropDownDefaultRequests', new FormArray([]));
        }
      } else {
        controlH.addControl('dropDownDefaultRequests', new FormControl(null));
      }
      if (defaultResponses) {
        for (let b = 0; b < defaultResponses.length; b++) {
          const controlHD = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${a}.dropDownDefaultRequests`);
          var MY_GRP = new FormGroup({});
          for (let c = 0; c < Object.entries(defaultResponses[b]).length; c++) {
            var key = Object.entries(defaultResponses[b])[c][0];
            var value = new FormControl(Object.entries(defaultResponses[b])[c][1]);
            MY_GRP.addControl(key, value);
          }
          controlHD.push(MY_GRP);
        }
      }
    }
  }
  //_\. Table Header________________________________________________________________

  //_Table Value List__________________________________________________________________
  captureTableValueList(idx, index, data) {
    // console.warn(data.tableResponse.tableValueListResponses);
    if (data.tableResponse.tableValueListResponses) {
      const control = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests`);
      if (control) {
        data.tableResponse.tableValueListResponses.forEach((element, index) => {
          var MY_GRP = new FormGroup({});
          MY_GRP.addControl('tid', new FormControl(index));
          MY_GRP.addControl('tableValueRequests', new FormArray([]));
          control.push(MY_GRP);
        });
        this.injectTableValueRequests(idx, index, data)
      }
    } else {
      const MY_GRP = new FormGroup({});
      MY_GRP.addControl('tid', new FormControl(1));
      MY_GRP.addControl('tableValueRequests', new FormArray([]));
      const control = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests`);
      control.push(MY_GRP);
      this.injectTableValueRequestsNull(idx, index)
    }
  }

  // If Not Null++++++++++++++++++++++++++++++++++++++++++++++
  injectTableValueRequests(idx, index, data) {
    for (let e = 0; e < data.tableResponse.tableValueListResponses.length; e++) {
      for (let f = 0; f < data.tableResponse.tableValueListResponses[e].tableValueResponses.length; f++) {
        const controlV = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${e}.tableValueRequests`);
        const controlH = this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${f}`).value;
        const MY_GRP = new FormGroup({});
        MY_GRP.addControl('t_id', new FormControl(e + 1));
        for (let g = 0; g < Object.entries(data.tableResponse.tableValueListResponses[e].tableValueResponses[f]).length; g++) {
          let key = Object.entries(data.tableResponse.tableValueListResponses[e].tableValueResponses[f])[g][0];
          let value = new FormControl(Object.entries(data.tableResponse.tableValueListResponses[e].tableValueResponses[f])[g][1]);
          MY_GRP.addControl(key, value);
        }
        if (controlH) {
          let columnName = controlH.columnName;
          MY_GRP.addControl('columnName', new FormControl(columnName))
        }
        controlV.push(MY_GRP);
        this.insideTableValueRequest(idx, index, e, f, data.tableResponse.tableValueListResponses[e].tableValueResponses[f]);
      }
    }
    // console.log(this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests`));
    // this.injectDropDownITable(idx, index);
  }

  insideTableValueRequest(idx, index, e, f, data) {
    const controlVR = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${e}.tableValueRequests.${f}`);
    controlVR.removeControl('textResponse');
    controlVR.removeControl('textAreaResponse');
    controlVR.removeControl('dateResponse');
    controlVR.removeControl('dropDownDefaultResponses');
    controlVR.removeControl('dropDownSelectedResponse');
    // if (controlVR) {
    //   controlVR.removeControl('tableValueResponses');
    //   controlVR.addControl('tableValueRequests', new FormArray([]));
    // }

    if (controlVR) {
      controlVR.removeControl('textRequest');
      controlVR.removeControl('dateRequest');
      controlVR.removeControl('dropDownDefaultRequests');
      controlVR.removeControl('dropDownSelectedRequest');
      if ((controlVR.value.type.toLowerCase()) == 'text') {
        controlVR.addControl('textRequest', this.buildLevelsWithValues(data.textResponse));
        controlVR.addControl('textAreaRequest', new FormControl(null));
        controlVR.addControl('dropDownSelectedRequest', new FormControl(null));
        controlVR.addControl('dropDownDefaultRequests', new FormControl(null));
        controlVR.addControl('dateRequest', new FormControl(null));
      } else if ((controlVR.value.type.toLowerCase()) == 'textarea') {
        controlVR.addControl('textRequest', new FormControl(null));
        controlVR.addControl('textAreaRequest', this.buildLevelsWithValues(data.textAreaResponse));
        controlVR.addControl('dropDownSelectedRequest', new FormControl(null));
        controlVR.addControl('dropDownDefaultRequests', new FormControl(null));
        controlVR.addControl('dateRequest', new FormControl(null));
      } else if ((controlVR.value.type.toLowerCase()) == 'date') {
        controlVR.addControl('textRequest', new FormControl(null));
        controlVR.addControl('textAreaRequest', new FormControl(null));
        controlVR.addControl('dropDownSelectedRequest', new FormControl(null));
        controlVR.addControl('dropDownDefaultRequests', new FormControl(null));
        controlVR.addControl('dateRequest', this.buildLevelsWithValues(data.dateResponse));
      } else if ((controlVR.value.type.toLowerCase()) == 'dropdown') {
        controlVR.addControl('textRequest', new FormControl(null));
        controlVR.addControl('textAreaRequest', new FormControl(null));
        controlVR.addControl('dropDownSelectedRequest', this.buildLevelsWithValues(data.dropDownSelectedResponse));
        controlVR.addControl('dropDownDefaultRequests', this.injectDropDownITable(idx, index, f));
        controlVR.addControl('dateRequest', new FormControl(null));
      }
    }
  }
  // \. If Not Null++++++++++++++++++++++++++++++++++++++++++++++

  // If null+++++++++++++++++++++++++++++++++++++++++++++++++
  injectTableValueRequestsNull(idx, index) {
    const controlH = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests`);
    for (let e = 0; e < controlH.length; e++) {
      const controlHI = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${e}`);
      const controlV = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${0}.tableValueRequests`);
      const MY_GRP = new FormGroup({});
      MY_GRP.addControl('t_id', new FormControl(e + 1));
      for (let f = 0; f < Object.entries(controlHI.value).length; f++) {
        var key = Object.entries(controlHI.value)[f][0];
        var value = new FormControl(Object.entries(controlHI.value)[f][1]);
        MY_GRP.addControl(key, value);
      }
      controlV.push(MY_GRP);
    }
    // console.warn(this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${0}.tableValueRequests`));
    this.insideTableValueRequestNull(idx, index)
    // this.injectDropDownITable(idx, index);
  }

  insideTableValueRequestNull(idx, index) {
    const controlV = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${0}.tableValueRequests`);
    for (let q = 0; q < controlV.length; q++) {
      const controlVR = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${0}.tableValueRequests.${q}`);
      if (controlVR) {
        controlVR.removeControl('textRequest');
        controlVR.removeControl('textAreaRequest');
        controlVR.removeControl('dropDownDefaultRequests');
        if ((controlVR.value.type.toLowerCase()) == 'text') {
          controlVR.addControl('textRequest', this.buildLevels());
          controlVR.addControl('textAreaRequest', new FormControl(null));
          controlVR.addControl('dropDownSelectedRequest', new FormControl(null));
          controlVR.addControl('dropDownDefaultRequests', new FormControl(null));
          controlVR.addControl('dateRequest', new FormControl(null));
        } else if ((controlVR.value.type.toLowerCase()) == 'textarea') {
          controlVR.addControl('textRequest', new FormControl(null));
          controlVR.addControl('textAreaRequest', this.buildLevels());
          controlVR.addControl('dropDownSelectedRequest', new FormControl(null));
          controlVR.addControl('dropDownDefaultRequests', new FormControl(null));
          controlVR.addControl('dateRequest', new FormControl(null));
        } else if ((controlVR.value.type.toLowerCase()) == 'date') {
          controlVR.addControl('textRequest', new FormControl(null));
          controlVR.addControl('textAreaRequest', new FormControl(null));
          controlVR.addControl('dropDownSelectedRequest', new FormControl(null));
          controlVR.addControl('dropDownDefaultRequests', new FormControl(null));
          controlVR.addControl('dateRequest', this.buildLevels());
        } else if ((controlVR.value.type.toLowerCase()) == 'dropdown') {
          controlVR.addControl('textRequest', new FormControl(null));
          controlVR.addControl('textAreaRequest', new FormControl(null));
          controlVR.addControl('dropDownSelectedRequest', this.buildLevels());
          controlVR.addControl('dropDownDefaultRequests', this.injectDropDownITable(idx, index, q));
          controlVR.addControl('dateRequest', new FormControl(null));
        }
      }
    }
  }


  injectDropDownITable(idx, index, q) {
    const MY_ARR = new FormArray([]);
    const controlH = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${q}`);
    if (controlH) {
      const controlD = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${q}.dropDownDefaultRequests`);
      if (controlD) {
        for (let y = 0; y < controlD.length; y++) {
          const MY_GRP = new FormGroup({});
          MY_GRP.addControl('oId', new FormControl(y + 1));
          const controlDG = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${q}.dropDownDefaultRequests.${y}`);
          if (controlDG) {
            Object.entries(controlDG.value).forEach((element, index) => {
              let key = element[0]
              let value = new FormControl(element[1])
              MY_GRP.addControl(key, value)
            })
            MY_ARR.push(MY_GRP);
          }
        }
      }
    }
    return MY_ARR;
  }
  //_\. Table Value List__________________________________________________________________


  // \.TABLE______________________________________________________________________________________________

  buildDrop() {
    return this.fb.group({
      dropDownDefaultRequests: this.fb.array([]),
      dropDownSelectedRequest: this.buildLevels()
    })
  }

  buildLevels() {
    let MY_GRP = new FormGroup({});
    MY_GRP.controls['employee'] = new FormControl(null);
    MY_GRP.controls['level1'] = new FormControl(null);
    MY_GRP.controls['level2'] = new FormControl(null);
    MY_GRP.controls['level3'] = new FormControl(null);
    return MY_GRP;
    // let MY_GRP = new FormGroup({});
    // MY_GRP.controls['employee'] = this.level == CONSTANTS.EMPLOYEE ? new FormControl(null, Validators.required) : new FormControl(null);
    // MY_GRP.controls['level1'] = this.level == CONSTANTS.REVIEWER ? new FormControl(null, Validators.required) : new FormControl(null);
    // MY_GRP.controls['level2'] = this.level == CONSTANTS.APPRAISERI ? new FormControl(null, Validators.required) : new FormControl(null);
    // MY_GRP.controls['level3'] = this.level == CONSTANTS.APPRAISERII ? new FormControl(null, Validators.required) : new FormControl(null);
    // return MY_GRP;
  }

  buildLevelsWithValues(data) {
    if (data) {
      let MY_GRP = new FormGroup({});
      let dataEntries = Object.entries(data);
      for (let index = 0; index < dataEntries.length; index++) {
        let key = dataEntries[index][0];
        let value = this.fb.control(dataEntries[index][1]);
        if (this.level == CONSTANTS.EMPLOYEE) {
          if (key == 'employee') {
            // value.setValidators(Validators.required);
          }
        } else if (this.level == CONSTANTS.REVIEWER) {
          if (key == 'level1') {
            // value.setValidators(Validators.required);
          }
        } else if (this.level == CONSTANTS.APPRAISERI) {
          if (key == 'level2') {
            // value.setValidators(Validators.required);
          }
        } else if (this.level == CONSTANTS.APPRAISERII) {
          if (key == 'level3') {
            // value.setValidators(Validators.required);
          }
        }
        MY_GRP.addControl(key, value);
      }
      return MY_GRP;
    } else {
      return this.buildLevels();
    }
  }

  addTwoRequests(control) {
    if (true) {
      //Text Requests
      var key = 'textRequest';
      var value = this.buildLevels();
      control.addControl(key, value)

      // TextArea Requests
      var key = 'textAreaRequest';
      var value2 = this.buildLevels();
      control.addControl(key, value2)
    }
  }

  // Get
  getCategoryRequests(z) {
    let control = <FormArray>this.form.get(`categoryRequests`);
    return control;
  }
  getSubcategory(form) {
    return <FormArray>form.controls.subCategoryRequests.controls;
  }
  getDropdownDefault(form) {
    return form.controls.dropDownRequest.controls.dropDownDefaultRequests.controls;
  }
  getTable(form) {
    return form.controls.tableRequest.controls.tableHeaderRequests.controls;
  }
  getTableDropdown(form) {
    return form.controls.dropDownDefaultRequests.controls;
  }

  // TrackBy
  trackByCategoryFn(index) {
    return index;
  }

  trackBySubcategoryFn(index) {
    return index;
  }

  async calculateWeightage() {
    let categoryRequests = this.form.get(`categoryRequests`).value;
    if (categoryRequests) {
      var OVERALL_WEIGHTAGE = 0;
      for (let q = 0; q < categoryRequests.length; q++) {
        var CATEGORY_WEIGHTAGE = 0;
        let weightageAgainstKRA = categoryRequests[q].weightageAgainstKRA;
        if (weightageAgainstKRA) {
          if (this.level == CONSTANTS.EMPLOYEE) {
            CATEGORY_WEIGHTAGE = CATEGORY_WEIGHTAGE + Number(categoryRequests[q].textRequest.employee);
          } else if (this.level == CONSTANTS.REVIEWER) {
            CATEGORY_WEIGHTAGE = CATEGORY_WEIGHTAGE + Number(categoryRequests[q].textRequest.level1);
          } else if (this.level == CONSTANTS.APPRAISERI) {
            CATEGORY_WEIGHTAGE = CATEGORY_WEIGHTAGE + Number(categoryRequests[q].textRequest.level2);
          } else if (this.level == CONSTANTS.APPRAISERII) {
            CATEGORY_WEIGHTAGE = CATEGORY_WEIGHTAGE + Number(categoryRequests[q].textRequest.level3);
          }
          OVERALL_WEIGHTAGE = OVERALL_WEIGHTAGE + CATEGORY_WEIGHTAGE;
        } else {
          let subCategoryRequests = categoryRequests[q].subCategoryRequests;
          if (subCategoryRequests) {
            for (let w = 0; w < subCategoryRequests.length; w++) {
              var weightage = subCategoryRequests[w].weightage;
              let type = FUNCTIONS.TRIM(subCategoryRequests[w].type);
              if (type == 'table') {
                let tableRequest = subCategoryRequests[w].tableRequest;
                if (tableRequest) {
                  let tableValueListRequests = subCategoryRequests[w].tableRequest.tableValueListRequests;
                  if (tableValueListRequests) {
                    for (let e = 0; e < tableValueListRequests.length; e++) {
                      let tableValueRequests = tableValueListRequests[e].tableValueRequests;
                      if (tableValueRequests) {
                        for (let r = 0; r < tableValueRequests.length; r++) {
                          let columnName = FUNCTIONS.TRIM(tableValueRequests[r].columnName);
                          if (columnName == 'weightage') {
                            let type = FUNCTIONS.TRIM(tableValueRequests[r].type);
                            if (type == 'text') {
                              let text = tableValueRequests[r].textRequest;
                              if (this.level == CONSTANTS.REVIEWER) {
                                weightage = weightage + Number(text.level1);
                              } else if (this.level == CONSTANTS.APPRAISERI) {
                                weightage = weightage + Number(text.level2);
                              } else if (this.level == CONSTANTS.APPRAISERII) {
                                weightage = weightage + Number(text.level3);
                              } else if (this.level == CONSTANTS.EMPLOYEE) {
                                weightage = weightage + Number(text.employee);
                              }
                            } else if (type == 'dropdown') {
                              let dropDownSelectedRequest = tableValueRequests[r].dropDownSelectedRequest;
                              if (dropDownSelectedRequest) {
                                if (this.level == CONSTANTS.REVIEWER) {
                                  weightage = weightage + Number(dropDownSelectedRequest.level1);
                                } else if (this.level == CONSTANTS.APPRAISERI) {
                                  weightage = weightage + Number(dropDownSelectedRequest.level2);
                                } else if (this.level == CONSTANTS.APPRAISERII) {
                                  weightage = weightage + Number(dropDownSelectedRequest.level3);
                                } else if (this.level == CONSTANTS.EMPLOYEE) {
                                  weightage = weightage + Number(dropDownSelectedRequest.employee);
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    subCategoryRequests[w].weightage = weightage;
                    CATEGORY_WEIGHTAGE = CATEGORY_WEIGHTAGE + subCategoryRequests[w].weightage;
                  }
                }
              }
            }
            OVERALL_WEIGHTAGE = OVERALL_WEIGHTAGE + CATEGORY_WEIGHTAGE;
          }
        }
      }
      this.setRating(OVERALL_WEIGHTAGE);
    }
  }

  setRating(overallWeightage) {
    if (this.level == CONSTANTS.REVIEWER) {
      this.level1Rating = overallWeightage;
    } else if (this.level == CONSTANTS.APPRAISERI) {
      this.level2Rating = overallWeightage;
    } else if (this.level == CONSTANTS.APPRAISERII) {
      this.level3Rating = overallWeightage;
    } else if (this.level == CONSTANTS.EMPLOYEE) {
      this.employeeRating = overallWeightage;
    }
  }

  calculateWeightageForConfirmation() {
    let categoryRequests = this.form.get(`categoryRequests`).value;
    var WEIGHTAGE = 0;
    if (categoryRequests) {
      for (let q = 0; q < categoryRequests.length; q++) {
        let name = categoryRequests[q].name;
        if (FUNCTIONS.TRIM(name) == 'overallrating') {
          let subcategoryRequests = categoryRequests[q].subCategoryRequests;
          if (subcategoryRequests) {
            for (let z = 0; z < subcategoryRequests.length; z++) {
              let type = FUNCTIONS.TRIM(subcategoryRequests[z].type);
              if (type == 'text') {
                let textRequest = subcategoryRequests[z].textRequest;
                if (textRequest) {
                  if (this.level == CONSTANTS.REVIEWER) {
                    if (textRequest.level1 == CONSTANTS.RATING_OUTSTANDING) {
                      WEIGHTAGE = 4;
                    } else if (textRequest.level1 == CONSTANTS.RATING_EXCEED) {
                      WEIGHTAGE = 3;
                    } else if (textRequest.level1 == CONSTANTS.RATING_MEET) {
                      WEIGHTAGE = 2;
                    } else if (textRequest.level1 == CONSTANTS.RATING_BELOW) {
                      WEIGHTAGE = 1;
                    }
                  } else if (this.level == CONSTANTS.APPRAISERI) {
                    if (textRequest.level2 == CONSTANTS.RATING_OUTSTANDING) {
                      WEIGHTAGE = 4;
                    } else if (textRequest.level2 == CONSTANTS.RATING_EXCEED) {
                      WEIGHTAGE = 3;
                    } else if (textRequest.level2 == CONSTANTS.RATING_MEET) {
                      WEIGHTAGE = 2;
                    } else if (textRequest.level2 == CONSTANTS.RATING_BELOW) {
                      WEIGHTAGE = 1;
                    }
                  } else if (this.level == CONSTANTS.APPRAISERII) {
                    if (textRequest.level3 == CONSTANTS.RATING_OUTSTANDING) {
                      WEIGHTAGE = 4;
                    } else if (textRequest.level3 == CONSTANTS.RATING_EXCEED) {
                      WEIGHTAGE = 3;
                    } else if (textRequest.level3 == CONSTANTS.RATING_MEET) {
                      WEIGHTAGE = 2;
                    } else if (textRequest.level3 == CONSTANTS.RATING_BELOW) {
                      WEIGHTAGE = 1;
                    }
                  } else if (this.level == CONSTANTS.EMPLOYEE) {
                    if (textRequest.employee == CONSTANTS.RATING_OUTSTANDING) {
                      WEIGHTAGE = 4;
                    } else if (textRequest.employee == CONSTANTS.RATING_EXCEED) {
                      WEIGHTAGE = 3;
                    } else if (textRequest.employee == CONSTANTS.RATING_MEET) {
                      WEIGHTAGE = 2;
                    } else if (textRequest.employee == CONSTANTS.RATING_BELOW) {
                      WEIGHTAGE = 1;
                    }
                  }
                }
              } else if (type == 'textarea') {
                let textAreaRequest = subcategoryRequests[z].textAreaRequest;
                if (textAreaRequest) {
                  if (this.level == CONSTANTS.REVIEWER) {
                    if (textAreaRequest.level1 == CONSTANTS.RATING_OUTSTANDING) {
                      WEIGHTAGE = 4;
                    } else if (textAreaRequest.level1 == CONSTANTS.RATING_EXCEED) {
                      WEIGHTAGE = 3;
                    } else if (textAreaRequest.level1 == CONSTANTS.RATING_MEET) {
                      WEIGHTAGE = 2;
                    } else if (textAreaRequest.level1 == CONSTANTS.RATING_BELOW) {
                      WEIGHTAGE = 1;
                    }
                  } else if (this.level == CONSTANTS.APPRAISERI) {
                    if (textAreaRequest.level2 == CONSTANTS.RATING_OUTSTANDING) {
                      WEIGHTAGE = 4;
                    } else if (textAreaRequest.level2 == CONSTANTS.RATING_EXCEED) {
                      WEIGHTAGE = 3;
                    } else if (textAreaRequest.level2 == CONSTANTS.RATING_MEET) {
                      WEIGHTAGE = 2;
                    } else if (textAreaRequest.level2 == CONSTANTS.RATING_BELOW) {
                      WEIGHTAGE = 1;
                    }
                  } else if (this.level == CONSTANTS.APPRAISERII) {
                    if (textAreaRequest.level3 == CONSTANTS.RATING_OUTSTANDING) {
                      WEIGHTAGE = 4;
                    } else if (textAreaRequest.level3 == CONSTANTS.RATING_EXCEED) {
                      WEIGHTAGE = 3;
                    } else if (textAreaRequest.level3 == CONSTANTS.RATING_MEET) {
                      WEIGHTAGE = 2;
                    } else if (textAreaRequest.level3 == CONSTANTS.RATING_BELOW) {
                      WEIGHTAGE = 1;
                    }
                  } else if (this.level == CONSTANTS.EMPLOYEE) {
                    if (textAreaRequest.employee == CONSTANTS.RATING_OUTSTANDING) {
                      WEIGHTAGE = 4;
                    } else if (textAreaRequest.employee == CONSTANTS.RATING_EXCEED) {
                      WEIGHTAGE = 3;
                    } else if (textAreaRequest.employee == CONSTANTS.RATING_MEET) {
                      WEIGHTAGE = 2;
                    } else if (textAreaRequest.employee == CONSTANTS.RATING_BELOW) {
                      WEIGHTAGE = 1;
                    }
                  }
                }
              } else if (type == 'dropdown') {
                let dropDownRequest = subcategoryRequests[z].dropDownRequest;
                if (dropDownRequest) {
                  let dropDownSelectedRequest = dropDownRequest.dropDownSelectedRequest;
                  if (dropDownSelectedRequest) {
                    if (this.level == CONSTANTS.REVIEWER) {
                      if (dropDownSelectedRequest.level1 == CONSTANTS.RATING_OUTSTANDING) {
                        WEIGHTAGE = 4;
                      } else if (dropDownSelectedRequest.level1 == CONSTANTS.RATING_EXCEED) {
                        WEIGHTAGE = 3;
                      } else if (dropDownSelectedRequest.level1 == CONSTANTS.RATING_MEET) {
                        WEIGHTAGE = 2;
                      } else if (dropDownSelectedRequest.level1 == CONSTANTS.RATING_BELOW) {
                        WEIGHTAGE = 1;
                      }
                    } else if (this.level == CONSTANTS.APPRAISERI) {
                      if (dropDownSelectedRequest.level2 == CONSTANTS.RATING_OUTSTANDING) {
                        WEIGHTAGE = 4;
                      } else if (dropDownSelectedRequest.level2 == CONSTANTS.RATING_EXCEED) {
                        WEIGHTAGE = 3;
                      } else if (dropDownSelectedRequest.level2 == CONSTANTS.RATING_MEET) {
                        WEIGHTAGE = 2;
                      } else if (dropDownSelectedRequest.level2 == CONSTANTS.RATING_BELOW) {
                        WEIGHTAGE = 1;
                      }
                    } else if (this.level == CONSTANTS.APPRAISERII) {
                      if (dropDownSelectedRequest.level3 == CONSTANTS.RATING_OUTSTANDING) {
                        WEIGHTAGE = 4;
                      } else if (dropDownSelectedRequest.level3 == CONSTANTS.RATING_EXCEED) {
                        WEIGHTAGE = 3;
                      } else if (dropDownSelectedRequest.level3 == CONSTANTS.RATING_MEET) {
                        WEIGHTAGE = 2;
                      } else if (dropDownSelectedRequest.level3 == CONSTANTS.RATING_BELOW) {
                        WEIGHTAGE = 1;
                      }
                    } else if (this.level == CONSTANTS.EMPLOYEE) {
                      if (dropDownSelectedRequest.employee == CONSTANTS.RATING_OUTSTANDING) {
                        WEIGHTAGE = 4;
                      } else if (dropDownSelectedRequest.employee == CONSTANTS.RATING_EXCEED) {
                        WEIGHTAGE = 3;
                      } else if (dropDownSelectedRequest.employee == CONSTANTS.RATING_MEET) {
                        WEIGHTAGE = 2;
                      } else if (dropDownSelectedRequest.employee == CONSTANTS.RATING_BELOW) {
                        WEIGHTAGE = 1;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      this.setRating(WEIGHTAGE);
    }
  }

  // checkIfWeightageExceedForConfirmation() {

  // }

  fetchComments() {
    let categoryRequests = this.form.get(`categoryRequests`).value;
    if (categoryRequests) {
      for (let q = 0; q < categoryRequests.length; q++) {
        let name = categoryRequests[q].name.toLowerCase().replace(/\s*/g, '');
        if (name.includes('overallcomments')) {
          let subCategoryRequests = categoryRequests[q].subCategoryRequests;
          for (let t = 0; t < subCategoryRequests.length; t++) {
            if (subCategoryRequests.length == 1) {
              let type = subCategoryRequests[t].type.toLowerCase().replace(/\s*/g, '');
              if (type == 'textarea') {
                let textarea = subCategoryRequests[t].textAreaRequest;
                if (textarea) {
                  if (this.level == CONSTANTS.REVIEWER) {
                    this.level1Comments = textarea.level1;
                    return;
                  } else if (this.level == CONSTANTS.APPRAISERI) {
                    this.level2Comments = textarea.level2;
                    return;
                  } else if (this.level == CONSTANTS.APPRAISERII) {
                    this.level3Comments = textarea.level3;
                    return;
                  } else if (this.level == CONSTANTS.EMPLOYEE) {
                    this.employeeComments = textarea.employee;
                    return;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  checkIfWeightageDoesntAddUp() {
    let categoryRequests = this.form.get(`categoryRequests`).value;
    if (categoryRequests) {
      for (let q = 0; q < categoryRequests.length; q++) {
        let weightageAgainstKRA = categoryRequests[q].weightageAgainstKRA;
        if (weightageAgainstKRA) {
          let weight = 0;
          let textRequest = categoryRequests[q].textRequest
          if (textRequest) {
            if (this.level == CONSTANTS.EMPLOYEE) {
              weight = categoryRequests[q].textRequest.employee;
            } else if (this.level == CONSTANTS.REVIEWER) {
              weight = categoryRequests[q].textRequest.level1;
            } else if (this.level == CONSTANTS.APPRAISERI) {
              weight = categoryRequests[q].textRequest.level2;
            } else if (this.level == CONSTANTS.APPRAISERII) {
              weight = categoryRequests[q].textRequest.level3;
            }
          };
          let ovrlweght = categoryRequests[q].weightage;
          if ((weight > 0) && weight > ovrlweght) {
            return true;
          }
          else {
            return false;
          }
        } else {
          var overallWeightage = categoryRequests[q].weightage;
          let subCategoryRequests = categoryRequests[q].subCategoryRequests;
          if (subCategoryRequests) {
            var weightage = 0;
            for (let w = 0; w < subCategoryRequests.length; w++) {
              weightage = weightage + subCategoryRequests[w].weightage;
              if (weightage > overallWeightage) {
                return true;
              }
              else {
                return false;
              }
            }
          }
        }
      }
    }
  }

  checkIfWeightageExceed() {
    this.WEIGHTAGE_EXCEED = [];
    let categoryRequests = this.form.get(`categoryRequests`).value;
    if (categoryRequests) {
      for (let q = 0; q < categoryRequests.length; q++) {
        let weightageAgainstKRA = categoryRequests[q].weightageAgainstKRA;
        if (weightageAgainstKRA) {
          let weight = 0;
          let textRequest = categoryRequests[q].textRequest
          if (textRequest) {
            if (this.level == CONSTANTS.EMPLOYEE) {
              weight = categoryRequests[q].textRequest.employee;
            } else if (this.level == CONSTANTS.REVIEWER) {
              weight = categoryRequests[q].textRequest.level1;
            } else if (this.level == CONSTANTS.APPRAISERI) {
              weight = categoryRequests[q].textRequest.level2;
            } else if (this.level == CONSTANTS.APPRAISERII) {
              weight = categoryRequests[q].textRequest.level3;
            }
          };
          let ovrlweght = categoryRequests[q].weightage;
          if ((weight > 0) && weight > ovrlweght) {
            this.WEIGHTAGE_EXCEED.push(q);
          }
          else {
          }
        } else {
          var overallWeightage = categoryRequests[q].weightage;
          let subCategoryRequests = categoryRequests[q].subCategoryRequests;
          if (subCategoryRequests) {
            var weightage = 0;
            for (let w = 0; w < subCategoryRequests.length; w++) {
              weightage = weightage + subCategoryRequests[w].weightage;
            }
            if (weightage > overallWeightage) {
              this.WEIGHTAGE_EXCEED.push(q);
            } else {

            }
          }
        }
      }
    }
  }

  accordianChanged(event, idx) {
    this.log(event);
    if (event) {
      this.createList[idx].open = true;
    } else {
      this.createList[idx].open = false;
    }
  }

  log(event: boolean) {
    if (this.popRef) {
      this.popRef.hide();
    }
  }

  async onSubmit(form: FormGroup, template, weight: TemplateRef<any>, save, current: TemplateRef<any>, invalid) {
    this.form.enable();
    let categoryRequests = <FormArray>form.get('categoryRequests');
    if (categoryRequests) {
      categoryRequests.controls.forEach((element, index) => {
        if (element.invalid) {
          this.createList[index].open = true;
        } else {
          this.createList[index].open = false;
        }
      });
    }
    this.form.enable();
    this.saveType = save;
    if (this.form.invalid) {
      this.closeOthers = false;
      this.openAll = true;
      this.disableButton = false;
      this.submitted = true;
      this.dataService.setSubmitted(true);
      invalid.show();
      setTimeout(() => {
        invalid.hide();
      }, 3000);
      return;
    }

    if (this.reviewId == 1) {
      await this.calculateWeightageForConfirmation();
    } else if (this.reviewId == 3) {
      await this.calculateWeightage();
      await this.checkIfWeightageExceed();
      if (form) {
        if (this.WEIGHTAGE_EXCEED.length > 0) {
          for (let w = 0; w < this.WEIGHTAGE_EXCEED.length; w++) {
            let idx = this.WEIGHTAGE_EXCEED[w];
            this.createList[idx].open = true;
          }
          for (let b = 0; b < this.createList.length; b++) {
            if (this.WEIGHTAGE_EXCEED.includes(b)) {

            } else {
              this.createList[b].open = false;
            }
          }
        }
        if (this.level == CONSTANTS.EMPLOYEE) {
          if (this.employeeRating > 100 || this.WEIGHTAGE_EXCEED.length > 0 || this.employeeRating == undefined || (this.checkIfWeightageDoesntAddUp() == true && this.checkIfWeightageDoesntAddUp() != undefined)) {
            this.weightageRef = this.modalService.show(weight, { class: 'modal-md', ignoreBackdropClick: false, backdrop: true });
            this.closeOthers = false;
            this.openAll = true;
            this.disableButton = false;
            this.submitted = true;
            this.dataService.setSubmitted(true);
            invalid.show();
            setTimeout(() => {
              invalid.hide();
            }, 3000);
            return;
          }
        } else if (this.level == CONSTANTS.REVIEWER) {
          if (this.level1Rating > 100 || this.WEIGHTAGE_EXCEED.length > 0 || this.level1Rating == undefined || (this.checkIfWeightageDoesntAddUp() == true && this.checkIfWeightageDoesntAddUp() != undefined)) {
            this.weightageRef = this.modalService.show(weight, { class: 'modal-md', ignoreBackdropClick: false, backdrop: true });
            this.closeOthers = false;
            this.openAll = true;
            this.disableButton = false;
            this.submitted = true;
            this.dataService.setSubmitted(true);
            invalid.show();
            setTimeout(() => {
              invalid.hide();
            }, 3000);
            return;
          }
        } else if (this.level == CONSTANTS.APPRAISERI) {
          if (this.level2Rating > 100 || this.WEIGHTAGE_EXCEED.length > 0 || this.level2Rating == undefined || (this.checkIfWeightageDoesntAddUp() == true && this.checkIfWeightageDoesntAddUp() != undefined)) {
            this.weightageRef = this.modalService.show(weight, { class: 'modal-md', ignoreBackdropClick: false, backdrop: true });
            this.closeOthers = false;
            this.openAll = true;
            this.disableButton = false;
            this.submitted = true;
            this.dataService.setSubmitted(true);
            invalid.show();
            setTimeout(() => {
              invalid.hide();
            }, 3000);
            return;
          }
        } else if (this.level == CONSTANTS.APPRAISERII) {
          if (this.level3Rating > 100 || this.WEIGHTAGE_EXCEED.length > 0 || this.level3Rating == undefined || (this.checkIfWeightageDoesntAddUp() == true && this.checkIfWeightageDoesntAddUp() != undefined)) {
            this.weightageRef = this.modalService.show(weight, { class: 'modal-md', ignoreBackdropClick: false, backdrop: true });
            this.closeOthers = false;
            this.openAll = true;
            this.disableButton = false;
            this.submitted = true;
            this.dataService.setSubmitted(true);
            invalid.show();
            setTimeout(() => {
              invalid.hide();
            }, 3000);
            return;
          }
        }
      }
    }

    await this.fetchComments();

    if (this.reviewId == 1) {
      if (this.level == CONSTANTS.EMPLOYEE) {
        this.rateValue = this.employeeRating;
        if (this.employeeRating == 4) {
          this.rate = CONSTANTS.RATING_OUTSTANDING
        } else if (this.employeeRating == 3) {
          this.rate = CONSTANTS.RATING_EXCEED
        } else if (this.employeeRating == 2) {
          this.rate = CONSTANTS.RATING_MEET
        } else if (this.employeeRating == 1) {
          this.rate = CONSTANTS.RATING_BELOW;
        }
      } else if (this.level == CONSTANTS.REVIEWER) {
        this.rateValue = this.level1Rating;
        if (this.level1Rating == 4) {
          this.rate = CONSTANTS.RATING_OUTSTANDING
        } else if (this.level1Rating == 3) {
          this.rate = CONSTANTS.RATING_EXCEED
        } else if (this.level1Rating == 2) {
          this.rate = CONSTANTS.RATING_MEET
        } else if (this.level1Rating == 1) {
          this.rate = CONSTANTS.RATING_BELOW;
        }
      } else if (this.level == CONSTANTS.APPRAISERI) {
        this.rateValue = this.level2Rating;
        if (this.level2Rating == 4) {
          this.rate = CONSTANTS.RATING_OUTSTANDING
        } else if (this.level2Rating == 3) {
          this.rate = CONSTANTS.RATING_EXCEED
        } else if (this.level2Rating == 2) {
          this.rate = CONSTANTS.RATING_MEET
        } else if (this.level2Rating == 1) {
          this.rate = CONSTANTS.RATING_BELOW;
        }
      } else if (this.level == CONSTANTS.APPRAISERII) {
        this.rateValue = this.level3Rating;
        if (this.level3Rating == 4) {
          this.rate = CONSTANTS.RATING_OUTSTANDING
        } else if (this.level3Rating == 3) {
          this.rate = CONSTANTS.RATING_EXCEED
        } else if (this.level3Rating == 2) {
          this.rate = CONSTANTS.RATING_MEET
        } else if (this.level3Rating == 1) {
          this.rate = CONSTANTS.RATING_BELOW;
        }
      }
      this.currentRef = this.modalService.show(current, { class: 'modal-md', ignoreBackdropClick: false, backdrop: true });
    } else if (this.reviewId == 3) {
      if (this.level == CONSTANTS.EMPLOYEE) {
        this.rateValue = this.employeeRating;
        if (this.employeeRating >= 90) {
          this.rate = 'Outstanding';
        } else if ((this.employeeRating >= 80) && (this.employeeRating <= 89)) {
          this.rate = 'Exceed Expectations';
        } else if ((this.employeeRating >= 60) && (this.employeeRating <= 79)) {
          this.rate = 'Meets Expectations';
        } else if (this.employeeRating < 60) {
          this.rate = 'Below Expectations';
        }
      } else if (this.level == CONSTANTS.REVIEWER) {
        this.rateValue = this.level1Rating;
        if (this.level1Rating >= 90) {
          this.rate = 'Outstanding';
        } else if ((this.level1Rating >= 80) && (this.level1Rating <= 89)) {
          this.rate = 'Exceed Expectations';
        } else if ((this.level1Rating >= 60) && (this.level1Rating <= 79)) {
          this.rate = 'Meets Expectations';
        } else if (this.level1Rating < 60) {
          this.rate = 'Below Expectations';
        }
      } else if (this.level == CONSTANTS.APPRAISERI) {
        this.rateValue = this.level2Rating;
        if (this.level2Rating >= 90) {
          this.rate = 'Outstanding';
        } else if ((this.level2Rating >= 80) && (this.level2Rating <= 89)) {
          this.rate = 'Exceed Expectations';
        } else if ((this.level2Rating >= 60) && (this.level2Rating <= 79)) {
          this.rate = 'Meets Expectations';
        } else if (this.level2Rating < 60) {
          this.rate = 'Below Expectations';
        }
      } else if (this.level == CONSTANTS.APPRAISERII) {
        this.rateValue = this.level3Rating;
        if (this.level3Rating >= 90) {
          this.rate = 'Outstanding';
        } else if ((this.level3Rating >= 80) && (this.level3Rating <= 89)) {
          this.rate = 'Exceed Expectations';
        } else if ((this.level3Rating >= 60) && (this.level3Rating <= 79)) {
          this.rate = 'Meets Expectations';
        } else if (this.level3Rating < 60) {
          this.rate = 'Below Expectations';
        }
      }
      this.currentRef = this.modalService.show(current, { class: 'modal-md', ignoreBackdropClick: false, backdrop: true });
    } else {
      this.submitReview();
    }
  }

  confirmReview() {
    this.declineReview();
    this.submitReview();
  }

  declineReview() {
    this.currentRef.hide();
  }

  async submitReview() {
    this.spinner.show();
    this.disableButton = true;
    await this.setNull(this.form);
    this.submitted = false;
    this.dataService.setSubmitted(false);
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

    let submitted = this.submittedObj;
    if (this.saveType == 'save') {

    } else {
      if (this.level == CONSTANTS.EMPLOYEE) {
        submitted.employee = CONSTANTS.REVIEW_STATUS_CLOSED;
      } else if (this.level == CONSTANTS.APPRAISERII) {
        submitted.level3 = CONSTANTS.REVIEW_STATUS_CLOSED;
      } else if (this.level == CONSTANTS.APPRAISERI) {
        submitted.level2 = CONSTANTS.REVIEW_STATUS_CLOSED;
      } else if (this.level == CONSTANTS.REVIEWER) {
        submitted.level1 = CONSTANTS.REVIEW_STATUS_CLOSED;
      }
    }

    var reviewData = {
      'reviewType': type,
      'templateRequests': [
        {
          "submitted": submitted,
          "employeeRating": this.employeeRating,
          "employeeComments": this.employeeComments,
          "level1Rating": this.level1Rating,
          "level1Comments": this.level1Comments,
          "level2Rating": this.level2Rating,
          "level2Comments": this.level2Comments,
          "level3Rating": this.level3Rating,
          "level3Comments": this.level3Comments,
          "categoryRequests": this.form.getRawValue().categoryRequests
        }
      ]
    };

    if (this.saveType == 'save') {
      var draft = true;
    } else {
      var draft = false;
    }

    var payload = {
      "saveAsDraft": draft,
      'performanceReviewRequests': [{
        "id": this.id,
        "userId": this.userId,
        "reviewId": parseInt(this.reviewId),
        "reviewType": type,
        "reviewStartDate": this.reviewStartDate,
        "reviewEndDate": this.reviewEndDate,
        "reviewData": encodeURIComponent(JSON.stringify({ 'data': reviewData })),
        "status": this.prevStatus,
        "rating": null
      }]
    }
    // console.warn(encodeURIComponent(JSON.stringify({ 'data': reviewData })));
    // return;

    this.template.editTemplate(payload).subscribe(data => {
      this.spinner.hide();
      if (this.saveType == 'submit') {
        this.statusMessage = CONSTANTS.REVIEW_COMPLETION_SUCCESS;
      } else {
        this.statusMessage = CONSTANTS.REVIEW_SAVE_SUCCESS;
      }
      this.status = CONSTANTS.SUCCESS;
      setTimeout(() => {
        localStorage.removeItem('content');
        if (this.currentRoute.includes('/review/employee')) {
          this.route.navigate(['review', 'employee']);
        } else {
          this.route.navigate(['review', 'self']);
        }
      }, 1500);
    }, error => {
      this.spinner.hide();
      this.disableButton = true;
      this.statusMessage = CONSTANTS.FAILURE;
      this.status = CONSTANTS.FAILURE;
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    });
  }

  setNull(form) {
    let zip = form.get(`categoryRequests`).controls;
    for (let z = 0; z < zip.length; z++) {
      let categoryRequests = form.get(`categoryRequests.${z}`).controls;
      for (let index = 0; index < categoryRequests.subCategoryRequests.length; index++) {
        //++++++++++++++++++++++++++++++++++++++++++Subcategory
        form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('weightage');
        let type = form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].get('type').value.toLowerCase().replace(/\s*/g, '');
        if (type == "text") {
          //Reset Date
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('dateRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('dateRequest', control);
          //Reset TextArea
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('textAreaRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('textAreaRequest', control);
          //Reset Dropdown
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('dropDownRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('dropDownRequest', control);
          //Reset Table
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('tableRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('tableRequest', control);
        } else if (type == "textarea") {
          //Reset Date
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('dateRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('dateRequest', control);
          //Reset Text
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('textRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('textRequest', control);
          //Reset Dropdown
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('dropDownRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('dropDownRequest', control);
          //Reset Table
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('tableRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('tableRequest', control);
        } else if (type == "date") {
          //Reset Text
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('textRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('textRequest', control);
          //Reset TextArea
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('textAreaRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('textAreaRequest', control);
          //Reset Dropdown
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('dropDownRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('dropDownRequest', control);
          //Reset Table
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('tableRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('tableRequest', control);
        } else if (type == "dropdown") {
          //Reset Date
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('dateRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('dateRequest', control);
          //Reset Text
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('textRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('textRequest', control);
          //Reset TextArea
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('textAreaRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('textAreaRequest', control);
          //Reset Table
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('tableRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('tableRequest', control);


          // Remove DropdownResponse
          form.get(`categoryRequests.${z}.subCategoryRequests.${index}.dropDownRequest`).removeControl('dropDownSelectedResponse');
        } else if (type == "table") {
          //Reset Date
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('dateRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('dateRequest', control);
          //Reset Text
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('textRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('textRequest', control);
          //Reset TextArea
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('textAreaRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('textAreaRequest', control);
          //Reset Dropdown
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('dropDownRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('dropDownRequest', control);

          // INSIDE_TABLE________________________________________________________________________________
          let table = form.getRawValue().categoryRequests[z].subCategoryRequests[index].tableRequest.tableHeaderRequests;
          for (let idx = 0; idx < table.length; idx++) {
            form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).removeControl('dropDownDefaultResponses');
            let type = form.getRawValue().categoryRequests[z].subCategoryRequests[index].tableRequest.tableHeaderRequests[idx].type.toLowerCase().replace(/\s*/g, '');
            if (type == 'dropdown') {
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).removeControl('textAreaRequest');
              //Reset Date
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).removeControl('dateRequest');
              // var control = this.fb.control(null);
              // form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).addControl('dateRequest', control);
              //Reset Text
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).removeControl('textRequest');
              // var control = this.fb.control(null);
              // form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).addControl('textRequest', control);

              // Remove oID
              let oID = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}.dropDownDefaultRequests`).value;
              for (let o = 0; o < oID.length; o++) {
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}.dropDownDefaultRequests.${o}`).removeControl('oId');
              }
            } else if (type == 'text') {
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).removeControl('textAreaRequest');
              //Reset Date
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).removeControl('dateRequest');
              // var control = this.fb.control(null);
              // form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).addControl('dateRequest', control);

              //Reset Dropdown
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).removeControl('dropDownDefaultRequests');
              var control = this.fb.control(null);
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).addControl('dropDownDefaultRequests', control);
            } else if (type == 'date') {
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).removeControl('textAreaRequest');
              //Reset Dropdown
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).removeControl('dropDownDefaultRequests');
              var control = this.fb.control(null);
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).addControl('dropDownDefaultRequests', control);
            } else if (type == 'textarea') {
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).removeControl('textRequest');
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).removeControl('dateRequest');
              //Reset Dropdown
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).removeControl('dropDownDefaultRequests');
              var control = this.fb.control(null);
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).addControl('dropDownDefaultRequests', control);
            }
          }

          // INSIDE_TABLE_VALUE_REQUESTS_______________________________________
          let tableV = form.getRawValue().categoryRequests[z].subCategoryRequests[index].tableRequest.tableValueListRequests;
          for (let idx = 0; idx < tableV.length; idx++) {
            // Remove oID
            form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}`).removeControl('tid');
            for (let f = 0; f < tableV[idx].tableValueRequests.length; f++) {
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('t_id');
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('columnName');
              let type = form.getRawValue().categoryRequests[z].subCategoryRequests[index].tableRequest.tableValueListRequests[idx].tableValueRequests[f].type.toLowerCase().replace(/\s*/g, '');
              if (type == 'dropdown') {
                // Reset Text
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('textRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('textRequest', control);
                // Reset Textarea
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('textAreaRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('textAreaRequest', control);
                // Reset Date
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dateRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('dateRequest', control);
                //Reset DropdownDefault
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dropDownDefaultRequests');
              } else if (type == 'text') {
                // Reset Textarea
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('textAreaRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('textAreaRequest', control);
                // Reset Date
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dateRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('dateRequest', control);
                //Reset DropdownDefault
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dropDownDefaultRequests');
                //Reset DropdownSelected
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dropDownSelectedRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('dropDownSelectedRequest', control);
              } else if (type == 'textarea') {
                // Reset Text
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('textRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('textRequest', control);
                // Reset Date
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dateRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('dateRequest', control);
                //Reset DropdownDefault
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dropDownDefaultRequests');
                //Reset DropdownSelected
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dropDownSelectedRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('dropDownSelectedRequest', control);
              } else if (type == 'date') {
                // Reset Text
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('textRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('textRequest', control);
                // Reset Textarea
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('textAreaRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('textAreaRequest', control);
                //Reset DropdownDefault
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dropDownDefaultRequests');
                //Reset DropdownSelected
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dropDownSelectedRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('dropDownSelectedRequest', control);
              }
            }
          }
          // \.INSIDE_TABLE_VALUE_REQUESTS______________________________________
        }
        // \.INSIDE_TABLE________________________________________________________________________________

        //++++++++++++++++++++++++++++++++++++++++++\. Subcategory

        //Set Null++++++++++++++++++++++
      }
    }
    // console.warn(JSON.stringify(form.value));

    // var abc = { ...JSON.parse(JSON.stringify(form.value)) };
    // console.log(abc);
  }



  // MODAL____________________________________________________________
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  // openModalList(template: TemplateRef<any>) {
  //   this.modalRefList = this.modalService.show(template, { class: 'modal-lg' });
  // }
  // openModalView(template: TemplateRef<any>) {
  //   this.modalRefView = this.modalService.show(template, { class: 'second modal-lg' });
  // }
  closeFirstModal() {
    if (!this.modalRef) {
      return;
    }
    this.modalRef.hide();
    this.modalRef = null;
  }


  openReviews(template: TemplateRef<any>) {
    this.spinner.show();
    this.otherForm = undefined;
    this.otherForm = this.form.getRawValue();
    // console.log(this.reviewData);
    // console.log(this.otherForm);
    if (this.otherForm) {
      // console.log(this.roleType);
      this.createReviewList = [];
      this.addToReviewAccordian(this.otherForm.categoryRequests);
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
      this.calculateReviewValue();
    } else {
      this._isTemplateAvailable = false;
    }
    this.spinner.hide();
    this.modalReviewRef = this.modalService.show(template, { class: 'modal-lg', ignoreBackdropClick: false });
  }

  calculateRate() {
    this.calculateReviewValue();
  }

  calculateReviewValue() {
    if (this.selectedRole == CONSTANTS.EMPLOYEE) {
      this.reviewRateValue = this.employeeRating;
      this.setReviewRate(this.employeeRating);
    } else if (this.selectedRole == CONSTANTS.REVIEWER) {
      this.reviewRateValue = this.level1Rating;
      this.setReviewRate(this.level1Rating);
    } else if (this.selectedRole == CONSTANTS.APPRAISERI) {
      this.reviewRateValue = this.level2Rating;
      this.setReviewRate(this.level2Rating);
    } else if (this.selectedRole == CONSTANTS.APPRAISERII) {
      this.reviewRateValue = this.level3Rating;
      this.setReviewRate(this.level3Rating);
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
  // \.MODAL___________________________________________________________

  // subscribeToComments() {
  //   if (this.level == 'Self') {
  //     this.employeeComments = this.comments;
  //   } else if (this.level == 'Level 1') {
  //     this.level1Comments = this.comments;
  //   } else if (this.level == 'Level 2') {
  //     this.level2Comments = this.comments;
  //   } else if (this.level == 'Level 3') {
  //     this.level3Comments = this.comments;
  //   }
  // }

  // Get_______________________________________________
  getTableValueRequests(weightageAgainstKRA, rows) {
    if (weightageAgainstKRA) {
      let data = [];
      for (let v = 0; v < rows.tableValueRequests.length; v++) {
        let colName = rows.tableValueRequests[v].columnName;
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

  compare() {
    if (this.content) {
      let userId = this.content.userId;
      let reviewData = this.content.reviewData;
      let reviewContent = {
        userId: userId,
        name: {
          level1ReviewerName: this.level1ReviewerName,
          level2ReviewerName: this.level2ReviewerName,
          level3ReviewerName: this.level3ReviewerName,
          revieweeName: this.revieweeName
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

  ngOnDestroy() {
    if (this.weightageRef) {
      this.weightageRef.hide();
    }
    if (this.modalReviewRef) {
      this.modalReviewRef.hide();
    }
    if (this.currentRef) {
      this.currentRef.hide();
    }
  }
}