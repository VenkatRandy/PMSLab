import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpErrorInterceptor } from './interceptor';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgxSpinnerModule } from "ngx-spinner";
import { HyphenPipe } from './pipe/hyphen.pipe';
import { SortByPipe } from './pipe/sort-by.pipe';
import { FilterPipe } from './pipe/filter.pipe';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { SidebarModule } from 'ng-sidebar';

import { TabsetComponent } from './tabset/tabset.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { TextboxComponent } from './template/multiparts/viewset/textbox/textbox.component';
import { TextareaComponent } from './template/multiparts/viewset/textarea/textarea.component';
import { DropdownComponent } from './template/multiparts/viewset/dropdown/dropdown.component';
import { TableComponent } from './template/multiparts/viewset/table/table.component';

import { TestComponent } from './test/test.component';
import { ViewSubcategoryComponent } from './template/multiparts/view-subcategory/view-subcategory.component';
import { NgxPaginationModule } from "ngx-pagination";
import { ViewmodeComponent } from './template/viewmode/viewmode.component';
import { EditmodeComponent } from './template/editmode/editmode.component';

import { ReviewHistoryComponent } from './review-history/review-history.component';
import { ViewHistoryComponent } from './review-history/view-history/view-history.component';
import { EmployeeReviewComponent } from './reviews/employee-review/employee-review.component';
import { ReviewComponent } from './initiation/review/review.component';
import { ProcessComponent } from './initiation/process/process.component';
import { ROUTES } from './app.routing';
import { RouterModule } from '@angular/router';
import { EditTemplateComponent } from './reviews/edit-template/edit-template.component';
import { MyReviewComponent } from './reviews/my-review/my-review.component';
import { ReviewTemplateComponent } from './reviews/review-template/review-template.component';
import { ErrorComponent } from './error/error.component';

import { ReviewTextComponent } from './reviews/review-template/viewset/review-text/review-text.component';
import { ReviewTextareaComponent } from './reviews/review-template/viewset/review-textarea/review-textarea.component';
import { ReviewTableComponent } from './reviews/review-template/viewset/review-table/review-table.component';
import { ReviewDropdownComponent } from './reviews/review-template/viewset/review-dropdown/review-dropdown.component';


import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { RatingComponent } from './rating/rating.component';
import { UserIdleModule } from 'angular-user-idle';
import { ReviewCommentsComponent } from './reviews/review-template/viewset/review-comments/review-comments.component';
import { ReleaseComponent } from './release/release.component';
import { TemplateModComponent } from './reviews/template-mod/template-mod.component';
import { AlertComponent } from './alert/alert.component';
import { TemplateViewComponent } from './template/template-view/template-view.component';
//import { AgGridModule } from 'ag-grid-angular';
// import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SmoothScrollModule } from 'ngx-scrollbar';
import { DatepickerComponent } from './template/multiparts/viewset/datepicker/datepicker.component';

import { ReviewDateComponent } from './reviews/review-template/viewset/review-date/review-date.component';

import { NgSelectModule } from '@ng-select/ng-select';


// NGX-Bootstrap
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { WorkflowComponent } from './workflow/workflow.component';
import { ReviewNumberComponent } from './reviews/review-template/viewset/review-number/review-number.component';
import { AccordianViewComponent } from './template/accordian-view/accordian-view.component';
import { ExtrinsicComponent } from './reviews/extrinsic/extrinsic.component';
import { ExtrinsicViewComponent } from './reviews/extrinsic/extrinsic-view/extrinsic-view.component';
import { ReviewLogsComponent } from './review-logs/review-logs.component';
import { ReviewRevokeComponent } from './review-revoke/review-revoke.component';
import { ReviewViewUpdateComponent } from './review-view-update/review-view-update.component';
import { ViewLogsComponent } from './review-logs/view-logs/view-logs.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { RedesignComponent } from './redesign/redesign.component';
// import { RatingModule } from 'ngx-bootstrap/rating';

import {MatStepperModule} from '@angular/material/stepper';

@NgModule({
  declarations: [
    AppComponent,
    HyphenPipe,
    SortByPipe,
    FilterPipe,
    LoginComponent,
    LogoutComponent,
    TabsetComponent,
    DashboardComponent,
    TextboxComponent,
    TextareaComponent,
    DropdownComponent,
    TableComponent,
    TestComponent,
    ViewSubcategoryComponent,
    ViewmodeComponent,
    EditmodeComponent,
    ReviewHistoryComponent,
    ViewHistoryComponent,
    EmployeeReviewComponent,
    ReviewComponent,
    ProcessComponent,
    EditTemplateComponent,
    MyReviewComponent,
    ReviewTemplateComponent,
    ErrorComponent,
    ReviewTextComponent,
    ReviewTextareaComponent,
    ReviewTableComponent,
    ReviewDropdownComponent,
    RatingComponent,
    ReviewCommentsComponent,
    ReleaseComponent,
    TemplateModComponent,
    AlertComponent,
    TemplateViewComponent,
    DatepickerComponent,
    ReviewDateComponent,
    WorkflowComponent,
    ReviewNumberComponent,
    AccordianViewComponent,
    ExtrinsicComponent,
    ExtrinsicViewComponent,
    ReviewLogsComponent,
    ReviewRevokeComponent,
    ReviewViewUpdateComponent,
    ViewLogsComponent,
    RedesignComponent,
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    NgxSpinnerModule,
    NgScrollbarModule,
    SmoothScrollModule,
    SidebarModule.forRoot(),
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgbRatingModule,
    NgxPaginationModule,
    NgSelectModule,
    UserIdleModule.forRoot({ idle: 1320, timeout: 5, ping: 120 }),
    RouterModule.forRoot(ROUTES, { onSameUrlNavigation: "reload", scrollPositionRestoration: 'enabled' }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    Title, DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
