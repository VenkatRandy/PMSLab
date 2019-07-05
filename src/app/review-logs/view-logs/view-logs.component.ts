import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ReviewLogsService } from 'src/app/service/review-logs.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-logs',
  templateUrl: './view-logs.component.html',
  styles: []
})
export class ViewLogsComponent implements OnInit {


  reviewYear;
  userId;
  reviewType;
  reviewId;
  list = [];

  constructor(private titleService: Title, private router: Router, private reviewLogsService: ReviewLogsService, private spinner: NgxSpinnerService) {
    this.titleService.setTitle('View Logs');
  }

  ngOnInit() {
    this.reviewType = localStorage.getItem('reviewType');
    this.userId = localStorage.getItem('userId');
    this.reviewYear = localStorage.getItem('reviewYear');

    this.spinner.show();
    this.reviewLogsService.getLogs(this.reviewType, this.userId, this.reviewYear).subscribe(
      (response) => {

        this.list = response.data.auditTrailResponses;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
      }

    );
  }

  goBack() {
    this.reviewId = localStorage.getItem('reviewId')
    this.router.navigate(['review-logs'], { queryParams: { review_id: this.reviewId } })
  }


}
