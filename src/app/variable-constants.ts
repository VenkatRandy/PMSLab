import { AbstractControl, FormGroup, FormArray, FormControl, FormBuilder, ValidatorFn, Validators, ValidationErrors } from '@angular/forms';

// HRMS
// export const userDetails = JSON.parse(sessionStorage.getItem('User Details'));
// export const screenAccess = userDetails.screenAccessResponses;
// export const reviewerResponse = userDetails.reviewerResponse;

// MISC
export const COMMENT = "------------------------------------------------------------------------------------------------------------------------------------------------";

// REVIEW TYPE
export const REVIEW_TYPE_CONFIRMATION = "Confirmation";
export const REVIEW_TYPE_MIDYEAR = "Mid-Year";
export const REVIEW_TYPE_ANNUAL = "Annual";
export const REVIEW_TYPE_PIP = "Performance Improvement Program";

export class CONSTANTS {
  public static get CURRENT_ROUTE() { return localStorage.getItem('current_route'); };
  // HRMS
  public static get USER_DETAILS() { return JSON.parse(sessionStorage.getItem('User Details')) ? JSON.parse(sessionStorage.getItem('User Details')) : null };
  public static get USER_NAME() { return CONSTANTS.USER_DETAILS ? CONSTANTS.USER_DETAILS.firstName + " " + CONSTANTS.USER_DETAILS.lastName : null };
  public static get SCREEN_ACCESS() {
    return JSON.parse(sessionStorage.getItem('User Details')) ? JSON.parse(sessionStorage.getItem('User Details')).screenAccessResponses : null;
  };
  public static get REVIEWER_RESPONSE() {
    return JSON.parse(sessionStorage.getItem('User Details')) ? JSON.parse(sessionStorage.getItem('User Details')).reviewerResponse : null;
  };
  public static get REVIEWEE_RESPONSE() {
    return JSON.parse(sessionStorage.getItem('User Details')) ? JSON.parse(sessionStorage.getItem('User Details')).revieweeResponse : null;
  };
  public static get TABNUMBER() {
    return JSON.parse(sessionStorage.getItem('TabNumber')) ? JSON.parse(sessionStorage.getItem('TabNumber')) : null;
  };

  // REVIEW TYPE
  public static get REVIEW_TYPE_CONFIRMATION(): string { return "Confirmation"; };
  public static get REVIEW_TYPE_MIDYEAR(): string { return "Mid-Year"; };
  public static get REVIEW_TYPE_ANNUAL(): string { return "Annual"; };
  public static get REVIEW_TYPE_PIP(): string { return "Performance Improvement Plan"; };

  //STATUS
  public static get SUCCESS(): string { return "Success"; };
  public static get FAILURE(): string { return "Failure"; };

  public static get REVIEW_STATUS_OPEN(): string { return "Open"; };
  public static get REVIEW_STATUS_REVIEW_INITIATED(): string { return "Review Initiated by HR"; };
  // public static get REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1(): string { return "Review processed to Level1 reviewer by level2 or employee"; };
  public static get REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_HR(): string { return "Review processed to Level1 reviewer by HR"; };
  public static get REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL2(): string { return "Review processed to Level2 reviewer"; };
  public static get REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL3(): string { return "Review processed to Level3 reviewer"; };
  public static get REVIEW_STATUS_REVIEW_PROCESSED_TO_EMPLOYEE(): string { return "Review processed to employee"; };
  public static get REVIEW_STATUS_REVIEW_PROCESSED_TO_HR(): string { return "Review processed to HR"; };
  public static get TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL1(): string { return "Template saved by level1"; };
  public static get TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL2(): string { return "Template saved by level2"; };
  public static get TEMPLATE_SAVED_AS_DRAFT_BY_LEVEL3(): string { return "Template saved by level3"; };
  public static get TEMPLATE_SAVED_AS_DRAFT_BY_EMPLOYEE(): string { return "Template saved by employee"; };

  public static get REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_EMPLOYEE(): string { return "Review processed to Level1 reviewer by employee" };
  public static get REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1_BY_LEVEL2(): string { return "Review processed to Level1 reviewer by level2" };
  public static get REVIEW_STATUS_TEMPLATE_SELECTED_BY_LEVEL1(): string { return "Template Selected By Level1" };

  public static get REVIEW_STATUS_CLOSED(): string { return "Closed"; };
  public static get REVIEW_PENDING(): string { return "Pending"; };

  //ALERT
  //#Success
  public static get REVIEW_INITIATION_SUCCESS(): string { return "Review Initiated Successfully"; };
  public static get REVIEW_PROCESSES_SUCCESS(): string { return "Review Processed Successfully"; };
  public static get REVIEW_SAVE_SUCCESS(): string { return "Review Saved Successfully"; };
  public static get REVIEW_RELEASE_SUCCESS(): string { return "Review Released Successfully"; };
  public static get REVIEW_COMPLETION_SUCCESS(): string { return "Review Completed Successfully"; };
  public static get REVIEW_SENT_BACK_SUCCESS(): string { return "Review Returned Successfully"; };

