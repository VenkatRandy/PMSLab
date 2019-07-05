import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styles: [`
  .star {
    position: relative;
    display: inline-block;
    font-size: 2rem;
    color: #d3d3d3;
  }
  .full {
    color: #496f96;
  }
  .half {
    position: absolute;
    display: inline-block;
    overflow: hidden;
    color: #496f96;
  }
  `]
})
export class RatingComponent implements OnInit {
  @Input() rate;
  @Input() _isReadonly;
  @Input() type;
  currentRate = 0;
  level;

  constructor(private dataservice: DataService) { }

  ngOnInit() {
    if (this.rate) {
      if (this.rate >= 90) {
        this.level = 'Outstanding';
      } else if ((this.rate >= 80) && (this.rate <= 89)) {
        this.level = 'Exceed Expectations';
      } else if ((this.rate >= 60) && (this.rate <= 79)) {
        this.level = 'Meets Expectations';
      } else if (this.rate < 60) {
        this.level = 'Below Expectations';
      }
    }
  }

  rateChange(event) {

  }

}
