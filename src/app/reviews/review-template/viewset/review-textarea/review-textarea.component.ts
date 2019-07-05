import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-review-textarea',
  templateUrl: './review-textarea.component.html',
  styles: []
})
export class ReviewTextareaComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() iIndex: number;
  @Input() sIndex: number;
  @Input() type: string;
  @Input() rIndex: number;
  @Input() vIndex: number;
  @Input() mode;
  @Input() level;
  @Input() submitted;
  _isSubmitted = false;
  @Input() _isDisabled = false;

  constructor(private dataservice: DataService) { }

  ngOnInit() {
    // this.dataservice._isSubmitted.subscribe(submitted => {
    //   this._isSubmitted = submitted;
    // });
    console.log(this.form);
    console.log(this.iIndex);
    console.log(this.sIndex);
    console.log(this.type);
    console.log(this.mode);
    console.log(this.level);
    
  }

  get textareaRequestOut() {
    return this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.textAreaRequest`)
  }

  get textareaRequestIn() {
    return this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests.${this.rIndex}.tableValueRequests.${this.vIndex}.textAreaRequest`);
  }
}
