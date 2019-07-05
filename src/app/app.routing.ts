import { Routes } from '@angular/router';
import { LogoutComponent } from './logout/logout.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TestComponent } from './test/test.component';
import { EditmodeComponent } from './template/editmode/editmode.component';
import { ReviewHistoryComponent } from './review-history/review-history.component';
import { ViewmodeComponent } from './template/viewmode/viewmode.component';
import { ViewHistoryComponent } from './review-history/view-history/view-history.component';
import { EmployeeReviewComponent } from './reviews/employee-review/employee-review.component';
import { ProcessComponent } from './initiation/process/process.component';
import { ReviewComponent } from './initiation/review/review.component';
import { EditTemplateComponent } from './reviews/edit-template/edit-template.component';
import { MyReviewComponent } from './reviews/my-review/my-review.component';
import { ReviewTemplateComponent } from './reviews/review-template/review-template.component';
import { ErrorComponent } from './error/error.component';
import { ReleaseComponent } from './release/release.component';
import { RouteGuard } from './guard/route.guard';
import { AuthenticationGuard } from './guard/authentication.guard';
import { TemplateModComponent } from './reviews/template-mod/template-mod.component';
import { WorkflowComponent } from './workflow/workflow.component'
import { ExtrinsicComponent } from './reviews/extrinsic/extrinsic.component';
import { ReviewLogsComponent } from './review-logs/review-logs.component';
import { ViewLogsComponent } from './review-logs/view-logs/view-logs.component';
import { ReviewRevokeComponent } from './review-revoke/review-revoke.component';
import { ReviewViewUpdateComponent } from './review-view-update/review-view-update.component';
import { RedesignComponent } from './redesign/redesign.component';

export const ROUTES: Routes = [
  // {
  //   path: "",
  //   redirectTo: "login",
  //   pathMatch: "full"
  // },
  // {
  //   path: "",
  //   component: LoginComponent
  // },
  // {
  //   path: "login",
  //   component: LoginComponent
  // },

  // {
  //   path: "",
  //   redirectTo: "home",
  //   pathMatch: "full"
  // },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "login",
    // canActivate: [RouteGuard],
    component: LoginComponent
  },
  {
    path: "home",
    canActivate: [RouteGuard, AuthenticationGuard],
    component: DashboardComponent
  },
  {
    path: "ree",
    component: RedesignComponent
  },
  {
    path: "test",
    component: TestComponent
  }, {
    path: "initiation/process",
    canActivate: [RouteGuard, AuthenticationGuard],
    component: ProcessComponent
  }, {
    path: "initiation/review",
    canActivate: [RouteGuard, AuthenticationGuard],
    component: ReviewComponent
  },
  {
    path: "review/release",
    canActivate: [RouteGuard, AuthenticationGuard],
    component: ReleaseComponent,
  },
  {
    path: "edit/template",
    component: EditTemplateComponent
  },
  {
    path: "template/edit",
    component: TemplateModComponent
  },
  // {
  //   path: "view/template",
  //   component: ViewmodeComponent
  // },
  {
    path: "review-history",
    // canActivate: [RouteGuard, AuthenticationGuard],
    component: ReviewHistoryComponent
  },
  {
    path: "review-history/view",
    canActivate: [RouteGuard, AuthenticationGuard],
    component: ViewHistoryComponent
  },
  {
    path: "review/employee",
    canActivate: [RouteGuard, AuthenticationGuard],
    component: EmployeeReviewComponent
  },
  {
    path: "review/self",
    canActivate: [RouteGuard, AuthenticationGuard],
    component: MyReviewComponent
  },
  {
    path: "review",
    canActivate: [RouteGuard, AuthenticationGuard],
    component: ReviewTemplateComponent
  },
  {
    path: "compare",
    canActivate: [RouteGuard, AuthenticationGuard],
    component: ExtrinsicComponent
  },
  {
    path: "workflow",
    canActivate: [RouteGuard, AuthenticationGuard],
    component: WorkflowComponent
  },
  {
    path: "review-logs",
    canActivate: [RouteGuard, AuthenticationGuard],
    component: ReviewLogsComponent
  },
  {
    path: "review-logs/view",
    canActivate: [RouteGuard, AuthenticationGuard],
    component: ViewLogsComponent
  },

  {
    path: "revoke",
    canActivate: [RouteGuard, AuthenticationGuard],
    component: ReviewRevokeComponent
  },
  {
    path: "allreviews",
    canActivate: [RouteGuard, AuthenticationGuard],
    component: ReviewViewUpdateComponent
  },
  {
    path: "logout",
    component: LogoutComponent
  },
  {
    path: "error",
    component: ErrorComponent
  },
  {
    path: "**",
    redirectTo: "error",
  },
];
