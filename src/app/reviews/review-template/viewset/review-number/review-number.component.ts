import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-review-number',
  templateUrl: './review-number.component.html',
  styles: []
})
export class ReviewNumberComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() iIndex: number;
  @Input() sIndex: number;
  @Input() type: string;
  @Input() rIndex: number;
  @Input() vIndex: number;
  @Input() mode;
  @Input() level;
  @Input() submitted;
  @Input() _isDisabled = false;
  _isSubmitted = false;

  constructor(private dataservice: DataService) { }

  ngOnInit() {
    // this.dataservice._isSubmitted.subscribe(submitted => {
    //   this._isSubmitted = submitted;
    // });
  }

  get textRequestOutside() {
    return this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.textRequest`)
  }

  get textRequestInside() {
    return this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests.${this.rIndex}.tableValueRequests.${this.vIndex}.textRequest`);
  }

}
