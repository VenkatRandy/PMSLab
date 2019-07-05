import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { payload, IPayload } from './payload';
import { AbstractControl, FormControl, FormArray } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { FormService } from '../service/form.service';
import { convertToRequests } from '../_utils/convert';

@Component({
  selector: 'app-redesign',
  templateUrl: './redesign.component.html',
  styles: [`

  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedesignComponent implements OnInit, AfterViewInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  IPayload;
  reviewData;
  templateResponses;
  categoryRequests;
  form: FormGroup;
  selectedIndex = 0;
  activedStep = 0;
  @ViewChild('stepper', { static: true }) stepper: MatStepper;

  constructor(
    public _formBuilder: FormBuilder,
    // public _formSerive: FormService,
    private _changeDetectionRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // this.selectedIndex = this.stepper.selectedIndex;
    this.IPayload = IPayload[0];
    this.reviewData = JSON.parse(this.IPayload.reviewData).data;
    // convertToRequests(this.reviewData);
    // return;
    this.templateResponses = this.reviewData.templateResponses[0];
    let requests = convertTo(this.templateResponses);
    this.categoryRequests = requests.categoryRequests;
    this.form = this._formBuilder.group({
      categoryRequests: createFormArray(this.categoryRequests)
    });
    console.log(this.Requests);

  }

  trackByFnCategory(index, data) {
    return index;
  }

  trackByFnSubcategory(index, data) {
    return index;
  }

  get Requests() {
    return this.form.get(`categoryRequests`).value
  }

  ngAfterViewInit() {
    // console.log(this.stepper);
    // this._changeDetectionRef.detectChanges();
    // console.log(this.stepper);
    // this.selectedIndex = this.stepper.selectedIndex;
  }

  plus() {
    this.selectedIndex = this.stepper.selectedIndex;
  }

  prevStep(step) {
    this.activedStep = step - 1;
  }

  nextStep(step) {
    this.activedStep = step + 1;
  }
}

function createFormGroup(obj: any) {
  let builder = new FormBuilder();
  let formGroup = {};
  Object.keys(obj).forEach(key => {
    if (Array.isArray(obj[key])) {
      formGroup[key] = createFormArray(obj[key]);
    } else if (obj[key] instanceof Object) {
      formGroup[key] = createFormGroup(obj[key]);
    } else {
      formGroup[key] = new FormControl(obj[key]);
    }
  });
  return builder.group(formGroup);
}

function createFormArray(obj: any) {
  let builder = new FormBuilder();
  let formArray = [];
  Object.keys(obj).forEach(key => {
    formArray.push(createFormGroup(obj[key]));
  });
  return builder.array(formArray);
}

function convertTo(object) {
  let requests = object;
  let vault = {
    submitted: requests.submitted,
    employeeComments: requests.employeeComments,
    employeeRating: requests.employeeRating,
    level1Comments: requests.level1Comments,
    level1Rating: requests.level1Rating,
    level2Comments: requests.level2Comments,
    level2Rating: requests.level2Rating,
    level3Comments: requests.level3Comments,
    level3Rating: requests.level3Rating,
    postReviewRevieweeComments: requests.postReviewRevieweeComments,
    categoryRequests: object.categoryResponses
  }
  responsesTorequests(vault);
  throwResponses(vault);
  return vault;
}

function responsesTorequests(vault) {
  for (let q = 0; q < vault.categoryRequests.length; q++) {
    vault.categoryRequests[q]['textRequest'] = vault.categoryRequests[q].textResponse ? vault.categoryRequests[q].textResponse : null;
    vault.categoryRequests[q]['subCategoryRequests'] = vault.categoryRequests[q].subCategoryResponses ? vault.categoryRequests[q].subCategoryResponses : null;
    if (vault.categoryRequests[q].subCategoryRequests) {
      for (let w = 0; w < vault.categoryRequests[q].subCategoryRequests.length; w++) {
        if ((vault.categoryRequests[q].subCategoryRequests[w].type.toLowerCase().replace(/\s*/g, '')) == 'text') {
          vault.categoryRequests[q].subCategoryRequests[w]['textRequest'] = vault.categoryRequests[q].subCategoryRequests[w].textResponse ? vault.categoryRequests[q].subCategoryRequests[w].textResponse : null;
          vault.categoryRequests[q].subCategoryRequests[w]['textAreaRequest'] = null;
          vault.categoryRequests[q].subCategoryRequests[w]['dateRequest'] = null;
          vault.categoryRequests[q].subCategoryRequests[w]['dropDownRequest'] = null;
          vault.categoryRequests[q].subCategoryRequests[w]['tableRequest'] = null;
        }
        else if ((vault.categoryRequests[q].subCategoryRequests[w].type.toLowerCase().replace(/\s*/g, '')) == 'textarea') {
          vault.categoryRequests[q].subCategoryRequests[w]['textAreaRequest'] = vault.categoryRequests[q].subCategoryRequests[w].textAreaResponse ? vault.categoryRequests[q].subCategoryRequests[w].textAreaResponse : null;
          vault.categoryRequests[q].subCategoryRequests[w]['textRequest'] = null;
          vault.categoryRequests[q].subCategoryRequests[w]['dateRequest'] = null;
          vault.categoryRequests[q].subCategoryRequests[w]['dropDownRequest'] = null;
          vault.categoryRequests[q].subCategoryRequests[w]['tableRequest'] = null;
        } else if ((vault.categoryRequests[q].subCategoryRequests[w].type.toLowerCase().replace(/\s*/g, '')) == 'date') {
          vault.categoryRequests[q].subCategoryRequests[w]['textRequest'] = null;
          vault.categoryRequests[q].subCategoryRequests[w]['textAreaRequest'] = null;
          vault.categoryRequests[q].subCategoryRequests[w]['dateRequest'] = vault.categoryRequests[q].subCategoryRequests[w].dateResponse ? vault.categoryRequests[q].subCategoryRequests[w].dateResponse : null;
          vault.categoryRequests[q].subCategoryRequests[w]['dropDownRequest'] = null;
          vault.categoryRequests[q].subCategoryRequests[w]['tableRequest'] = null;
        } else if ((vault.categoryRequests[q].subCategoryRequests[w].type.toLowerCase().replace(/\s*/g, '')) == 'dropdown') {
          vault.categoryRequests[q].subCategoryRequests[w]['textAreaRequest'] = null;
          vault.categoryRequests[q].subCategoryRequests[w]['textRequest'] = null;
          vault.categoryRequests[q].subCategoryRequests[w]['dateRequest'] = null;
          vault.categoryRequests[q].subCategoryRequests[w]['tableRequest'] = null;
          vault.categoryRequests[q].subCategoryRequests[w]['dropDownRequest'] = vault.categoryRequests[q].subCategoryRequests[w].dropDownResponse ? vault.categoryRequests[q].subCategoryRequests[w].dropDownResponse : null;
          if (vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest) {
            vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownDefaultRequests = vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownDefaultResponses ? vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownDefaultResponses : null;
            vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownSelectedRequest = vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownSelectedResponse ? vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownSelectedResponse : null;
          }
        } else if ((vault.categoryRequests[q].subCategoryRequests[w].type.toLowerCase().replace(/\s*/g, '')) == 'table') {
          vault.categoryRequests[q].subCategoryRequests[w]['textAreaRequest'] = null;
          vault.categoryRequests[q].subCategoryRequests[w]['textRequest'] = null;
          vault.categoryRequests[q].subCategoryRequests[w]['dateRequest'] = null;
          vault.categoryRequests[q].subCategoryRequests[w]['dropDownRequest'] = null;
          vault.categoryRequests[q].subCategoryRequests[w]['tableRequest'] = vault.categoryRequests[q].subCategoryRequests[w].tableResponse ? vault.categoryRequests[q].subCategoryRequests[w].tableResponse : null;
          if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest) {
            vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderResponses ? vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderResponses : null;
            vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListResponses ? vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListResponses : null;
            if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests) {
              for (let e = 0; e < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests.length; e++) {
                if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].type == 'text' || vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].type == 'textarea' || vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].type == 'date') {
                  vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e]['dropDownDefaultRequests'] = null;
                } else if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].type == 'dropdown') {
                  vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e]['dropDownDefaultRequests'] = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].dropDownDefaultResponses ? vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].dropDownDefaultResponses : null;
                }
              }
            }
            if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests) {
              for (let m = 0; m < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests.length; m++) {
                vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m]['tableValueRequests'] = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueResponses ? vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueResponses : null;
                for (let n = 0; n < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests.length; n++) {
                  if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n].type.toLowerCase() == 'text') {
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['textRequest'] = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n].textResponse ? vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n].textResponse : null;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['textAreaRequest'] = null;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['dateRequest'] = null;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['dropDownDefaultRequests'] = null;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['dropDownSelectedRequest'] = null;
                  } else if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n].type.toLowerCase() == 'textarea') {
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['textRequest'] = null;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['textAreaRequest'] = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n].textAreaResponse ? vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n].textAreaResponse : null;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['dateRequest'] = null;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['dropDownDefaultRequests'] = null;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['dropDownSelectedRequest'] = null;
                  } else if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n].type.toLowerCase() == 'dropdown') {
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['textRequest'] = null;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['textAreaRequest'] = null;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['dateRequest'] = null;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['dropDownDefaultRequests'] = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n].dropDownDefaultResponses ? vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n].dropDownDefaultResponses : null;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['dropDownSelectedRequest'] = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n].dropDownSelectedResponse ? vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n].dropDownSelectedResponse : null;
                  } else if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n].type.toLowerCase() == 'date') {
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['textRequest'] = null;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['textAreaRequest'] = null;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['dateRequest'] = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n].dateResponse ? vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n].dateResponse : null;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['dropDownDefaultRequests'] = null;
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[m].tableValueRequests[n]['dropDownSelectedRequest'] = null;
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

function throwResponses(vault) {
  for (let q = 0; q < vault.categoryRequests.length; q++) {
    delete vault.categoryRequests[q].textResponse;
    delete vault.categoryRequests[q].subCategoryResponses;
    for (let w = 0; w < vault.categoryRequests[q].subCategoryRequests.length; w++) {
      delete vault.categoryRequests[q].subCategoryRequests[w].textResponse;
      delete vault.categoryRequests[q].subCategoryRequests[w].textAreaResponse;
      delete vault.categoryRequests[q].subCategoryRequests[w].dateResponse;
      delete vault.categoryRequests[q].subCategoryRequests[w].dropDownResponse;
      delete vault.categoryRequests[q].subCategoryRequests[w].tableResponse;
      if (vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest) {
        delete vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownDefaultResponses;
        delete vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownSelectedResponse;
      }
      if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest) {
        delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderResponses;
        delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListResponses;
      }
      if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest) {
        if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests) {
          for (let e = 0; e < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests.length; e++) {
            delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].textResponse;
            delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].dropDownSelectedResponse;
            delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].dropDownDefaultResponses;
          }
        }
        if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests) {
          for (let r = 0; r < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests.length; r++) {
            delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueResponses;
            for (let t = 0; t < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests.length; t++) {
              delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].id;
              delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].name;
              delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].columnName;
              delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].textResponse;
              delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].textAreaResponse;
              delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].dateResponse;
              delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].dropDownDefaultResponses;
              delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableValueListRequests[r].tableValueRequests[t].dropDownSelectedResponse;
            }
          }
        }
      }
    }
  }
}
