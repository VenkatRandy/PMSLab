import { Injectable } from '@angular/core';
import { FormBuilder, AbstractControl, FormControl, FormGroup, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private fb: FormBuilder) { }

  public createFormGroup(obj: any) {
    let formGroup = {};
    Object.keys(obj).forEach(key => {
      if (Array.isArray(obj[key])) {
        formGroup[key] = this.createFormArray(obj[key]);
      } else if (obj[key] instanceof Object) {
        formGroup[key] = this.createFormGroup(obj[key]);
      } else {
        formGroup[key] = new FormControl(obj[key]);
      }
    });
    return this.fb.group(formGroup);
  }

  public createFormArray(obj: any) {
    let formArray = [];
    Object.keys(obj).forEach(key => {
      formArray.push(this.createFormGroup(obj[key]));
    });
    return this.fb.array(formArray);
  }

  // ConvertToRequests_______________________________________________________________________________
  /**
   * convertTo
   */
  public convertTo(object) {
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
    this.responsesTorequests(vault);
    this.throwResponses(vault);
    return vault;
  }

  public responsesTorequests(vault) {
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

  public throwResponses(vault) {
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









  public convertToRequests(obj, x, reviewId, _isObject) {
    if (_isObject) {
      let vault = {
        "submitted": this.buildLevel(),
        "reviewId": reviewId,
        "roleType": obj.roleType,
        "employeeRating": null,
        "employeeComments": null,
        "level1Rating": null,
        "level1Comments": null,
        "level2Rating": null,
        "level2Comments": null,
        "level3Rating": null,
        "level3Comments": null,
        "postReviewRevieweeComments": obj.postReviewRevieweeComments,
        "categoryRequests": obj.categoryResponses
      }
      this.removeResponses(vault);
      this.deleteResponses(vault);
      return vault;
    } else {
      let vault = {
        "submitted": this.buildLevel(),
        "reviewId": reviewId,
        "roleType": obj[x].roleType,
        "employeeRating": null,
        "employeeComments": null,
        "level1Rating": null,
        "level1Comments": null,
        "level2Rating": null,
        "level2Comments": null,
        "level3Rating": null,
        "level3Comments": null,
        "postReviewRevieweeComments": obj[x].postReviewRevieweeComments,
        "categoryRequests": obj[x].categoryResponses
      }
      this.removeResponses(vault);
      this.deleteResponses(vault);
      return vault;
    }
  }
  public removeResponses(vault) {
    for (let q = 0; q < vault.categoryRequests.length; q++) {
      vault.categoryRequests[q]['subCategoryRequests'] = vault.categoryRequests[q].subCategoryResponses;
      if (vault.categoryRequests[q].subCategoryRequests) {
        for (let w = 0; w < vault.categoryRequests[q].subCategoryRequests.length; w++) {
          if ((vault.categoryRequests[q].subCategoryRequests[w].type.toLowerCase()) == 'text') {
            vault.categoryRequests[q].subCategoryRequests[w]['textRequest'] = this.buildLevel();
            vault.categoryRequests[q].subCategoryRequests[w]['textAreaRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['dateRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['dropDownRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['tableRequest'] = null;
          }
          else if ((vault.categoryRequests[q].subCategoryRequests[w].type.toLowerCase()) == 'textarea' || (vault.categoryRequests[q].subCategoryRequests[w].type.toLowerCase()) == 'text area') {
            vault.categoryRequests[q].subCategoryRequests[w]['textAreaRequest'] = this.buildLevel();
            vault.categoryRequests[q].subCategoryRequests[w]['textRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['dateRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['dropDownRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['tableRequest'] = null;
          } else if ((vault.categoryRequests[q].subCategoryRequests[w].type.toLowerCase()) == 'dropdown') {
            vault.categoryRequests[q].subCategoryRequests[w]['textAreaRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['textRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['dateRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['tableRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['dropDownRequest'] = vault.categoryRequests[q].subCategoryRequests[w].dropDownResponse;
            if (vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest != null) {
              vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownDefaultRequests = vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownDefaultResponses;
              vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownSelectedRequest = vault.categoryRequests[q].subCategoryRequests[w].dropDownRequest.dropDownSelectedResponse;
            }
          } else if ((vault.categoryRequests[q].subCategoryRequests[w].type.toLowerCase()) == 'table') {
            vault.categoryRequests[q].subCategoryRequests[w]['textAreaRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['textRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['dateRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['dropDownRequest'] = null;
            vault.categoryRequests[q].subCategoryRequests[w]['tableRequest'] = vault.categoryRequests[q].subCategoryRequests[w].tableResponse;
            if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest != null) {
              vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderResponses;
              // vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests = await this.buildHeader(vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderResponses);
              // if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests) {
              // vault.categoryRequests[q].subCategoryRequests[w].tableRequest['tableValueListRequests'] = null;
              //   // vault.categoryRequests[q].subCategoryRequests[w].tableRequest['tableValueListRequests'] = await this.replicateHeader(vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderResponses);
              // }
              if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests) {
                for (let e = 0; e < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests.length; e++) {
                  if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].type == 'text') {
                    // vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e]['textRequest'] = this.buildLevel();
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e]['dropDownDefaultRequests'] = null;
                  } else if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].type == 'dropdown') {
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e]['dropDownDefaultRequests'] = vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].dropDownDefaultResponses;
                  } else if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].type == 'date') {
                    // vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e]['textRequest'] = this.buildLevel();
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e]['dropDownDefaultRequests'] = null;
                  } else if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].type == 'textarea') {
                    vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e]['dropDownDefaultRequests'] = null;
                  }
                }
              }
            }
          }
        }
      }
    }
    return vault;
  }

  public deleteResponses(vault) {
    // console.log(2);
    for (let q = 0; q < vault.categoryRequests.length; q++) {
      delete vault.categoryRequests[q].subCategoryResponses;
      for (let w = 0; w < vault.categoryRequests[q].subCategoryRequests.length; w++) {
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
          if (vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests) {
            for (let e = 0; e < vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests.length; e++) {
              delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].textRequest;
              delete vault.categoryRequests[q].subCategoryRequests[w].tableRequest.tableHeaderRequests[e].textAreaRequest;
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
    return vault;
  }

  public buildLevel() {
    let grp = {
      employee: null,
      level1: null,
      level2: null,
      level3: null
    }
    return grp;
  }
  // \.ConvertToRequests_______________________________________________________________________________

  /**
   * Injects TrackBy Indices
   */
  public injectIndex(categoryRequests) {
    categoryRequests.forEach((categoryRequest, z) => {
      categoryRequest['categoryRequest'] = z;
      let subCategoryRequests = categoryRequest.subCategoryRequests;
      subCategoryRequests.forEach((subCategoryRequest, x) => {
        subCategoryRequest['subCategoryRequest'] = x;
        let type = subCategoryRequest.type.toLowerCase().replace(/\s*/g, '');
        if (type == 'dropdown') {
          let dropDownRequest = subCategoryRequest.dropDownRequest;
          if (dropDownRequest) {
            let dropDownDefaultRequests = dropDownRequest.dropDownDefaultRequests;
            if (dropDownDefaultRequests) {
              dropDownDefaultRequests.forEach((dropDownDefaultRequest, c) => {
                dropDownDefaultRequest['dropDownDefaultRequest'] = c;
              });
            }
          }
        } else if (type == 'table') {
          let tableRequest = subCategoryRequest.tableRequest;
          if (tableRequest) {
            let tableHeaderRequests = tableRequest.tableHeaderRequests;
            if (tableHeaderRequests) {
              tableHeaderRequests.forEach((tableHeaderRequest, v) => {
                tableHeaderRequest['tableHeaderRequest'] = v;
                let dropDownDefaultRequests = tableHeaderRequest.dropDownDefaultRequests;
                if (dropDownDefaultRequests) {
                  dropDownDefaultRequests.forEach((dropDownDefaultRequest, e) => {
                    dropDownDefaultRequest['dropDownDefaultRequest'] = e;
                  });
                }
              });
            }
            let tableValueListRequests = tableRequest.tableValueListRequests;
            if (tableValueListRequests) {
              tableValueListRequests.forEach((tableValueListRequest, b) => {
                tableValueListRequest['tableValueListRequest'] = b
                let tableValueRequests = tableValueListRequest.tableValueRequests;
                if (tableValueRequests) {
                  tableValueRequests.forEach((tableValueRequest, n) => {
                    tableValueRequest['tableValueRequest'] = n;
                  });
                }
              });
            }
          }
        }
      });
    });
  }

  /**
   * Removes TrackBy Indices
   */
  public rejectIndex(categoryRequests) {
    let data = categoryRequests;
    categoryRequests.forEach((categoryRequest, z) => {
      delete categoryRequest.categoryRequest;
      let subCategoryRequests = categoryRequest.subCategoryRequests;
      subCategoryRequests.forEach((subCategoryRequest, x) => {
        delete subCategoryRequest.subCategoryRequest;
        let type = subCategoryRequest.type.toLowerCase().replace(/\s*/g, '');
        if (type == 'dropdown') {
          let dropDownRequest = subCategoryRequest.dropDownRequest;
          if (dropDownRequest) {
            let dropDownDefaultRequests = dropDownRequest.dropDownDefaultRequests;
            if (dropDownDefaultRequests) {
              dropDownDefaultRequests.forEach((dropDownDefaultRequest, c) => {
                delete dropDownDefaultRequest.dropDownDefaultRequest;
              });
            }
          }
        } else if (type == 'table') {
          let tableRequest = subCategoryRequest.tableRequest;
          if (tableRequest) {
            let tableHeaderRequests = tableRequest.tableHeaderRequests;
            if (tableHeaderRequests) {
              tableHeaderRequests.forEach((tableHeaderRequest, v) => {
                delete tableHeaderRequest.tableHeaderRequest;
                let dropDownDefaultRequests = tableHeaderRequest.dropDownDefaultRequests;
                if (dropDownDefaultRequests) {
                  dropDownDefaultRequests.forEach((dropDownDefaultRequest, e) => {
                    delete dropDownDefaultRequest.dropDownDefaultRequest;
                  });
                }
              });
            }
            let tableValueListRequests = tableRequest.tableValueListRequests;
            if (tableValueListRequests) {
              tableValueListRequests.forEach((tableValueListRequest, b) => {
                delete tableValueListRequest.tableValueListRequest;
                let tableValueRequests = tableValueListRequest.tableValueRequests;
                if (tableValueRequests) {
                  tableValueRequests.forEach((tableValueRequest, n) => {
                    delete tableValueRequest.tableValueRequest;
                  });
                }
              });
            }
          }
        }
      });
    });
    return data;
  }

  /**
   * Injects TableValueLists from TableHeaderRequests
   */
  public injectTableValue(categoryRequests) {
    categoryRequests.forEach((categoryRequest, z) => {
      let subCategoryRequests = categoryRequest.subCategoryRequests;
      if (subCategoryRequests) {
        subCategoryRequests.forEach((subCategoryRequest, x) => {
          let type = subCategoryRequest.type.toLowerCase().replace(/\s*/g, '');
          if (type == 'table') {
            let tableRequest = subCategoryRequest.tableRequest;
            if (tableRequest) {
              let tableHeaderRequests = tableRequest.tableHeaderRequests;
              tableRequest['tableValueListRequests'] = [{
                tableValueRequests: []
              }]
              if (tableHeaderRequests) {
                tableHeaderRequests.forEach((tableHeaderRequest, c) => {
                  var GRP = {};
                  GRP['columnName'] = tableHeaderRequest.columnName;
                  GRP['description'] = tableHeaderRequest.description;
                  GRP['type'] = tableHeaderRequest.type;
                  let type = tableHeaderRequest.type.toLowerCase().replace(/\s*/g, '');
                  if (type == 'text') {
                    GRP['textRequest'] = this.buildLevel();
                    GRP['textAreaRequest'] = this.buildLevel();
                    GRP['dateRequest'] = this.buildLevel();
                    GRP['dropDownDefaultRequests'] = [];
                    GRP['dropDownSelectedRequest'] = this.buildLevel()
                  } else if (type == 'textarea') {
                    GRP['textRequest'] = this.buildLevel();
                    GRP['textAreaRequest'] = this.buildLevel();
                    GRP['dateRequest'] = this.buildLevel();
                    GRP['dropDownDefaultRequests'] = [];
                    GRP['dropDownSelectedRequest'] = this.buildLevel()
                  } else if (type == 'date') {
                    GRP['textRequest'] = this.buildLevel();
                    GRP['dateRequest'] = this.buildLevel();
                    GRP['textAreaRequest'] = this.buildLevel();
                    GRP['dropDownDefaultRequests'] = [];
                    GRP['dropDownSelectedRequest'] = this.buildLevel()
                  } else if (type == 'dropdown') {
                    GRP['textRequest'] = this.buildLevel();
                    GRP['textAreaRequest'] = this.buildLevel();
                    GRP['dateRequest'] = this.buildLevel();
                    GRP['dropDownDefaultRequests'] = tableHeaderRequest.dropDownDefaultRequests;
                    GRP['dropDownSelectedRequest'] = this.buildLevel()
                  }
                  tableRequest.tableValueListRequests[0].tableValueRequests.push(GRP)
                });
              }
            }
          }
        });
      }
    });
  }

  /**
 * Resets Type
 */
  public resetType(form, z) {
    let categoryRequests = form.get(`categoryRequests.${z}`).controls;
    for (let index = 0; index < categoryRequests.subCategoryRequests.length; index++) {
      let type = form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].get('type').value;
      if (type.toLowerCase() == "text") {
        //Reset Dropdown
        let drop = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.dropDownRequest.dropDownDefaultRequests`);
        if (drop != null) {
          while (drop.length != 0) {
            drop.removeAt(0);
          }
        }
        // Reset Table
        let table = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests`);
        if (table != null) {
          while (table.length != 0) {
            table.removeAt(0);
          }
        }
      } else if (type.toLowerCase() == "textarea") {
        //Reset Dropdown
        let drop = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.dropDownRequest.dropDownDefaultRequests`);
        if (drop != null) {
          while (drop.length != 0) {
            drop.removeAt(0);
          }
        }
        // Reset Table
        let table = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests`);
        if (table != null) {
          while (table.length != 0) {
            table.removeAt(0);
          }
        }
      } else if (type.toLowerCase() == "date") {
        //Reset Dropdown
        let drop = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.dropDownRequest.dropDownDefaultRequests`);
        if (drop != null) {
          while (drop.length != 0) {
            drop.removeAt(0);
          }
        }
        // Reset Table
        let table = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests`);
        if (table != null) {
          while (table.length != 0) {
            table.removeAt(0);
          }
        }
      } else if (type.toLowerCase() == "dropdown") {
        // Reset Table
        let table = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests`);
        if (table != null) {
          while (table.length != 0) {
            table.removeAt(0);
          }
        }
      } else if (type.toLowerCase() == "table") {
        //Reset Dropdown
        let drop = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.dropDownRequest.dropDownDefaultRequests`);
        if (drop != null) {
          while (drop.length != 0) {
            drop.removeAt(0);
          }
        }
        let table = form.getRawValue().categoryRequests[z].subCategoryRequests[index].tableRequest.tableHeaderRequests;
        for (let idx = 0; idx < table.length; idx++) {
          let type = form.getRawValue().categoryRequests[z].subCategoryRequests[index].tableRequest.tableHeaderRequests[idx].type;
          if (type == 'dropdown') {

          } else if (type == 'text' || type == 'date' || type == 'textarea') {
            //Reset Dropdown
            let drop = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}.dropDownDefaultRequests`);
            if (drop.value != null) {
              while (drop.length != 0) {
                drop.removeAt(0);
              }
            }
          }
        }
      }
    }
  }

  /**
   * Creates Default Structure
   */
  public injectNull(categoryRequests) {
    categoryRequests.forEach((categoryRequest, z) => {
      categoryRequest['weightage'] = null;
      categoryRequest['weightageAgainstKRA'] = false;
      categoryRequest['textRequest'] = null;
      let subCategoryRequests = categoryRequest.subCategoryRequests;
      if (subCategoryRequests) {
        subCategoryRequests.forEach((subCategoryRequest, x) => {
          let type = subCategoryRequest.type.toLowerCase().replace(/\s*/g, '');
          if (type == 'text') {
            subCategoryRequest.textRequest = this.buildLevel();
            subCategoryRequest.textAreaRequest = this.buildLevel();
            subCategoryRequest.dateRequest = this.buildLevel();
            subCategoryRequest.dropDownRequest = {
              dropDownDefaultRequests: [],
              dropDownSelectedRequest: this.buildLevel()
            }
            subCategoryRequest.tableRequest = {
              tableHeaderRequests: [],
              tableValueListRequests: []
            }
          } else if (type == 'date') {
            subCategoryRequest.textRequest = this.buildLevel();
            subCategoryRequest.textAreaRequest = this.buildLevel();
            subCategoryRequest.dateRequest = this.buildLevel();
            subCategoryRequest.dropDownRequest = {
              dropDownDefaultRequests: [],
              dropDownSelectedRequest: this.buildLevel()
            }
            subCategoryRequest.tableRequest = {
              tableHeaderRequests: [],
              tableValueListRequests: []
            }
          } else if (type == 'textarea') {
            subCategoryRequest.textRequest = this.buildLevel();
            subCategoryRequest.textAreaRequest = this.buildLevel();
            subCategoryRequest.dateRequest = this.buildLevel();
            subCategoryRequest.dropDownRequest = {
              dropDownDefaultRequests: [],
              dropDownSelectedRequest: this.buildLevel()
            }
            subCategoryRequest.tableRequest = {
              tableHeaderRequests: [],
              tableValueListRequests: []
            }
          } else if (type == 'dropdown') {
            subCategoryRequest.textRequest = this.buildLevel();
            subCategoryRequest.textAreaRequest = this.buildLevel();
            subCategoryRequest.dateRequest = this.buildLevel();
            subCategoryRequest.tableRequest = {
              tableHeaderRequests: [],
              tableValueListRequests: []
            }
          } else if (type == 'table') {
            subCategoryRequest.textRequest = this.buildLevel();
            subCategoryRequest.textAreaRequest = this.buildLevel();
            subCategoryRequest.dateRequest = this.buildLevel();
            subCategoryRequest.dropDownRequest = {
              dropDownDefaultRequests: [],
              dropDownSelectedRequest: this.buildLevel()
            }

            let tableRequest = subCategoryRequest.tableRequest;
            if (tableRequest) {
              let tableHeaderRequests = tableRequest.tableHeaderRequests;
              if (tableHeaderRequests) {
                tableHeaderRequests.forEach((tableHeaderRequest, c) => {
                  let type = tableHeaderRequest.type.toLowerCase().replace(/\s*/g, '');
                  if (type == 'text' || type == 'date' || type == 'textarea') {
                    tableHeaderRequest['textRequest'] = this.buildLevel();
                    tableHeaderRequest['textAreaRequest'] = this.buildLevel();
                    tableHeaderRequest.dropDownDefaultRequests = []
                  } else {
                    tableHeaderRequest['textRequest'] = this.buildLevel();
                    tableHeaderRequest['textAreaRequest'] = this.buildLevel();
                  }
                })
              }

            }
          }
        });
      }
    });
  }

  /**
* Sets Value For 2D and 3D array
*/
  public setInitialValue(categoryRequests, _isDropDownShow, _isTableShow, _isTableDropDownShow) {
    categoryRequests.forEach((categoryRequest, z) => {
      let subCategoryRequests = categoryRequest.subCategoryRequests;
      if (subCategoryRequests) {
        subCategoryRequests.forEach((subCategoryRequest, x) => {
          let type = subCategoryRequest.type.toLowerCase().replace(/\s*/g, '');
          if (type == 'text') {

          } else if (type == 'textarea') {

          } else if (type == 'dropdown') {
            _isDropDownShow[z][x] = true;
          } else if (type == 'table') {
            _isTableShow[z][x] = true;
            let tableHeaderRequests = subCategoryRequest.tableRequest.tableHeaderRequests;
            if (tableHeaderRequests) {
              tableHeaderRequests.forEach((tableHeaderRequest, c) => {
                let type = tableHeaderRequest.type.toLowerCase().replace(/\s*/g, '');
                if (type == 'text' || type == 'date' || type == 'textarea') {

                } else {
                  _isTableDropDownShow[z][x][c] = true;
                }
              });
            }

          }
        });
      }
    });
  }

  /**
 * NULL
 */
  public setNull(form) {
    let zip = form.get(`categoryRequests`).controls;
    for (let z = 0; z < zip.length; z++) {
      let categoryRequests = form.get(`categoryRequests.${z}`).controls;
      form.get(`categoryRequests.${z}`).removeControl('weightage');
      for (let index = 0; index < categoryRequests.subCategoryRequests.length; index++) {
        //++++++++++++++++++++++++++++++++++++++++++Subcategory
        let type = form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].get('type').value.toLowerCase().replace(/\s*/g, '');
        if (type == "text") {
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
        } else if (type == "dropdown") {
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
              //Reset Text
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).removeControl('textRequest');
              // var control = this.fb.control(null);
              // form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).addControl('textRequest', control);

              // Remove oID
              let oID = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}.dropDownDefaultRequests`).value;
              for (let o = 0; o < oID.length; o++) {
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}.dropDownDefaultRequests.${o}`).removeControl('oId');
              }
            } else if (type == 'text' || type == 'date' || type == 'textarea') {
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
            // form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}`).removeControl('dropDownDefaultResponses');
            for (let f = 0; f < tableV[idx].tableValueRequests.length; f++) {
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('t_id');
              let type = form.getRawValue().categoryRequests[z].subCategoryRequests[index].tableRequest.tableValueListRequests[idx].tableValueRequests[f].type.toLowerCase().replace(/\s*/g, '');
              if (type == 'dropdown') {
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('textAreaRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('textAreaRequest', control);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('textRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('textRequest', control);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dropDownDefaultRequests');
              } else if (type == 'text') {
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('textAreaRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('textAreaRequest', control);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dropDownDefaultRequests');
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dropDownSelectedRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('dropDownSelectedRequest', control);
              } else if (type == 'textarea') {
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('textRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('textRequest', control);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dropDownDefaultRequests');
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dropDownSelectedRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('dropDownSelectedRequest', control);
              } else if (type == 'date') {
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('textAreaRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('textAreaRequest', control);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('textRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('textRequest', control);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dropDownDefaultRequests');
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dropDownSelectedRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('dropDownSelectedRequest', control);
              }
            }
          }
          // \.INSIDE_TABLE_VALUE_REQUESTS______________________________________
        }
      }
    }
    // console.warn(JSON.stringify(form.value));

    // var abc = { ...JSON.parse(JSON.stringify(form.value)) };
    // console.log(abc);
  }
}
