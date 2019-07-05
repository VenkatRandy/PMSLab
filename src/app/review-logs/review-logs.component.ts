import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewLogsService } from '../service/review-logs.service';
import { ReviewService } from '../service/review.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FUNCTIONS, CONSTANTS } from '../variable-constants';

@Component({
  selector: 'app-review-logs',
  templateUrl: './review-logs.component.html',
  styles: []
})
export class ReviewLogsComponent implements OnInit {

  reviewId;
  reviewType;
  list = [];
  filteredList = [];
  hr: boolean = false;
  searchText;
  p = 1;
  isDesc: boolean;
  column: string;
  direction: number;

  constructor(private titleService: Title, private route: ActivatedRoute, private router: Router, private reviewLogsService: ReviewLogsService, private reviewService: ReviewService, private spinner: NgxSpinnerService) {
    this.titleService.setTitle('Review Logs');
  }

  ngOnInit() {
    var userDetails;
    var screenAcessList = [];
    userDetails = JSON.parse(sessionStorage.getItem('User Details'));
    screenAcessList = userDetails.screenAccessResponses;
    screenAcessList.forEach(element => {
      if (element.category == 'Review Initiation' && element.isAccessible == 'Y') {
        this.hr = true;
        this.spinner.show();
        this.reviewLogsService.getAllOpenReviews().subscribe(
          (data) => {
            this.list = data.data.performanceReviewResponses;
            this.getList();
            this.spinner.hide();
          }, error => {
            this.spinner.hide();
          }, () => {
            this.sortBy('reviewStartDate');
          }
        );
      }
    });

    if (!this.hr) {
      this.spinner.show();
      this.reviewService.findAllReviewProcessedRevieweesByReviewerUserId(userDetails.userId, CONSTANTS.REVIEW_STATUS_OPEN).subscribe(
        (data) => {
          this.list = data.data.performanceReviewResponses;
          this.getList();
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
        }, () => {
          this.sortBy('reviewStartDate');
        }
      );
    }
    this.route.queryParams.subscribe(params => {
      this.reviewId = params.review_id;
      this.reviewType = FUNCTIONS.REVIEWTYPE(this.reviewId);
      this.getList();
    });
  }

  getList() {
    this.filteredList = [];
    this.list.forEach(element => {
      if (element.reviewId == this.reviewId) {
        this.filteredList.push(element);
      }
    });
  }

  getLogs(reviewType, userId, reviewYear) {
    localStorage.setItem('reviewType', reviewType);
    localStorage.setItem('userId', userId);
    localStorage.setItem('reviewYear', reviewYear);
    localStorage.setItem('reviewId', this.reviewId);
    this.router.navigate(['review-logs/view']);
  }

  sortBy(property) {
    this.isDesc = !this.isDesc;
    this.column = property;
    this.direction = this.isDesc ? -1 : 1;
  }

}