  //RATING
  public static get RATING_OUTSTANDING(): string { return "Outstanding"; };
  public static get RATING_EXCEED(): string { return "Exceed Expectations"; };
  public static get RATING_MEET(): string { return "Meets Expectations"; };
  public static get RATING_BELOW(): string { return "Below Expectations"; };

  //LEVEL
  public static get LEVEL1(): string { return "Level 1 - Manager"; };
  public static get LEVEL2(): string { return "Level 2 - Lead"; };
  public static get LEVEL3(): string { return "Level 3 - Developer & QA Analyst"; };
  public static get SELF(): string { return "Self"; };

  public static get REVIEWER(): string { return "Reviewer"; };
  public static get APPRAISERI(): string { return "Appraiser I"; };
  public static get APPRAISERII(): string { return "Appraiser II"; };
  public static get EMPLOYEE(): string { return "Reviewee"; };

  //MISC
  public static get COMMENT(): string { return "------------------------------------------------------------------------------------------------------------------------------------------------"; };
  public static get CONTENT() {
    return JSON.parse(decodeURIComponent(sessionStorage.getItem('content'))) ? JSON.parse(decodeURIComponent(sessionStorage.getItem('content'))) : null;
  };
  public static get INVALID_FORM(): string {
    return "Something went wrong! Please go through the form";
  };
  public static get ERROR_CODE() {
    return JSON.parse(sessionStorage.getItem('error-code')) ? JSON.parse(sessionStorage.getItem('error-code')) : null;
  };
}

export class FUNCTIONS {

  public static TRIM(value: string): string {
    return value ? value.toLowerCase().replace(/\s*/g, '') : null;
  }

  public static removeValidators(form: FormGroup) {
    for (const key in form.controls) {
      form.get(key).clearValidators();
      form.get(key).updateValueAndValidity();
    }
  }

