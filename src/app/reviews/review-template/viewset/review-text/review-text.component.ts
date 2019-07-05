import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-review-text',
  templateUrl: './review-text.component.html',
  styles: ['']
})
export class ReviewTextComponent implements OnInit {
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

  // @Input() set disableControl( condition : boolean ) {
  //   const action = condition ? 'disable' : 'enable';
  //   this.ngControl.control[action]();
  // }

  constructor(private dataservice: DataService) { }

  ngOnInit() {
    // this.dataservice._isSubmitted.subscribe(submitted => {
    //   this._isSubmitted = submitted;
    // });

    // console.log(this.textRequestOutside);

    // console.log(this.level);
    // console.log(this.form);
    // console.log(this.iIndex);
    // console.log(this.sIndex);
    // console.log(this.type);

    // console.log(this._isDisabled);
    // if (this._isDisabled) {
    // this.form.disable();
    // }
    //  this.disabledControls() 
  }

  // disabledControls() {
  //   // console.log(this._isDisabled);
  //   if (this._isDisabled) {
  //     if (this.level=='Level 1') {
  //       this.textRequestOutside.get(`level1`).disable();
  //     } else {

  //     }
  //   }

  // }

  get textRequestOutside() {
    return this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.textRequest`)
  }

  get textRequestInside() {
    return this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests.${this.rIndex}.tableValueRequests.${this.vIndex}.textRequest`);
  }

}
