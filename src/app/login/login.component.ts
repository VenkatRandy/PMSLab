import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HrmsService } from '../service/hrms.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, zip, from, timer } from 'rxjs';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = "";
  password = "";
  login = false;
  userDetails: any;
  public errorResponse: any;
  valid: boolean = false;
  validator: boolean;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  submittedP = false;
  returnUrl: string;
  status;
  forgotForm: FormGroup;
  isSignIn: boolean = true;
  success: boolean = false;
  failure: boolean = false;
  invalidUsername: boolean;
  loadingP: boolean;
  checkMail: boolean;
  isIndia: boolean;
  locked: boolean;
  _isMobileView = false;
  obs = zip(
    from([3, 2, 1]),
    timer(0, 1000),
    (val, i) => val
  );
  dataSubscription: Subscription = new Subscription();
  loginSubscription: Subscription = new Subscription();
  obsSubscription: Subscription = new Subscription();

  constructor(
    private titleService: Title,
    private formBuilder: FormBuilder,
    private router: Router,
    private hrms: HrmsService,
    private data: DataService,
    private spinner: NgxSpinnerService) {
    this.titleService.setTitle("PMS");
  }

  ngOnInit() {
    this.dataSubscription = this.data._isMobileView.subscribe(data => {
      this._isMobileView = data;
    });
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });

    this.forgotForm = this.formBuilder.group({
      username: ["", Validators.required],
    });

    this.forgotForm.controls["username"].valueChanges.subscribe(values => {
      this.invalidUsername = false;
      if (this.forgotForm.controls['username'].value == '') {
        this.loading = true;
      }
      else {
        this.loading = false;
      }
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  get r() {
    return this.forgotForm.controls;
  }

  reset() {
    this.success = false;
    this.failure = false;
    this.submitted = false;
    this.loginForm.reset();
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  onSubmit(form) {
    let credentials = form.value;
    this.spinner.show();
    this.submitted = true;
    if (form.invalid || this.loginForm.controls['username'].value == '' || this.loginForm.controls['password'].value == '') {
      this.spinner.hide();
      return;
    }
    this.submitted = false;
    localStorage.setItem('Login', 'true');
    this.loading = true;
    this.loginUser(credentials);
  }

  loginUser(value) {
    this.loginSubscription = this.hrms.login(value).subscribe(
      data => {
        let response = data.body.data;
        if (response) {
          this.success = true;
          this.failure = false;
          sessionStorage.setItem("User Details", JSON.stringify(response));
          // sessionStorage.setItem('COLLAPSE', JSON.stringify(this.collapse));
          this.spinner.hide();
          this.obsSubscription = this.obs.subscribe(val => {
            if (val === 1) {
              this.navigateTo(response);
            }
          });
        } else {
          this.success = false;
          this.failure = true;
          this.loginForm.controls["username"].setErrors(null);
          this.loginForm.controls["password"].setErrors(null);
          this.loading = false;
          this.spinner.hide();
        }
      },
      error => {
        this.success = false;
        this.failure = true;
        this.loginForm.controls["username"].setErrors(null);
        this.loginForm.controls["password"].setErrors(null);
        this.loading = false;
        this.spinner.hide();
      }
    );
  }

  navigateTo(data) {
    if (data) {
      if (data.screenAccessResponses) {
        let screenAccess = data.screenAccessResponses;
        let flag = screenAccess.some((element, index) => {
          if ((element.category == 'Review History'
            && element.subCategoryLevel1 == 'Self'
            && element.subCategoryLevel2 == 'Confirmation')
            && element.isAccessible == 'Y') {
            this.router.navigate(['/review-history'], { queryParams: { self: 1, review_id: 1 } });
            return true;
          } else if ((element.category == 'Review History'
            && element.subCategoryLevel1 == 'Self'
            && element.subCategoryLevel2 == 'Mid Year')
            && element.isAccessible == 'Y') {
            this.router.navigate(['/review-history'], { queryParams: { self: 1, review_id: 2 } });
            return true;
          } else if ((element.category == 'Review History'
            && element.subCategoryLevel1 == 'Self'
            && element.subCategoryLevel2 == 'Annual')
            && element.isAccessible == 'Y') {
            this.router.navigate(['/review-history'], { queryParams: { self: 1, review_id: 3 } });
            return true;
          } else if ((element.category == 'Review History'
            && element.subCategoryLevel1 == 'Self'
            && element.subCategoryLevel2 == 'PIP')
            && element.isAccessible == 'Y') {
            this.router.navigate(['/review-history'], { queryParams: { self: 1, review_id: 4 } });
            return true;
          } else if ((element.category == 'Review History'
            && element.subCategoryLevel1 == 'Reviewees'
            && element.subCategoryLevel2 == 'Confirmation')
            && element.isAccessible == 'Y') {
            this.router.navigate(['/review-history'], { queryParams: { self: 0, review_id: 1 } });
            return true;
          } else if ((element.category == 'Review History'
            && element.subCategoryLevel1 == 'Reviewees'
            && element.subCategoryLevel2 == 'Mid Year')
            && element.isAccessible == 'Y') {
            this.router.navigate(['/review-history'], { queryParams: { self: 0, review_id: 2 } });
            return true;
          } else if ((element.category == 'Review History'
            && element.subCategoryLevel1 == 'Reviewees'
            && element.subCategoryLevel2 == 'Annual')
            && element.isAccessible == 'Y') {
            this.router.navigate(['/review-history'], { queryParams: { self: 0, review_id: 3 } });
            return true;
          } else if ((element.category == 'Review History'
            && element.subCategoryLevel1 == 'Reviewees'
            && element.subCategoryLevel2 == 'PIP')
            && element.isAccessible == 'Y') {
            this.router.navigate(['/review-history'], { queryParams: { self: 0, review_id: 4 } });
            return true;
          } else if (element.category == 'Review Initiation' && element.isAccessible == 'Y') {
            this.router.navigate(['initiation', 'review']);
            return true;
          } else if (element.category == 'My Review' && element.isAccessible == 'Y') {
            this.router.navigate(['review', 'self']);
            return true;
          } else if (element.category == 'Employee Review' && element.isAccessible == 'Y') {
            this.router.navigate(['review', 'employee']);
            return true;
          } else if (element.category == 'Review Release' && element.isAccessible == 'Y') {
            this.router.navigate(['review', 'release']);
            return true;
          } else if (element.category == 'User Worflow' && element.isAccessible == 'Y') {
            this.router.navigate(['workflow']);
            return true;
          } else if (element.category == 'Review Logs' && element.subCategoryLevel1 == 'Confirmation' && element.isAccessible == 'Y') {
            this.router.navigate(['/review-logs'], { queryParams: { review_id: 1 } });
            return true;
          }
          else if (element.category == 'Review Logs' && element.subCategoryLevel1 == 'Mid Year' && element.isAccessible == 'Y') {
            this.router.navigate(['/review-logs'], { queryParams: { review_id: 2 } });
            return true;
          }
          else if (element.category == 'Review Logs' && element.subCategoryLevel1 == 'Annual' && element.isAccessible == 'Y') {
            this.router.navigate(['/review-logs'], { queryParams: { review_id: 3 } });
            return true;
          }
          else if (element.category == 'Review Logs' && element.subCategoryLevel1 == 'PIP' && element.isAccessible == 'Y') {
            this.router.navigate(['/review-logs'], { queryParams: { review_id: 4 } });
            return true;
          }

          else if (element.category == 'Review Revoke' && element.subCategoryLevel1 == 'Confirmation' && element.isAccessible == 'Y') {
            this.router.navigate(['/revoke'], { queryParams: { review_id: 1 } });
            return true;
          }
          else if (element.category == 'Review Revoke' && element.subCategoryLevel1 == 'Mid Year' && element.isAccessible == 'Y') {
            this.router.navigate(['/revoke'], { queryParams: { review_id: 2 } });
            return true;
          }
          else if (element.category == 'Review Revoke' && element.subCategoryLevel1 == 'Annual' && element.isAccessible == 'Y') {
            this.router.navigate(['revoke'], { queryParams: { review_id: 3 } });
            return true;
          }
          else if (element.category == 'Review Revoke' && element.subCategoryLevel1 == 'PIP' && element.isAccessible == 'Y') {
            this.router.navigate(['revoke'], { queryParams: { review_id: 4 } });
            return true;
          }
          else if (element.category == 'All Review' && element.subCategoryLevel1 == 'Confirmation' && element.isAccessible == 'Y') {
            this.router.navigate(['/allreviews'], { queryParams: { review_id: 1 } });
            return true;
          }
          else if (element.category == 'All Review' && element.subCategoryLevel1 == 'Mid Year' && element.isAccessible == 'Y') {
            this.router.navigate(['/allreviews'], { queryParams: { review_id: 2 } });
            return true;
          }
          else if (element.category == 'All Review' && element.subCategoryLevel1 == 'Annual' && element.isAccessible == 'Y') {
            this.router.navigate(['/allreviews'], { queryParams: { review_id: 3 } });
            return true;
          }
          else if (element.category == 'All Review' && element.subCategoryLevel1 == 'PIP' && element.isAccessible == 'Y') {
            this.router.navigate(['/allreviews'], { queryParams: { review_id: 4 } });
            return true;
          }
        });

        if (flag) {

        } else {
          this.router.navigate(['review', 'self']);
        }
      } else {
        sessionStorage.removeItem('error-code');
        sessionStorage.setItem('error-code', JSON.stringify(403))
        this.router.navigate(['error']);
      }
    }
  }

  toggleScreen() {
    this.isSignIn = !this.isSignIn;
    this.loginForm.reset();
    this.forgotForm.reset();
    this.r.username.setErrors({ invalid: false });
    this.f.username.setErrors({ invalid: false });
    this.f.password.setErrors({ invalid: false });
    this.submitted = false;
    this.submittedP = false;
    this.valid = false;
    this.locked = false;
  }

  ngOnDestroy() {
    this.spinner.hide();
    this.dataSubscription.unsubscribe();
    this.obsSubscription.unsubscribe();
    this.loginSubscription.unsubscribe();
  }
}
