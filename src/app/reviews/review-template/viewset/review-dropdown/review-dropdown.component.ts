import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';
import { CONSTANTS } from 'src/app/variable-constants';

@Component({
  selector: 'app-review-dropdown',
  templateUrl: './review-dropdown.component.html',
  styles: []
})
export class ReviewDropdownComponent implements OnInit {
  @Input() values;
  @Input() form: FormGroup;
  @Input() iIndex: number;
  @Input() sIndex: number;
  @Input() type: string;
  @Input() tIndex: number;
  @Input() rIndex: number;
  @Input() vIndex: number;

  @Input() mode;
  @Input() level;
  @Input() submitted;
  _isSubmitted = false;
  @Input() _isDisabled = false;

  employeeComments;
  level1Comments;
  level2Comments;
  level3Comments;

  employeeCommentsIn;
  level1CommentsIn;
  level2CommentsIn;
  level3CommentsIn;

  constructor(private fb: FormBuilder, private dataservice: DataService) { }

  ngOnInit() {
    // this.dataservice._isSubmitted.subscribe(submitted => {
    //   this._isSubmitted = submitted;
    // });
    this.form.enable();
    if (this.type == 'outsideTable') {
      this.employeeComments = this.dropDownRequestOutside.value.employee;
      this.level1Comments = this.dropDownRequestOutside.value.level1;
      this.level2Comments = this.dropDownRequestOutside.value.level2;
      this.level3Comments = this.dropDownRequestOutside.value.level3;
    } else if (this.type == 'insideTable') {
      this.employeeCommentsIn = this.dropDownRequestInside.value.employee;
      this.level1CommentsIn = this.dropDownRequestInside.value.level1;
      this.level2CommentsIn = this.dropDownRequestInside.value.level2;
      this.level3CommentsIn = this.dropDownRequestInside.value.level3;
    }
  }

  get dropDownRequestOutside() {
    return this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.dropDownRequest.dropDownSelectedRequest`);
  }

  get dropDownRequestInside() {
    return this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests.${this.rIndex}.tableValueRequests.${this.vIndex}.dropDownSelectedRequest`);
  }

  public trackByFnOpts(index, rows) {
    if (!rows) {
      return null;
    }
    return rows.oId;
  }

  injectValueOutside(value) {
    if (this.level == CONSTANTS.EMPLOYEE) {
      this.employeeComments = value;
      this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.dropDownRequest.dropDownSelectedRequest.employee`).setValue(value);
    } else if (this.level == CONSTANTS.REVIEWER) {
      this.level1Comments = value;
      this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.dropDownRequest.dropDownSelectedRequest.level1`).setValue(value);
    } else if (this.level == CONSTANTS.APPRAISERI) {
      this.level2Comments = value;
      this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.dropDownRequest.dropDownSelectedRequest.level2`).setValue(value);
    } else if (this.level == CONSTANTS.APPRAISERII) {
      this.level3Comments = value;
      this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.dropDownRequest.dropDownSelectedRequest.level3`).setValue(value);
    }
  }

  injectValueInside(value) {
    if (this.level == CONSTANTS.EMPLOYEE) {
      this.employeeCommentsIn = value;
      this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests.${this.rIndex}.tableValueRequests.${this.vIndex}.dropDownSelectedRequest.employee`).setValue(value);
    } else if (this.level == CONSTANTS.REVIEWER) {
      this.level1CommentsIn = value;
      this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests.${this.rIndex}.tableValueRequests.${this.vIndex}.dropDownSelectedRequest.level1`).setValue(value);
    } else if (this.level == CONSTANTS.APPRAISERI) {
      this.level2CommentsIn = value;
      this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests.${this.rIndex}.tableValueRequests.${this.vIndex}.dropDownSelectedRequest.level2`).setValue(value);
    } else if (this.level == CONSTANTS.APPRAISERII) {
      this.level3CommentsIn = value;
      this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests.${this.rIndex}.tableValueRequests.${this.vIndex}.dropDownSelectedRequest.level3`).setValue(value);
    }
  }
}
