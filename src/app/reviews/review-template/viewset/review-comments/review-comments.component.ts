import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-review-comments',
  templateUrl: './review-comments.component.html',
  styles: []
})
export class ReviewCommentsComponent implements OnInit {
  @Input() level;
  @Input() submitted;
  @Input() disabled;
  _isSubmitted = false;
  comments;

  constructor(private dataservice: DataService) { }

  ngOnInit() {
    // this.dataservice._isSubmitted.subscribe(submitted => {
    //   this._isSubmitted = submitted;
    //   if (submitted) {
    //     // this.dataservice.setComment(this.comments);
    //   }
    // });
  }

}
