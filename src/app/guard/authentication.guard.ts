import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { CONSTANTS } from '../variable-constants';
import { DataService } from '../service/data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  screenAccess;
  constructor(private dataservice: DataService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    this.screenAccess = CONSTANTS.SCREEN_ACCESS;
    let count = 0;

    if (this.screenAccess != null) {
      for (let i = 0; i < this.screenAccess.length; i++) {
        if ((this.screenAccess[i].category == 'Review History'
          && this.screenAccess[i].subCategoryLevel1 == 'Self'
          && this.screenAccess[i].subCategoryLevel2 == 'Confirmation')
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        } else if ((this.screenAccess[i].category == 'Review History'
          && this.screenAccess[i].subCategoryLevel1 == 'Self'
          && this.screenAccess[i].subCategoryLevel2 == 'Mid Year')
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        } else if ((this.screenAccess[i].category == 'Review History'
          && this.screenAccess[i].subCategoryLevel1 == 'Self'
          && this.screenAccess[i].subCategoryLevel2 == 'Annual')
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        } else if ((this.screenAccess[i].category == 'Review History'
          && this.screenAccess[i].subCategoryLevel1 == 'Self'
          && this.screenAccess[i].subCategoryLevel2 == 'PIP')
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        } else if ((this.screenAccess[i].category == 'Review History'
          && this.screenAccess[i].subCategoryLevel1 == 'Reviewees'
          && this.screenAccess[i].subCategoryLevel2 == 'Confirmation')
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        } else if ((this.screenAccess[i].category == 'Review History'
          && this.screenAccess[i].subCategoryLevel1 == 'Reviewees'
          && this.screenAccess[i].subCategoryLevel2 == 'Mid Year')
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        } else if ((this.screenAccess[i].category == 'Review History'
          && this.screenAccess[i].subCategoryLevel1 == 'Reviewees'
          && this.screenAccess[i].subCategoryLevel2 == 'Annual')
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        } else if ((this.screenAccess[i].category == 'Review History'
          && this.screenAccess[i].subCategoryLevel1 == 'Reviewees'
          && this.screenAccess[i].subCategoryLevel2 == 'PIP')
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        } else if (this.screenAccess[i].category == 'Review Initiation'
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        } else if (this.screenAccess[i].category == 'My Review'
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        } else if (this.screenAccess[i].category == 'Employee Review'
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        } else if (this.screenAccess[i].category == 'Review Release'
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        } else if (this.screenAccess[i].category == 'User Workflow'
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        } else if (this.screenAccess[i].category == 'Review Logs'
          && this.screenAccess[i].subCategoryLevel1 == 'Confirmation'
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        }
        else if (this.screenAccess[i].category == 'Review Logs'
          && this.screenAccess[i].subCategoryLevel1 == 'Mid Year'
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        }
        else if (this.screenAccess[i].category == 'Review Logs'
          && this.screenAccess[i].subCategoryLevel1 == 'Annual'
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        }
        else if (this.screenAccess[i].category == 'Review Logs'
          && this.screenAccess[i].subCategoryLevel1 == 'PIP'
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        }

        else if (this.screenAccess[i].category == 'Review Revoke'
          && this.screenAccess[i].subCategoryLevel1 == 'Confirmation'
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        }
        else if (this.screenAccess[i].category == 'Review Revoke'
          && this.screenAccess[i].subCategoryLevel1 == 'Mid Year'
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        }
        else if (this.screenAccess[i].category == 'Review Revoke'
          && this.screenAccess[i].subCategoryLevel1 == 'Annual'
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        }
        else if (this.screenAccess[i].category == 'Review Revoke'
          && this.screenAccess[i].subCategoryLevel1 == 'PIP'
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        }
        else if (this.screenAccess[i].category == 'All Review'
          && this.screenAccess[i].subCategoryLevel1 == 'Confirmation'
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        }
        else if (this.screenAccess[i].category == 'All Review'
          && this.screenAccess[i].subCategoryLevel1 == 'Mid Year'
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        }
        else if (this.screenAccess[i].category == 'All Review'
          && this.screenAccess[i].subCategoryLevel1 == 'Annual'
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        }
        else if (this.screenAccess[i].category == 'All Review'
          && this.screenAccess[i].subCategoryLevel1 == 'PIP'
          && this.screenAccess[i].isAccessible == 'Y') {
          count++;
        }

      }

      // If Not Accessible
      if (count != 0) {
        return true;
      } else {
        // this.dataservice.setErrorCode(403);
        sessionStorage.removeItem('error-code');
        sessionStorage.setItem('error-code', JSON.stringify(403))
        this.router.navigate(['error']);
        return false;
      }
    }



    // if (this.screenAccess != null) {
    //   for (let i = 0; i < this.screenAccess.length; i++) {
    //     if ((this.screenAccess[i].category == 'Review History'
    //       && this.screenAccess[i].subCategoryLevel1 == 'Self')
    //       && this.screenAccess[i].isAccessible == 'Y') {
    //       count++;
    //     } else if ((this.screenAccess[i].category == 'Review History'
    //       && this.screenAccess[i].subCategoryLevel1 == 'Reviewees')
    //       && this.screenAccess[i].isAccessible == 'Y') {
    //       count++;
    //     } else if (this.screenAccess[i].category == 'Review Initiation'
    //       && this.screenAccess[i].isAccessible == 'Y') {
    //       count++;
    //     } else if (this.screenAccess[i].category == 'My Review'
    //       && this.screenAccess[i].isAccessible == 'Y') {
    //       count++;
    //     } else if (this.screenAccess[i].category == 'Employee Review'
    //       && this.screenAccess[i].isAccessible == 'Y') {
    //       count++;
    //     } else if (this.screenAccess[i].category == 'Review Release'
    //       && this.screenAccess[i].isAccessible == 'Y') {
    //       count++;
    //     }
    //   }

    //   // If Not Accessible
    //   if (count != 0) {
    //     return true;
    //   } else {
    //     // this.dataservice.setErrorCode(403);
    //     sessionStorage.removeItem('error-code');
    //     sessionStorage.setItem('error-code', JSON.stringify(403))
    //     this.router.navigate(['error']);
    //     return false;
    //   }
    // }
  }
}
