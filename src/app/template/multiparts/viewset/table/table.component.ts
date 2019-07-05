import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit {
  @Input() values;
  @Input() columns;
  @Input() indexI;
  @Input() indexT;

  @Input() iIndex: number;
  @Input() sIndex: number;
  @Input() form: FormGroup;

  @Input() mode;

  _insideTable = 'insideTable';
  _outsideTable = 'outsideTable';

  constructor(private fb: FormBuilder, private data: DataService) {
  }

  ngOnInit() {
  }

  // public trackByFnRows(index, rows) {
  //   if (!rows) {
  //     return null;
  //   }
  //   return rows.tid;
  // }

  // public trackByFnCols(index, values) {
  //   if (!values) {
  //     return null;
  //   }
  //   return values.t_id;
  // }

  get tableRequests() {
    return this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest`);
  }

  tableRows() {
    return <FormArray>this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests`).value;
  }

  tableColumns() {
    return <FormArray>this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableHeaderRequests`).value;
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
    if ((value.type.toLowerCase()) == 'dropdown') {
      let name = 'dropDownDefaultRequests';
      let content = this.injectDropdownDefaults(value.dropDownDefaultRequests);
      MY_GRP.addControl(name, content);
      MY_GRP.addControl('dropDownSelectedRequest', this.buildLevels());
    } else if ((value.type.toLowerCase()) == 'text') {
      let key = "textRequest";
      let value = this.buildLevels();;
      MY_GRP.addControl(key, value);
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
          content.setValidators(Validators.required);
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
    return this.fb.group({
      employee: new FormControl(null),
      level1: new FormControl(null),
      level2: new FormControl(null),
      level3: new FormControl(null),
    })
  }

  trackByHeaderFn(index, row) {
    return row.tableHeaderRequest;
  }

  trackByFnRows(index, rows) {
    return rows.tableValueListRequest;
  }

  trackByFnCols(index, values) {
    return values.tableValueRequest;
  }

}
