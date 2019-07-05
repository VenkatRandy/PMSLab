import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReviewService } from '../service/review.service';
import { ActivatedRoute } from '@angular/router';
import { FUNCTIONS, CONSTANTS } from '../variable-constants';
import { TemplateService } from '../service/template.service';

@Component({
  selector: 'app-review-revoke',
  templateUrl: './review-revoke.component.html',
  styles: []
})
export class ReviewRevokeComponent implements OnInit {

  reviewId;
  reviewType;
  list = [];
  checkedList = [];
  p: number = 1;
  isEveryThingChecked = false;
  isAtleastOnceSelected = false;
  status;
  statusMessage;
  searchText;

  constructor(private titleService: Title, private spinner: NgxSpinnerService, private reviewService: ReviewService, public templateService: TemplateService, private route: ActivatedRoute) {
    this.titleService.setTitle('Review Revoke')
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchText = '';
      this.reviewId = params.review_id;
      this.reviewType = FUNCTIONS.REVIEWTYPE(this.reviewId);
      this.spinner.show();
      this.reviewService.getByStatus(this.reviewType, CONSTANTS.REVIEW_STATUS_REVIEW_INITIATED).subscribe(
        (response) => {
          this.list = response.data.performanceReviewResponses;
          console.log(this.list);
          for (let i = 0; i < this.list.length; i++) {
            this.list[i]['isChecked'] = false;
          }
          this.spinner.hide();
        }, (error) => {
          this.list = [];
          this.spinner.hide();
        }
      );
    });
  }

  checkORUnCheckAll(event) {
    if (event.target.checked) {
      this.checkAllData();
      this.isEveryThingChecked = true;
      this.isAtleastOnceSelected = true;
    }
    else {
      for (let i = 0; i < this.list.length; i++) {
        this.list[i]['isChecked'] = false;
      }
      this.isEveryThingChecked = false;
      this.isAtleastOnceSelected = false;
      this.checkedList = [];
    }
  }

  checkAllData() {
    this.checkedList = [];
    for (let i = 0; i < this.list.length; i++) {
      this.list[i]['isChecked'] = true;
      this.checkedList.push(this.list[i]);
    }
  }

  findChecked(event, userId) {
    this.isEveryThingChecked = false;
    if (event.target.checked) {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].userId == userId) {
          this.list[i]['isChecked'] = true;
          this.checkedList.push(this.list[i]);
        }
      }
    }
    else {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].userId == userId) {
          this.list[i]['isChecked'] = false;
          for (let j = 0; j < this.checkedList.length; j++) {
            if (userId == this.checkedList[j].userId) {
              this.checkedList.splice(j, 1);
            }
          }
        }
      }
    }
    if (this.checkedList.length > 0) {
      this.isAtleastOnceSelected = true;
    } else {
      this.isAtleastOnceSelected = false;
    }
    if (this.list.length == this.checkedList.length) {
      this.isEveryThingChecked = true;
    }
  }

  submit() {
    var payload = {
      "saveAsDraft": false,
      'performanceReviewRequests': []
    }
    this.checkedList.forEach(element => {
      payload.performanceReviewRequests.push(element);
    });

    this.spinner.show();
    this.templateService.rejectRequest(payload).subscribe(data => {
      this.spinner.hide();
      this.status = CONSTANTS.SUCCESS;
      this.statusMessage = CONSTANTS.SUCCESS;
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }, error => {
      this.spinner.hide();
      this.status = CONSTANTS.FAILURE;
      this.statusMessage = CONSTANTS.FAILURE;
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    });
  }
}
