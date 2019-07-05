import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-viewmode',
  templateUrl: './viewmode.component.html',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewmodeComponent implements OnInit {
  @Input() Payload;
  @Input() mode;
  @Input() reviewId;
  _isTemplateAvailable: boolean;
  form: FormGroup;
  createList: any = [];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) { }

  log(event: boolean) {
    this.dataService.setAccordian(event);
  }

  ngOnInit() {
    // console.warn(this.Payload);
    if (this.Payload != undefined || this.Payload != null) {
      this._isTemplateAvailable = true;
      this.initializeForm();
      this.patch();
      const formValue = this.form.getRawValue().categoryRequests;
      this.dataService.setCategoryList(formValue);
      this.addToAccordian(formValue);
    } else {
      this._isTemplateAvailable = false;
    }

    setTimeout(() => {
      console.log(this.form.getRawValue());
    }, 5000);
  }

  initializeForm() {
    this.form = this.fb.group({
      categoryRequests: this.fb.array([])
    });
  }

  patch() {
    // this.spinner.show();
    const control = <FormArray>this.form.get(`categoryRequests`);
    const catData = this.Payload.categoryResponses;
    // CategoryRequests Array
    for (let index = 0; index < catData.length; index++) {
      let MY_GRP = new FormGroup({});
      // Object Entries
      for (let obj = 0; obj < Object.entries(catData[index]).length; obj++) {
        var key = Object.entries(catData[index])[obj][0];
        var value = this.fb.control(
          Object.entries(catData[index])[obj][1]
        );
        if (key == 'name') {
          value.setValidators(Validators.required);
        }
        MY_GRP.addControl(key, value);
      }
      control.push(MY_GRP);
      let subData = catData[index].subCategoryResponses;
      this.patchSubCategory(index, subData);
    }
  }

  patchSubCategory(idx, data) {
    const control = <FormGroup>this.form.get(`categoryRequests.${idx}`);
    control.removeControl('subCategoryResponses');
    var key = 'subCategoryRequests';
    var value = this.fb.array([]);
    control.addControl(key, value);
    this.insideSubCategory(idx, data);
  }

  insideSubCategory(idx, data) {
    const control = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests`);
    // Subcategory
    for (let index = 0; index < data.length; index++) {
      var MY_GRP = new FormGroup({});
      //Inside Subcategory
      for (let sub = 0; sub < Object.entries(data[index]).length; sub++) {
        var key = Object.entries(data[index])[sub][0];
        var value = this.fb.control(
          Object.entries(data[index])[sub][1]);
        if (key == 'name' || key == 'description' || key == 'type') {
          value.setValidators(Validators.required);
        }
        MY_GRP.addControl(key, value);
      }
      control.push(MY_GRP);
      this.insideSubCategoryObject(idx, index, data[index])
    }
  }

  insideSubCategoryObject(idx, index, data) {
    const control = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}`);
    control.removeControl('tableResponse');
    control.removeControl('dropDownResponse');

    if (data.dropDownResponse != null) {
      // this._isDropDownShow[idx][index] = true;
      var key = 'dropDownRequest';
      var value = this.captureDropdown(data);
      control.addControl(key, value)
      this.insideDropDown(idx, index, data);
    } else {
      var key = 'dropDownRequest';
      var value = this.buildDrop();
      control.addControl(key, value)
    }

    if (data.tableResponse != null) {
      // this._isTableShow[idx][index] = true;
      var key = 'tableRequest';
      control.addControl(key, new FormGroup({
        "tableHeaderRequests": this.fb.array([]),
        "tableValueListRequests": this.fb.array([]),
      }));
      this.captureTable(idx, index, data);
    } else {
      var key = 'tableRequests';
      control.addControl(key, new FormArray([]))
    }
    this.addTwoRequests(control);
  }

  captureDropdown(data) {
    var MY_GRP = new FormGroup({});
    for (let drop = 0; drop < Object.entries(data.dropDownResponse).length; drop++) {
      var key = Object.entries(data.dropDownResponse)[drop][0];
      var value = this.fb.control(Object.entries(data.dropDownResponse)[drop][1]);
      MY_GRP.addControl(key, value);
    }
    return MY_GRP;
  }

  insideDropDown(idx, index, data) {
    const control = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.dropDownRequest`);
    control.removeControl('dropDownDefaultResponses');
    var key = 'dropDownDefaultRequests';
    var value = this.fb.array([]);
    control.addControl(key, value);
    this.captureDropdownDefault(idx, index, data);
    // this.captureDropdownSelected(idx, index, data)
    var key = 'dropDownSelectedRequest'
    var val = this.buildLevels();
    control.addControl(key, val);
  }

  captureDropdownDefault(idx, index, data) {
    const control = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.dropDownRequest.dropDownDefaultRequests`);
    if (data.dropDownResponse.dropDownDefaultResponses) {
      for (let index = 0; index < data.dropDownResponse.dropDownDefaultResponses.length; index++) {
        var MY_GRP = new FormGroup({});
        for (let obj = 0; obj < Object.entries(data.dropDownResponse.dropDownDefaultResponses[index]).length; obj++) {
          var key = Object.entries(data.dropDownResponse.dropDownDefaultResponses[index])[obj][0];
          var value = this.fb.control(
            Object.entries(data.dropDownResponse.dropDownDefaultResponses[index])[obj][1]);
          if (key == 'value') {
            value.setValidators(Validators.required);
          }
          MY_GRP.addControl(key, value);
        }
        control.push(MY_GRP);
      }
    }
  }

  captureTable(idx, index, data) {
    // Inject Header
    const control = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests`);
    for (let indexT = 0; indexT < data.tableResponse.tableHeaderResponses.length; indexT++) {
      var MY_GRP = new FormGroup({});
      for (let ins = 0; ins < Object.entries(data.tableResponse.tableHeaderResponses[indexT]).length; ins++) {
        var key = Object.entries(data.tableResponse.tableHeaderResponses[indexT])[ins][0];
        var value = this.fb.control(
          Object.entries(data.tableResponse.tableHeaderResponses[indexT])[ins][1]);
        MY_GRP.addControl(key, value);
      }
      control.push(MY_GRP);
    }

    // Inject Values
    const control2 = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests`);
    var GRP = new FormGroup({});
    var k = "tableValueRequests"
    var v = this.fb.array([]);
    GRP.addControl(k, v);
    control2.push(GRP);

    const control55 = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${0}.tableValueRequests`);

    for (let indexT = 0; indexT < data.tableResponse.tableHeaderResponses.length; indexT++) {
      var MY_GRP = new FormGroup({});
      for (let ins = 0; ins < Object.entries(data.tableResponse.tableHeaderResponses[indexT]).length; ins++) {
        var key = Object.entries(data.tableResponse.tableHeaderResponses[indexT])[ins][0];
        var value = this.fb.control(
          Object.entries(data.tableResponse.tableHeaderResponses[indexT])[ins][1]);
        MY_GRP.addControl(key, value);
      }
      var ke = 'dropDownSelectedRequest'
      var va = this.buildLevels();
      MY_GRP.addControl(ke, va);
      var ke = 'dropDownDefaultRequests'
      var val = this.fb.array([]);
      MY_GRP.addControl(ke, val);
      control55.push(MY_GRP);
    }
    this.insideTR(idx, index, data)
  }

  insideTR(idx, index, data) {
    for (let p = 0; p < data.tableResponse.tableHeaderResponses.length; p++) {
      let control = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${0}.tableValueRequests.${p}`);
      control.removeControl("textResponse");
      control.removeControl("textAreaResponse");
      control.removeControl("dateResponse");
      control.removeControl("dropDownSelectedResponse");
      // control.removeControl("dropDownDefaultResponses");
      // control.removeControl("dropDownRequest");
      if ((data.tableResponse.tableHeaderResponses[p].type.toLowerCase()) == 'text') {
        control.addControl('textRequest', this.buildLevels());
        control.addControl('textAreaRequest', new FormControl(null));
        control.addControl('dateRequest', new FormControl(null));
        control.addControl('dropDownDefaultRequests', new FormControl(null));
      } else if ((data.tableResponse.tableHeaderResponses[p].type.toLowerCase()) == 'textarea') {
        control.addControl('textRequest', new FormControl(null));
        control.addControl('textAreaRequest', this.buildLevels());
        control.addControl('dateRequest', new FormControl(null));
        control.addControl('dropDownDefaultRequests', new FormControl(null));
      } else if ((data.tableResponse.tableHeaderResponses[p].type.toLowerCase()) == 'date') {
        control.addControl('textRequest', new FormControl(null));
        control.addControl('textAreaRequest', new FormControl(null));
        control.addControl('dateRequest', this.buildLevels());
        control.addControl('dropDownDefaultRequests', new FormControl(null));
      } else if ((data.tableResponse.tableHeaderResponses[p].type.toLowerCase()) == 'dropdown') {
        control.addControl('textRequest', new FormControl(null));
        control.addControl('textAreaRequest', new FormControl(null));
        control.addControl('dateRequest', new FormControl(null));
        this.injectDropdownFromHeader(idx, index, 0, p);
      }
    }
  }

  injectDropdownFromHeader(idx, index, indexx, indexy) {
    const controls = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest`);
    if (controls != null) {
      let drop = this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${indexy}.dropDownDefaultResponses`);
      if (drop.value != null) {
        for (let t = 0; t < Object.entries(drop.value).length; t++) {
          var HDRDRP_GRP = new FormGroup({});
          for (let u = 0; u < Object.entries(drop.value[t]).length; u++) {
            let key = Object.entries(drop.value[t])[u][0];
            let value = this.fb.control(Object.entries(drop.value[t])[u][1]);
            HDRDRP_GRP.addControl(key, value);
          }
          const controlV = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${indexx}.tableValueRequests.${indexy}.dropDownDefaultRequests`);
          HDRDRP_GRP.addControl('oId', new FormControl(t + 1))
          controlV.push(HDRDRP_GRP);
        }
      }
    }
  }

  /* ++++++++++++ BUILD ++++++++++++++++ */
  buildDrop() {
    return this.fb.group({
      dropDownDefaultRequests: this.fb.array([]),
      dropDownSelectedRequest: this.buildLevels()
    })
  }

  buildLevels() {
    return this.fb.group({
      employee: new FormControl(null),
      level1: new FormControl(null),
      level2: new FormControl(null),
      level3: new FormControl(null),
    })
  }

  addTwoRequests(control) {
    if (true) {
      //Text Requests
      var key = 'textRequest';
      var value = this.buildLevels();
      control.addControl(key, value)

      // TextArea Requests
      var key = 'textAreaRequest';
      var value2 = this.buildLevels();
      control.addControl(key, value2)
    }
  }

  //First Time
  addToAccordian(control) {
    for (let index = 0; index < control.length; index++) {
      let categoryName = control[index].name;
      this.createList.push({
        title: categoryName,
        content: `Dynamic Group Body - ${this.createList.length + 1}`
      });
    }
  }
}
