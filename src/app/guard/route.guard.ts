import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CONSTANTS } from '../variable-constants';
import { DataService } from '../service/data.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {
  constructor(private dataservice: DataService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let canActivate = true;
    // console.log(next);
    // console.log(state);
    if (CONSTANTS.USER_DETAILS) {
      if (canActivate) {

      } else {
        // console.log("noooooooo");
      }
    } else {
      canActivate = false;
      // this.dataservice.setErrorCode(404);
      sessionStorage.removeItem('error-code');
      sessionStorage.setItem('error-code', JSON.stringify(404))
      this.router.navigate(['error']);
    }

    return canActivate;
  }
}
