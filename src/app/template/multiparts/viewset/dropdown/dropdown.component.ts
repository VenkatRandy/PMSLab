import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { buildLevels } from 'src/app/variable-constants';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
})
export class DropdownComponent implements OnInit {
  @Input() values;
  // @Input() indexI;
  // @Input() indexS;

  @Input() form: FormGroup;
  @Input() iIndex: number;
  @Input() sIndex: number;
  @Input() type: string;
  @Input() tIndex: number;

  @Input() rIndex: number;
  @Input() vIndex: number;

  @Input() mode;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    // console.log(this.values);
    // console.log(this.indexI);
    // console.log(this.indexS);
  }

  // public trackByFnOpts(index, rows) {
  //   if (!rows) {
  //     return null;
  //   }
  //   return rows.oId;
  //   //return index;
  // }

  trackByFnOpts(index, opt) {
    return opt.dropDownDefaultRequest;
  }

  selectedValueInside() {
    // console.warn(this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests`));
    
    const control = <FormControl>this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.tableRequest.tableValueListRequests.${this.rIndex}.tableValueRequests.${this.vIndex}.dropDownSelectedRequest.level3`).value;
    return control;
  }

  selectedValueOutside() {
    let drop = this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.dropDownRequest.dropDownSelectedRequest`);
    if (drop != null) {
      const control = <FormControl>this.form.get(`categoryRequests.${this.iIndex}.subCategoryRequests.${this.sIndex}.dropDownRequest.dropDownSelectedRequest.level3`).value;
      return control;
    }
  }

}
