import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';
import { CONSTANTS, FUNCTIONS } from 'src/app/variable-constants';

@Component({
  selector: 'app-review-table',
  templateUrl: './review-table.component.html',
  styles: []
})
export class ReviewTableComponent implements OnInit {
  @Input() values;
  @Input() columns;
  @Input() indexI;
  @Input() indexT;

  @Input() iIndex: number;
  @Input() sIndex: number;
  @Input() form: FormGroup;
  @Input() submittedObj;

  @Input() mode;
  @Input() level;
  @Input() submitted;
  _isSubmitted = false;
  @Input() _isDisabled = false;
  @Input() weightageAgainstKRA;
  canModify = true;
  _insideTable = 'insideTable';
  _outsideTable = 'outsideTable';

  _isRemoveAvailable = false;

  constructor(private fb: FormBuilder, private dataservice: DataService) {
  }

  ngOnInit() {
    // this.dataservice._isSubmitted.subscribe(submitted => {
    //   this._isSubmitted = submitted;
    // });
    // this.vault = JSON.parse(JSON.stringify(this.form.value))
    // canModify
    // console.log( this.tableColumns());
    if (this.submittedObj) {
      if (((this.submittedObj.employee == null) && (this.submittedObj.level3 == null) && (this.submittedObj.level2 == null) && (this.submittedObj.level1 == null))) {
        this._isRemoveAvailable = true;
      }
    }
    if (this.tableColumns()) {
      let columns = this.tableColumns()
      for (let b = 0; b < columns.length; b++) {
        let value = columns[b].columnName.toLowerCase();
        if (value.includes('weightage')) {
          this.canModify = false;
        }
      }
    }

    if (this.weightageAgainstKRA) {
      this.canModify = false;
    }
  }

  public trackByFnRows(index, rows) {
    if (!rows) {
      return null;
    }
    return rows.tid;
  }

  public trackByFnCols(index, values) {
    if (!values) {
      return null;
    }
    return values.t_id;
  }

  get tableRequests() {
    return this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest`);
  }

  tableRows() {
    return <FormArray>this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests`).value;
  }

  tableValueRequests(rows) {
    if (this.weightageAgainstKRA) {
      let data = [];
      for (let v = 0; v < rows.tableValueRequests.length; v++) {
        let colName = rows.tableValueRequests[v].columnName;
        let columnName = FUNCTIONS.TRIM(colName);
        if (columnName == 'weightage') {

        } else {
          data.push(rows.tableValueRequests[v]);
        }
      }
      return data;
    } else {
      return rows.tableValueRequests;
    }
  }

  tableColumns() {
    if (this.weightageAgainstKRA) {
      let data = [];
      let tableHeader = this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableHeaderRequests`).value;
      for (let h = 0; h < tableHeader.length; h++) {
        let colName = tableHeader[h].columnName;
        let columnName = FUNCTIONS.TRIM(colName);
        if (columnName == 'weightage') {

        } else {
          data.push(tableHeader[h]);
        }
      }
      return data;
    } else {
      return <FormArray>this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableHeaderRequests`).value;
    }
  }

  addRow() {
    const rowcontrol = <FormArray>this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests`);
    var MY_GRP = new FormGroup({});
    var key = "tableValueRequests";
    var length = rowcontrol.value[0].tableValueRequests.length;
    var value = this.fb.array([])
    for (let index = 0; index < length; index++) {
      value.push(this.injectLevels(rowcontrol.value[0].tableValueRequests[index], index));
    }
    MY_GRP.addControl(key, value);
    var index = rowcontrol.value.length - 1;
    MY_GRP.addControl('tid', new FormControl((rowcontrol.value[index].tid) + 1));
    rowcontrol.push(MY_GRP);
  }

  injectLevels(value, index) {
    var MY_GRP = new FormGroup({});
    MY_GRP.addControl('t_id', new FormControl(index + 1));
    MY_GRP.addControl('type', new FormControl(value.type));
    MY_GRP.addControl('columnName', new FormControl(value.columnName));
    MY_GRP.addControl('description', new FormControl(value.description));
    if ((value.type.toLowerCase()) == 'dropdown') {
      let name = 'dropDownDefaultRequests';
      let content = this.injectDropdownDefaults(value.dropDownDefaultRequests);
      MY_GRP.addControl(name, content);
      MY_GRP.addControl('dropDownSelectedRequest', this.buildLevels());
    } else if ((value.type.toLowerCase()) == 'text') {
      let key = "textRequest";
      let value = this.buildLevels();;
      MY_GRP.addControl(key, value);
      MY_GRP.addControl('dropDownDefaultRequests', new FormArray([]));
    } else if ((value.type.toLowerCase()) == 'date') {
      let key = "dateRequest";
      let value = this.buildLevels();;
      MY_GRP.addControl(key, value);
      MY_GRP.addControl('dropDownDefaultRequests', new FormArray([]));
    }
    return MY_GRP;
  }

  injectDropdownDefaults(value) {
    var MY_ARR = new FormArray([]);
    for (let index = 0; index < value.length; index++) {
      var MY_GRP = new FormGroup({});
      for (let obj = 0; obj < Object.entries(value[index]).length; obj++) {
        var key = Object.entries(value[index])[obj][0];
        var content = this.fb.control(
          Object.entries(value[index])[obj][1]);
        if (key == 'value') {
          // content.setValidators(Validators.required);
        }
        MY_GRP.addControl(key, content);
      }
      MY_ARR.push(MY_GRP);
    }
    return MY_ARR;
  }

  removeRow(rIdx) {
    let rowcontrol = <FormArray>this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests`);
    rowcontrol.removeAt(rIdx);
  }

  buildLevels() {
    let MY_GRP = new FormGroup({});
    MY_GRP.controls['employee'] = new FormControl(null);
    MY_GRP.controls['level1'] = new FormControl(null);
    MY_GRP.controls['level2'] = new FormControl(null);
    MY_GRP.controls['level3'] = new FormControl(null);
    return MY_GRP;
    // let MY_GRP = new FormGroup({});
    // MY_GRP.controls['employee'] = this.level == CONSTANTS.EMPLOYEE ? new FormControl(null, Validators.required) : new FormControl(null);
    // MY_GRP.controls['level1'] = this.level == CONSTANTS.REVIEWER ? new FormControl(null, Validators.required) : new FormControl(null);
    // MY_GRP.controls['level2'] = this.level == CONSTANTS.APPRAISERI ? new FormControl(null, Validators.required) : new FormControl(null);
    // MY_GRP.controls['level3'] = this.level == CONSTANTS.APPRAISERII ? new FormControl(null, Validators.required) : new FormControl(null);
    // return MY_GRP;
  }

}
