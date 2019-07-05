import { Component, HostListener } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute, NavigationEnd, ActivationEnd } from '@angular/router';
import { DataService } from './service/data.service';
import { HrmsService } from './service/hrms.service';
import { UserIdleService } from 'angular-user-idle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  _isMobileView = false;
  html: string = `
<span class="btn bg-shade"><i class="fas fa-sign-out-alt"></i>Logout</span>`;
  _isIsolated = false;
  _isLoginPage = false;
  _isLogoutPage = false;
  _isErrorPage = false;
  _isShown = false;
  private _opened: boolean = true;
  private _modeNum: number = 1;
  private _positionNum: number = 0;
  private _dock: boolean = false;
  private _closeOnClickOutside: boolean = false;
  private _closeOnClickBackdrop: boolean = false;
  private _showBackdrop: boolean = false;
  private _animate: boolean = true;
  private _trapFocus: boolean = true;
  private _autoFocus: boolean = false;
  private _keyClose: boolean = false;
  private _autoCollapseHeight: number = 500;
  private _autoCollapseWidth: number = 500;

  private _MODES: Array<string> = ['over', 'push', 'slide'];
  private _POSITIONS: Array<string> = ['left', 'right', 'top', 'bottom'];

  _isClickedOnInitiation: boolean = false;
  _isClickedOnProcessInitiation: boolean = false;
  _isClickedOnInitiationHistory: boolean = false;
  _isClickedOnInitiationSelf: boolean = false;
  _isClickedOnInitiationReviewees: boolean = false;

  _isClickedOnEmployeeReview: boolean = false;
  _isClickedOnReleaseReview: boolean = false;
  _isClickedOnUserWorkFlow: boolean = false;

  screenArr: any = [''];
  //booleans
  _review: boolean;
  _reviewConfirmation: boolean = false;
  _reviewMidYear: boolean = false;
  _reviewAnnual: boolean = false;
  _reviewPIP: boolean;
  _reviewHistorySelf: boolean;
  _reviewEmployeeHistory: boolean;
  _reports: boolean;
  _initiate: boolean;
  _initiateConfirmation: boolean;
  _initiateMidYear: boolean;
  _initiateAnnual: boolean;
  _initiatePIP: boolean;
  _employeeReview: boolean;
  _processReview: boolean;
  _processReviewConfirmation: boolean;
  _processReviewMidyear: boolean;
  _processReviewAnnual: boolean;
  _processReviewPip: boolean;

  profileImage: string;
  fullName: string;
  tseries;

  // Scrollable
  disabled = false;
  compact = true;
  invertX = false;
  invertY = false;

  shown: "native";

  // Screen Accessible
  _isReviewHistorySelf = false;
  _isReviewHistoryReviewees = false;
  _isReviewInitiation = false;
  _isMyReview = false;
  _isEmployeeReview = false;
  _reviewRelease = false;
  _workflow = false;
  url: string;

  _isNothingToShow = true;

  // History
  _isReviewHistorySelf_Confirmation = false;
  _isReviewHistorySelf_MidYear = false;
  _isReviewHistorySelf_Annual = false;
  _isReviewHistorySelf_Pip = false;

  _isReviewHistoryReviewees_Confirmation = false;
  _isReviewHistoryReviewees_MidYear = false;
  _isReviewHistoryReviewees_Annual = false;
  _isReviewHistoryReviewees_Pip = false;

  // Review Initiation
  _isInitiationConfirmation = false;
  _isInitiationMidYear = false;
  _isInitiationAnnual = false;
  _isInitiationPip = false;
  // Employee Review
  _isEmployeeReviewConfirmation = false;
  _isEmployeeReviewMidYear = false;
  _isEmployeeReviewAnnual = false;
  _isEmployeeReviewPip = false;
  // Review Release
  _isReleaseConfirmation = false;
  _isReleaseMidYear = false;
  _isReleaseAnnual = false;
  _isReleasePip = false;

  isExtrinsic = false;

  _reviewLogs = false;
  _isReviewLogs_Confirmation = false;
  _isReviewLogs_MidYear = false;
  _isReviewLogs_Annual = false;
  _isReviewLogs_Pip = false;



  _reviewRevoke = false;
  _isReviewRevoke_Confirmation = false;
  _isReviewRevoke_MidYear = false;
  _isReviewRevoke_Annual = false;
  _isReviewRevoke_Pip = false;


  _reviewViewUpdate = false;
  _reviewViewUpdate_Confirmation = false;
  _reviewViewUpdate_MidYear = false;
  _reviewViewUpdate_Annual = false;
  _reviewViewUpdate_Pip = false;


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this._opened = false;
    if (window.innerWidth <= 500) {
      this._isMobileView = true;
      this._closeOnClickOutside = true;
    } else {
      this._opened = true;
      this._isMobileView = false;
      this._closeOnClickOutside = false;
    }
    this.data.setScreen(this._isMobileView);
  }

  constructor(public spinner: NgxSpinnerService,
    public router: Router,
    public route: ActivatedRoute,
    private hrms: HrmsService,
    private data: DataService,
    private userIdle: UserIdleService) {
    // if (typeof Worker !== 'undefined') {
    //   // Create a new
    //   const worker = new Worker('./app.worker', { type: 'module' });
    //   worker.onmessage = ({ data }) => {
    //     console.log('page got message: $\{data\}');
    //   };
    //   worker.postMessage('hello');
    // } else {
    //   // Web Workers are not supported in this environment.
    //   // You should add a fallback so that your program still executes correctly.
    // }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.scrollTop();
        // localStorage.removeItem('type');
        this.url = event.urlAfterRedirects;
        console.log("this.url is", this.url);
        localStorage.setItem("current_route", this.url);
        if (this.url.includes('compare')) {
          this.isExtrinsic = true;
        }
        if (
          this.url.includes("/login") ||
          this.url.includes("/logout") ||
          this.url.includes("/error")
        ) {
          this._isShown = false;
          this._isIsolated = true;
          if (this.url.includes("/login")) {
            this._isLoginPage = true;
            this._isErrorPage = false;
            this._isLogoutPage = false;
          } else if (this.url.includes("/logout")) {
            this._isErrorPage = false;
            this._isLogoutPage = true;
            this._isLoginPage = false;
          } else if (this.url.includes("/error")) {
            this._isErrorPage = true;
            this._isLogoutPage = false;
            this._isLoginPage = false;
          }
        } else {
          if (this.url.includes("/review-history?self=1")) {
            this._isClickedOnInitiationHistory = true;
            this._isClickedOnInitiationSelf = true;
          }
          if (this.url.includes("/review-history?self=0")) {
            this._isClickedOnInitiationHistory = true;
            this._isClickedOnInitiationReviewees = true;
          }
          if (
            !this.url.includes("/login") ||
            !this.url.includes("/logout") ||
            !this.url.includes("/error")) {
            this.userIdle.startWatching();
            this.userIdle.onTimerStart().subscribe(count => console.log(count));
            this.userIdle.onTimeout().subscribe(() =>
              this.logout('session'));
          }
          this._isShown = true;
          this._isIsolated = false;
          this.fetchHrms();
        }
      }
    });
  }

  ngOnInit() {
    this._opened = false;
    if (window.innerWidth <= 500) {
      this._isMobileView = true;
      this._closeOnClickOutside = true;
    } else {
      this._opened = true;
      this._isMobileView = false;
      this._closeOnClickOutside = false;
    }
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }

  // HRMS
  fetchHrms() {
    const userDetails = JSON.parse(sessionStorage.getItem('User Details'));
    if (userDetails) {
      this.profileImage = userDetails.profileImage;
      this.fullName = userDetails.firstName + " " + userDetails.lastName;
    }
    this.hrms.session().subscribe((data) => {
      sessionStorage.setItem('User Details', JSON.stringify(data.data));
      this.screenArr = data.data;
      if (this.screenArr != null) {
        for (let i = 0; i < this.screenArr.screenAccessResponses.length; i++) {
          if ((this.screenArr.screenAccessResponses[i].category == 'Review History'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'Self'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel2 == 'Confirmation')
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isReviewHistorySelf_Confirmation = true;
          } else if ((this.screenArr.screenAccessResponses[i].category == 'Review History'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'Self'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel2 == 'Mid Year')
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isReviewHistorySelf_MidYear = true;
          } else if ((this.screenArr.screenAccessResponses[i].category == 'Review History'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'Self'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel2 == 'Annual')
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isReviewHistorySelf_Annual = true;
          } else if ((this.screenArr.screenAccessResponses[i].category == 'Review History'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'Self'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel2 == 'PIP')
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isReviewHistorySelf_Pip = true;
          } else if ((this.screenArr.screenAccessResponses[i].category == 'Review History'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'Reviewees'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel2 == 'Confirmation')
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isReviewHistoryReviewees_Confirmation = true;
          } else if ((this.screenArr.screenAccessResponses[i].category == 'Review History'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'Reviewees'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel2 == 'Mid Year')
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isReviewHistoryReviewees_MidYear = true;
          } else if ((this.screenArr.screenAccessResponses[i].category == 'Review History'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'Reviewees'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel2 == 'Annual')
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isReviewHistoryReviewees_Annual = true;
          } else if ((this.screenArr.screenAccessResponses[i].category == 'Review History'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'Reviewees'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel2 == 'PIP')
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isReviewHistoryReviewees_Pip = true;
          } else if (this.screenArr.screenAccessResponses[i].category == 'Review Initiation'
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isReviewInitiation = true;
          } else if (this.screenArr.screenAccessResponses[i].category == 'My Review'
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isMyReview = true;
          } else if (this.screenArr.screenAccessResponses[i].category == 'Employee Review'
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isEmployeeReview = true;
          } else if (this.screenArr.screenAccessResponses[i].category == 'Review Release'
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._reviewRelease = true;
          } else if (this.screenArr.screenAccessResponses[i].category == 'User Workflow'
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._workflow = true;
          } else if (this.screenArr.screenAccessResponses[i].category == 'Review Logs'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'Confirmation'
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isReviewLogs_Confirmation = true;
          } else if (this.screenArr.screenAccessResponses[i].category == 'Review Logs'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'Mid Year'
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isReviewLogs_MidYear = true;
          } else if (this.screenArr.screenAccessResponses[i].category == 'Review Logs'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'Annual'
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isReviewLogs_Annual = true;
          } else if (this.screenArr.screenAccessResponses[i].category == 'Review Logs'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'PIP'
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isReviewLogs_Pip = true;
          } else if (this.screenArr.screenAccessResponses[i].category == 'Review Revoke'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'Confirmation'
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isReviewRevoke_Confirmation = true;
          } else if (this.screenArr.screenAccessResponses[i].category == 'Review Revoke'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'Mid Year'
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isReviewRevoke_MidYear = true;
          } else if (this.screenArr.screenAccessResponses[i].category == 'Review Revoke'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'Annual'
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isReviewRevoke_Annual = true;
          } else if (this.screenArr.screenAccessResponses[i].category == 'Review Revoke'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'PIP'
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._isReviewRevoke_Pip = true;
          } else if (this.screenArr.screenAccessResponses[i].category == 'All Review'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'Confirmation'
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._reviewViewUpdate_Confirmation = true;
          } else if (this.screenArr.screenAccessResponses[i].category == 'All Review'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'Mid Year'
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._reviewViewUpdate_MidYear = true;
          } else if (this.screenArr.screenAccessResponses[i].category == 'All Review'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'Annual'
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._reviewViewUpdate_Annual = true;
          } else if (this.screenArr.screenAccessResponses[i].category == 'All Review'
            && this.screenArr.screenAccessResponses[i].subCategoryLevel1 == 'PIP'
            && this.screenArr.screenAccessResponses[i].isAccessible == 'Y') {
            this._reviewViewUpdate_Pip = true;
          }
        }
      }
    }, error => {
      this.spinner.hide();
      this.router.navigate(['login']);
    })
  }

  toggleInitiation() {
    this._isClickedOnInitiation = !this._isClickedOnInitiation;
  }

  toggleProcessInitiation(event) {
    console.log(event);

    if ((event.toLowerCase()) == 'process initiation') {
      this._isClickedOnProcessInitiation = !this._isClickedOnProcessInitiation;
    }
  }

  tabExpandAndCollapse(event) {
    if (event.target.innerText == 'Review History') {
      this._isClickedOnInitiationHistory = !this._isClickedOnInitiationHistory;
      this._isClickedOnInitiationSelf = false;
      this._isClickedOnInitiationReviewees = false;
    }
    if (event.target.innerText == 'Self') {
      this._isClickedOnInitiationSelf = !this._isClickedOnInitiationSelf;
    }
    if (event.target.innerText == 'Reviewees') {
      this._isClickedOnInitiationReviewees = !this._isClickedOnInitiationReviewees;
    }
    if (event.target.innerText == 'Employee Review') {
      this._isClickedOnEmployeeReview = !this._isClickedOnEmployeeReview;
    }
    if (event.target.innerText == 'Review Release') {
      this._isClickedOnReleaseReview = !this._isClickedOnReleaseReview;
    }
    if (event.target.innerText == 'Review Initiation') {
      this._isClickedOnInitiation = !this._isClickedOnInitiation;
    }
    if (event.target.innerText == 'Review Logs') {
      this._reviewLogs = !this._reviewLogs
    }
    if (event.target.innerText == 'Review Revoke') {
      this._reviewRevoke = !this._reviewRevoke;
    }
    if (event.target.innerText == 'All Review') {
      this._reviewViewUpdate = !this._reviewViewUpdate;
    }
  }

  // toggleProcessInitiation() {
  //   this._isClickedOnProcessInitiation = !this._isClickedOnProcessInitiation;
  // }

  // Animations
  // public getRouterOutletState(outlet) {
  //   return outlet.isActivated ? outlet.activatedRoute : '';
  // }

  logout(value) {
    localStorage.clear();
    sessionStorage.clear();
    this._isIsolated = !this._isIsolated;
    this.hrms.logout().subscribe(data => { }, error => { });
    if (value == 'session') {
      this.router.navigate(['logout'], { queryParams: { type: 'session' } });
    } else if (value == 'logout') {
      this.router.navigate(['logout'], { queryParams: { type: 'logout' } });
    }
  }


  // Ng-Sidebar ++++++++++++++++++++++++++++++++++++++++++++++++++++++
  private _toggleOpened(): void {
    this._opened = !this._opened;
  }

  private _toggleMode(): void {
    this._modeNum++;

    if (this._modeNum === this._MODES.length) {
      this._modeNum = 0;
    }
  }

  private _toggleAutoCollapseHeight(): void {
    this._autoCollapseHeight = this._autoCollapseHeight ? null : 500;
  }

  private _toggleAutoCollapseWidth(): void {
    this._autoCollapseWidth = this._autoCollapseWidth ? null : 500;
  }

  private _togglePosition(): void {
    this._positionNum++;

    if (this._positionNum === this._POSITIONS.length) {
      this._positionNum = 0;
    }
  }

  private _toggleDock(): void {
    this._dock = !this._dock;
  }

  private _toggleCloseOnClickOutside(): void {
    this._closeOnClickOutside = !this._closeOnClickOutside;
  }

  private _toggleCloseOnClickBackdrop(): void {
    this._closeOnClickBackdrop = !this._closeOnClickBackdrop;
  }

  private _toggleShowBackdrop(): void {
    this._showBackdrop = !this._showBackdrop;
  }

  private _toggleAnimate(): void {
    this._animate = !this._animate;
  }

  private _toggleTrapFocus(): void {
    this._trapFocus = !this._trapFocus;
  }

  private _toggleAutoFocus(): void {
    this._autoFocus = !this._autoFocus;
  }

  private _toggleKeyClose(): void {
    this._keyClose = !this._keyClose;
  }

  private _onOpenStart(): void {
    //console.info('Sidebar opening');
  }

  private _onOpened(): void {
    //console.info('Sidebar opened');
  }

  private _onCloseStart(): void {
    //console.info('Sidebar closing');
  }

  private _onClosed(): void {
    //console.info('Sidebar closed');
  }

  private _onTransitionEnd(): void {
    //console.info('Transition ended');
  }

  private _onBackdropClicked(): void {
    //console.info('Backdrop clicked');
  }
}