  public static parse(value: any): Date | null {
    if (typeof value === "string" && value.indexOf("-") > -1) {
      const str = value.split("-");
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    } else if (typeof value === "string" && value === "") {
      return new Date();
    }
    const timestamp = typeof value === "number" ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  public static RATING(type): number {
    if (type == CONSTANTS.RATING_OUTSTANDING) {
      return 4;
    } else if (type == CONSTANTS.RATING_EXCEED) {
      return 3;
    } else if (type == CONSTANTS.RATING_MEET) {
      return 2;
    } else if (type == CONSTANTS.RATING_BELOW) {
      return 1;
    }
  }

  public static REVIEWTYPE(reviewId): string {
    if (reviewId == 1) {
      return CONSTANTS.REVIEW_TYPE_CONFIRMATION;
    } else if (reviewId == 2) {
      return CONSTANTS.REVIEW_TYPE_MIDYEAR;
    } else if (reviewId == 3) {
      return CONSTANTS.REVIEW_TYPE_ANNUAL;
    } else if (reviewId == 4) {
      return CONSTANTS.REVIEW_TYPE_PIP;
    }
  }

  public static FINDLEVEL(reviewId): string {
    let userDetails = CONSTANTS.USER_DETAILS;
    let revieweeResponse = CONSTANTS.REVIEWEE_RESPONSE;
    if (userDetails) {
      if (revieweeResponse) {
        if (reviewId == 1) {
          if (revieweeResponse.confirmationRevieweeResponse) {
            if (revieweeResponse.confirmationRevieweeResponse.level1Response) {
              return CONSTANTS.LEVEL1;
            }
            if (revieweeResponse.confirmationRevieweeResponse.level2Response) {
              return CONSTANTS.LEVEL2;
            } else {
              return CONSTANTS.LEVEL3;
            }
          }
        } else if (reviewId == 2) {
          if (revieweeResponse.midyearRevieweeResponse) {
            if (revieweeResponse.midyearRevieweeResponse.level1Response) {
              return CONSTANTS.LEVEL1;
            }
            if (revieweeResponse.midyearRevieweeResponse.level2Response) {
              return CONSTANTS.LEVEL2;
            } else {
              return CONSTANTS.LEVEL3;
            }
          }
        } else if (reviewId == 3) {
          if (revieweeResponse.annualRevieweeResponse) {
            if (revieweeResponse.annualRevieweeResponse.level1Response) {
              return CONSTANTS.LEVEL1;
            }
            if (revieweeResponse.annualRevieweeResponse.level2Response) {
              return CONSTANTS.LEVEL2;
            } else {
              return CONSTANTS.LEVEL3;
            }
          }
        } else if (reviewId == 4) {
          if (revieweeResponse.pipRevieweeResponse) {
            if (revieweeResponse.pipRevieweeResponse.level1Response) {
              return CONSTANTS.LEVEL1;
            }
            if (revieweeResponse.pipRevieweeResponse.level2Response) {
              return CONSTANTS.LEVEL2;
            } else {
              return CONSTANTS.LEVEL3;
            }
          }
        }
      } else {
        return CONSTANTS.SELF;
      }
    }
  };

  public static LEVELABBR(reviewId): string {
    let userDetails = CONSTANTS.USER_DETAILS;
    let revieweeResponse = CONSTANTS.REVIEWEE_RESPONSE;
    if (userDetails) {
      if (revieweeResponse) {
        if (reviewId == 1) {
          if (revieweeResponse.confirmationRevieweeResponse) {
            if (revieweeResponse.confirmationRevieweeResponse.level1Response) {
              return CONSTANTS.REVIEWER;
            }
            if (revieweeResponse.confirmationRevieweeResponse.level2Response) {
              return CONSTANTS.APPRAISERI;
            } else {
              return CONSTANTS.APPRAISERII;
            }
          }
        } else if (reviewId == 2) {
          if (revieweeResponse.midyearRevieweeResponse) {
            if (revieweeResponse.midyearRevieweeResponse.level1Response) {
              return CONSTANTS.REVIEWER;
            }
            if (revieweeResponse.midyearRevieweeResponse.level2Response) {
              return CONSTANTS.APPRAISERI;
            } else {
              return CONSTANTS.APPRAISERII;
            }
          }
        } else if (reviewId == 3) {
          if (revieweeResponse.annualRevieweeResponse) {
            if (revieweeResponse.annualRevieweeResponse.level1Response) {
              return CONSTANTS.REVIEWER;
            }
            if (revieweeResponse.annualRevieweeResponse.level2Response) {
              return CONSTANTS.APPRAISERI;
            } else {
              return CONSTANTS.APPRAISERII;
            }
          }
        } else if (reviewId == 4) {
          if (revieweeResponse.pipRevieweeResponse) {
            if (revieweeResponse.pipRevieweeResponse.level1Response) {
              return CONSTANTS.REVIEWER;
            }
            if (revieweeResponse.pipRevieweeResponse.level2Response) {
              return CONSTANTS.APPRAISERI;
            } else {
              return CONSTANTS.APPRAISERII;
            }
          }
        }
      } else {
        return CONSTANTS.EMPLOYEE;
      }
    }
  };

  public static LEVEL(reviewId): string {
    let userDetails = CONSTANTS.USER_DETAILS;
    let revieweeResponse = CONSTANTS.REVIEWEE_RESPONSE;
    if (userDetails) {
      if (revieweeResponse) {
        if (reviewId == 1) {
          if (revieweeResponse.confirmationRevieweeResponse) {
            if (revieweeResponse.confirmationRevieweeResponse.level1Response) {
              return 'Level 1';
            }
            if (revieweeResponse.confirmationRevieweeResponse.level2Response) {
              return 'Level 2';
            } else {
              return 'Level 3';
            }
          }
        } else if (reviewId == 2) {
          if (revieweeResponse.midyearRevieweeResponse) {
            if (revieweeResponse.midyearRevieweeResponse.level1Response) {
              return 'Level 1';
            }
            if (revieweeResponse.midyearRevieweeResponse.level2Response) {
              return 'Level 2';
            } else {
              return 'Level 3';
            }
          }
        } else if (reviewId == 3) {
          if (revieweeResponse.annualRevieweeResponse) {
            if (revieweeResponse.annualRevieweeResponse.level1Response) {
              return 'Level 1';
            }
            if (revieweeResponse.annualRevieweeResponse.level2Response) {
              return 'Level 2';
            } else {
              return 'Level 3';
            }
          }
        } else if (reviewId == 4) {
          if (revieweeResponse.pipRevieweeResponse) {
            if (revieweeResponse.pipRevieweeResponse.level1Response) {
              return 'Level 1';
            }
            if (revieweeResponse.pipRevieweeResponse.level2Response) {
              return 'Level 2';
            } else {
              return 'Level 3';
            }
          }
        }
      } else {
        return 'Self';
      }
    }
  };

  // public static LEVEL(reviewId): string {
  //   let userDetails = CONSTANTS.USER_DETAILS;
  //   let revieweeResponse = CONSTANTS.REVIEWEE_RESPONSE;
  //   if (userDetails) {
  //     if ((userDetails.designation.toLowerCase()).includes('manager') || userDetails.designation.match('Senior Vice President')) {
  //       return 'Level 1';
  //     } else {
  //       if (revieweeResponse) {
  //         if (reviewId == 1) {
  //           if (revieweeResponse.confirmationRevieweeResponse) {
  //             if (revieweeResponse.confirmationRevieweeResponse.level2Response) {
  //               return 'Level 2';
  //             } else {
  //               return 'Level 3';
  //             }
  //           }
  //         } else if (reviewId == 2) {
  //           if (revieweeResponse.midyearRevieweeResponse) {
  //             if (revieweeResponse.midyearRevieweeResponse.level2Response) {
  //               return 'Level 2';
  //             } else {
  //               return 'Level 3';
  //             }
  //           }
  //         } else if (reviewId == 3) {
  //           if (revieweeResponse.annualRevieweeResponse) {
  //             if (revieweeResponse.annualRevieweeResponse.level2Response) {
  //               return 'Level 2';
  //             } else {
  //               return 'Level 3';
  //             }
  //           }
  //         } else if (reviewId == 4) {
  //           if (revieweeResponse.pipRevieweeResponse) {
  //             if (revieweeResponse.pipRevieweeResponse.level2Response) {
  //               return 'Level 2';
  //             } else {
  //               return 'Level 3';
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // };

  // SCREEN ACCESS
  public static _isHistorySelfConfirmationAccessible(element): boolean {
    if ((element.category == 'Review History'
      && element.subCategoryLevel1 == 'Self'
      && element.subCategoryLevel2 == 'Confirmation')
      && element.isAccessible == 'Y') {
      return true;
    }

    if ((element.category == 'Review History'
      && element.subCategoryLevel1 == 'Self'
      && element.subCategoryLevel2 == 'Mid Year')
      && element.isAccessible == 'Y') {
      return true;
    }

    if ((element.category == 'Review History'
      && element.subCategoryLevel1 == 'Self'
      && element.subCategoryLevel2 == 'Annual')
      && element.isAccessible == 'Y') {
      return true;
    }

    if ((element.category == 'Review History'
      && element.subCategoryLevel1 == 'Self'
      && element.subCategoryLevel2 == 'PIP')
      && element.isAccessible == 'Y') {
      return true;
    }
  }
}

//STATUS
export const REVIEW_STATUS_REVIEW_INITIATED = "Review Initiated by HR";
export const REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL1 = "Review processed to Level1 reviewer";
export const REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL2 = "Review processed to Level2 reviewer";
export const REVIEW_STATUS_REVIEW_PROCESSED_TO_LEVEL3 = "Review processed to Level3 reviewer";
export const REVIEW_STATUS_REVIEW_PROCESSED_TO_EMPLOYEE = "Review processed to employee";
export const REVIEW_STATUS_REVIEW_PROCESSED_TO_HR = "Review processed to HR";
export const REVIEW_STATUS_CLOSED = "Closed";

// Deep Copy
export function deepCopy<T extends AbstractControl>(control: T): T {
  let newControl: T;
  if (control instanceof FormGroup) {
    const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
    const controls = control.controls;
    Object.keys(controls).forEach(key => {
      formGroup.addControl(key, deepCopy(controls[key]));
    })
    newControl = formGroup as any;
  }
  else if (control instanceof FormArray) {
    const formArray = new FormArray([], control.validator, control.asyncValidator);
    control.controls.forEach(formControl => formArray.push(deepCopy(formControl)))
    newControl = formArray as any;
  }
  else if (control instanceof FormControl) {
    newControl = new FormControl(control.value, control.validator, control.asyncValidator) as any;
  }
  else {
    throw new Error('Error: unexpected control value');
  }
  if (control.disabled) newControl.disable({ emitEvent: false });
  return newControl;
}

export function buildLevels() {
  return new FormGroup({
    employee: new FormControl(null),
    level1: new FormControl(null),
    level2: new FormControl(null),
    level3: new FormControl(null),
  })
}

// export class Validator2s {
//   static min(min: number): ValidatorFn {
//     return (control: AbstractControl): ValidationErrors | null => {
//       if (isEmptyInputValue(control.value) || isEmptyInputValue(min)) {
//         return null;
//       }
//       const value = parseInt(control.value);
//       return !isNaN(value) && value < min ? { 'min': { 'min': min, 'actual': control.value } } : null;
//     };
//   }
//   static max(max: number): ValidatorFn {
//     return (control: AbstractControl): ValidationErrors | null => {
//       if (isEmptyInputValue(control.value) || isEmptyInputValue(max)) {
//         return null;
//       }
//       const value = parseInt(control.value);
//       return !isNaN(value) && value > max ? { 'max': { 'max': max, 'actual': control.value } } : null;
//     };
//   }
// }

// export function isEmptyInputValue(value) {
//   if (value && ''.test(value)) {

//   } else {
//     return false;
//   }

// }