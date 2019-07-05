import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';
import { DatePipe } from '@angular/common';
import { FUNCTIONS, CONSTANTS } from 'src/app/variable-constants';

@Component({
  selector: 'app-review-date',
  templateUrl: './review-date.component.html',
  styles: []
})
export class ReviewDateComponent implements OnInit {
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

  employeeDate;
  level1Date: Date;
  level2Date;
  level3Date;
  employeeDateIn;
  level1DateIn;
  level2DateIn;
  level3DateIn;

  constructor(private dataservice: DataService, private date: DatePipe) { }

  ngOnInit() {
    // this.dataservice._isSubmitted.subscribe(submitted => {
    //   this._isSubmitted = submitted;
    // });
    this.form.enable();

    if (this.type == 'outsideTable') {
      let employeeDate = this.date.transform(this.dateRequestOutside.value.employee, 'dd-MM-yyyy');
      let level1Date = this.date.transform(this.dateRequestOutside.value.level1, 'dd-MM-yyyy');
      let level2Date = this.date.transform(this.dateRequestOutside.value.level2, 'dd-MM-yyyy');
      let level3Date = this.date.transform(this.dateRequestOutside.value.level3, 'dd-MM-yyyy');
      this.employeeDate = FUNCTIONS.parse(employeeDate)
      this.level1Date = FUNCTIONS.parse(level1Date)
      this.level2Date = FUNCTIONS.parse(level2Date)
      this.level3Date = FUNCTIONS.parse(level3Date)
    } else if (this.type == 'insideTable') {
      let employeeDateIn = this.date.transform(this.dateRequestInside.value.employee, 'dd-MM-yyyy');
      let level1DateIn = this.date.transform(this.dateRequestInside.value.level1, 'dd-MM-yyyy');
      let level2DateIn = this.date.transform(this.dateRequestInside.value.level2, 'dd-MM-yyyy');
      let level3DateIn = this.date.transform(this.dateRequestInside.value.level3, 'dd-MM-yyyy');
      this.employeeDateIn = FUNCTIONS.parse(employeeDateIn);
      this.level1DateIn = FUNCTIONS.parse(level1DateIn);
      this.level2DateIn = FUNCTIONS.parse(level2DateIn);
      this.level3DateIn = FUNCTIONS.parse(level3DateIn);
    }
  }

  get dateRequestOutside() {
    return this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.dateRequest`)
  }

  get dateRequestInside() {
    return this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests.${this.rIndex}.tableValueRequests.${this.vIndex}.dateRequest`);
  }

  valueChangedOutside(event) {
    let date = this.date.transform(event, 'yyyy-MM-dd')
    if (this.level == CONSTANTS.EMPLOYEE) {
      this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.dateRequest.employee`).setValue(date);
    } else if (this.level == CONSTANTS.REVIEWER) {
      this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.dateRequest.level1`).setValue(date);
    } else if (this.level == CONSTANTS.APPRAISERI) {
      this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.dateRequest.level2`).setValue(date);
    } else if (this.level == CONSTANTS.APPRAISERII) {
      this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.dateRequest.level3`).setValue(date);
    }
  }

  valueChangedInside(event) {
    let date = this.date.transform(event, 'yyyy-MM-dd')
    if (this.level == CONSTANTS.EMPLOYEE) {
      this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests.${this.rIndex}.tableValueRequests.${this.vIndex}.dateRequest.employee`).setValue(date);
    } else if (this.level == CONSTANTS.REVIEWER) {
      this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests.${this.rIndex}.tableValueRequests.${this.vIndex}.dateRequest.level1`).setValue(date);
    } else if (this.level == CONSTANTS.APPRAISERI) {
      this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests.${this.rIndex}.tableValueRequests.${this.vIndex}.dateRequest.level2`).setValue(date);
    } else if (this.level == CONSTANTS.APPRAISERII) {
      this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests.${this.rIndex}.tableValueRequests.${this.vIndex}.dateRequest.level3`).setValue(date);
    }
  }

}

