import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { DataService } from 'src/app/service/data.service';
import { TemplateService } from 'src/app/service/template.service';
import { deepCopy, COMMENT } from 'src/app/variable-constants';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styles: ['']
})
export class EditTemplateComponent implements OnInit {
  form: FormGroup;
  showIndex: number;
  _isEditMode: boolean = false;
  templateData;
  modalRef: BsModalRef;
  childModalRef: BsModalRef;
  config = {
    keyboard: false,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  };
  childConfig = {
    keyboard: false,
    ignoreBackdropClick: true,
    backdrop: false,
    class: 'modal-sm'
  };

  _isDropDownShow = [];
  _isTableShow = [];
  _isTableDropDownShow = [];
  _isCollapsed = [];
  createList: any = [];

  i: number = undefined;
  z: number = undefined;
  t: number = undefined;
  tj: number = undefined;
  j: number = undefined;

  _isEditTemplate: boolean = false;
  reviewId;
  pgNo;
  submitted = false;
  viewList: any;
  userDetails;
  // curDate;
  backUp: FormGroup;
  keyboard: FormGroup;
  _isDisabled = true;
  status;
  userId;
  form2: FormGroup;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private data: DataService,
    private spinner: NgxSpinnerService,
    private router: ActivatedRoute,
    private route: Router,
    private datePipe: DatePipe,
    private template: TemplateService
  ) {
    this.router.queryParams.subscribe(params => {
      this.reviewId = params.reviewId;
      this.pgNo = params.pgno;
      this.userId = params.userId
    })
  }

  ngOnInit() {
    // this.curDate = new Date();
    this.userDetails = JSON.parse(sessionStorage.getItem('User Details'));
    this.templateData = JSON.parse(decodeURI(localStorage.getItem('Template Data')));
    this.initializeForm();
    this.begin();
    // this.form.disable();
  }


  back() {
    this.route.navigate(['initiation/process'], { queryParams: { pgno: this.pgNo, reviewId: this.reviewId } });
  }

  editMode() {
    this._isEditTemplate = !this._isEditTemplate;
  }

  cancelEdit() {
    this._isEditTemplate = !this._isEditTemplate;
    //this.getTabNumber(this.tabNumber);
  }


  initializeForm() {
    this.form = this.fb.group({
      categoryRequests: this.fb.array([]),
      "reviewId": parseInt(this.reviewId)
    });
  }

  begin() {
    this._isDropDownShow = [];
    this._isTableShow = [];
    this._isTableDropDownShow = [];
    this._isCollapsed = [];
    this.createList = [];
    this.initializeTable2DArray();
    this.initializeDropdown2DArray();
    this.initialize3DArray();
    this.initializeCollapse();
    this.patch();
  }

  async patch() {
    this.spinner.show();
    const control = <FormArray>this.form.get(`categoryRequests`);
    const catData = this.templateData[0].categoryResponses;
    for (let index = 0; index < catData.length; index++) {
      let MY_GRP = new FormGroup({});
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
      await this.patchSubCategory(index, subData);
    }
    this.addToAccordian(control.value);
    this.data.setCategoryList(control.value);
    this.spinner.hide();
  }

  async patchSubCategory(idx, data) {
    const control = <FormGroup>this.form.get(`categoryRequests.${idx}`);
    control.removeControl('subCategoryRequests');
    var key = 'subCategoryRequests';
    var value = this.fb.array([]);
    control.addControl(key, value);
    await this.insideSubCategory(idx, data);
  }

  async insideSubCategory(idx, data) {
    const control = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests`);
    for (let index = 0; index < data.length; index++) {
      var MY_GRP = new FormGroup({});
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
      await this.insideSubCategoryObject(idx, index, data[index])
    }
  }

  async insideSubCategoryObject(idx, index, data) {
    const control = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}`);
    control.removeControl('tableRequest');
    control.removeControl('dropDownRequest');
    control.removeControl('textRequest');
    control.removeControl('textAreaRequest');

    if (data.dropDownResponse != null) {
      this._isDropDownShow[idx][index] = true;
      var key = 'dropDownRequest';
      var value = this.captureDropdown(data);
      control.addControl(key, value)
      await this.insideDropDown(idx, index, data);
    } else {
      var key = 'dropDownRequest';
      var value = this.buildDrop();
      control.addControl(key, value)
    }

    if (data.tableResponse != null) {
      this._isTableShow[idx][index] = true;
      var key = 'tableRequest';
      control.addControl(key, new FormGroup({
        "tableHeaderRequests": this.fb.array([]),
        "tableValueListRequests": this.fb.array([]),
      }));
      await this.captureTable(idx, index, data);
    } else {
      var key = 'tableRequest';
      control.addControl(key, new FormGroup({
        "tableHeaderRequests": this.fb.array([]),
        "tableValueListRequests": this.fb.array([]),
      }))
    }

    if (data.textResponse != null) {
      var key = 'textRequest';
      var value = this.buildLevels();
      control.addControl(key, value)
      this.insideTextRequest(idx, index, data);
    } else {
      var key = 'textRequest';
      var value = this.buildLevels();
      control.addControl(key, value)
    }

    if (data.textAreaResponse != null) {
      var key = 'textAreaRequest';
      var value = this.buildLevels();
      control.addControl(key, value)
      this.insideTextAreaRequest(idx, index, data);
    } else {
      var key = 'textAreaRequest';
      var value = this.buildLevels();
      control.addControl(key, value)
    }
  }

  insideTextRequest(idx, index, data) {
    const control = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.textRequest`);
    control.controls.employee.setValue(data.textResponse.employee);
    control.controls.level1.setValue(data.textResponse.level1);
    control.controls.level2.setValue(data.textResponse.level2);
    control.controls.level3.setValue(data.textResponse.level3);
  }

  insideTextAreaRequest(idx, index, data) {
    const control = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.textAreaRequest`);
    control.controls.employee.setValue(data.textAreaResponse.employee);
    control.controls.level1.setValue(data.textAreaResponse.level1);
    control.controls.level2.setValue(data.textAreaResponse.level2);
    control.controls.level3.setValue(data.textAreaResponse.level3);
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
    control.removeControl('dropDownDefaultRequests');
    var key = 'dropDownDefaultRequests';
    var value = this.captureDropDownDefault(data.dropDownResponse.dropDownDefaultResponses)
    control.addControl(key, value);
    // this.captureDropdownDefault(idx, index, data);
    var key = 'dropDownSelectedRequest'
    var val = this.buildLevels();
    control.addControl(key, val);
    this.captureDropdownSelected(idx, index, data);
  }

  // captureDropdownDefault(idx, index, data) {
  //   const control = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.dropDownRequest.dropDownDefaultRequests`);
  //   for (let index = 0; index < data.dropDownResponse.dropDownDefaultResponses.length; index++) {
  //     var MY_GRP = new FormGroup({});
  //     for (let obj = 0; obj < Object.entries(data.dropDownResponse.dropDownDefaultResponses[index]).length; obj++) {
  //       //Inside Object
  //       var key = Object.entries(data.dropDownResponse.dropDownDefaultResponses[index])[obj][0];
  //       var value = this.fb.control(
  //         Object.entries(data.dropDownResponse.dropDownDefaultResponses[index])[obj][1]);
  //       if (key == 'value') {
  //         value.setValidators(Validators.required);
  //       }
  //       MY_GRP.addControl(key, value);
  //     }
  //     control.push(MY_GRP);
  //   }
  // }

  captureDropdownSelected(idx, index, data) {
    const control = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.dropDownRequest.dropDownSelectedRequest`);
    console.log(data.dropDownResponse.dropDownSelectedResponse);
    control.controls.employee.setValue(data.dropDownResponse.dropDownSelectedResponse.employee);
    control.controls.level1.setValue(data.dropDownResponse.dropDownSelectedResponse.level1);
    control.controls.level2.setValue(data.dropDownResponse.dropDownSelectedResponse.level2);
    control.controls.level3.setValue(data.dropDownResponse.dropDownSelectedResponse.level3);
  }

  async captureTable(idx, index, data) {
    await this.injectHeader(idx, index, data);
    await this.injectValueList(idx, index, data);
  }

  injectHeader(idx, index, data) {
    // Inject Header
    const control = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests`);
    console.log(data.tableResponse.tableHeaderResponses);

    for (let indexT = 0; indexT < data.tableResponse.tableHeaderResponses.length; indexT++) {
      var MY_GRP = new FormGroup({});
      for (let ins = 0; ins < Object.entries(data.tableResponse.tableHeaderResponses[indexT]).length; ins++) {
        var key = Object.entries(data.tableResponse.tableHeaderResponses[indexT])[ins][0];
        var value = this.fb.control(
          Object.entries(data.tableResponse.tableHeaderResponses[indexT])[ins][1]);
        if (key == 'description') {
          value.setValidators(Validators.required);
        }
        MY_GRP.addControl(key, value);
      }
      control.push(MY_GRP);
      let tableH = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${indexT}`);
      tableH.addControl('dropDownDefaultRequests', this.fb.array([]));
    }
  }

  async injectValueList(idx, index, data) {
    // Inject Values
    const control2 = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests`);
    if (data.tableResponse.tableValueListResponses) {
      for (let indexT = 0; indexT < data.tableResponse.tableValueListResponses.length; indexT++) {
        var MY_GRP = new FormGroup({});
        // MY_GRP.addControl('tid', new FormControl(indexT + 1));
        for (let ins = 0; ins < Object.entries(data.tableResponse.tableValueListResponses[indexT]).length; ins++) {
          var key = Object.entries(data.tableResponse.tableValueListResponses[indexT])[ins][0];
          var value = this.fb.control(
            Object.entries(data.tableResponse.tableValueListResponses[indexT])[ins][1]);
          MY_GRP.addControl(key, value);
        }
        control2.push(MY_GRP);
        await this.insideTableValueList(idx, index, indexT, data.tableResponse.tableValueListResponses[indexT]);
      }
      await this.replicateTypeValues(idx, index);
    }
  }

  async replicateTypeValues(idx, index) {
    const controls = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest`);
    if (controls != null) {
      const controlH = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests`);
      // ADD DROPDOWN DEFAULT
      for (let indexx = 0; indexx < controlH.value.length; indexx++) {
        const controlV = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${indexx}.tableValueRequests`);
        if (controlV != null) {
          for (let indexy = 0; indexy < controlV.value.length; indexy++) {
            const controlY = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${indexx}.tableValueRequests.${indexy}`);
            if (controlY != null) {
              let name = 'dropDownDefaultRequests'
              let content = this.fb.array([]);
              controlY.addControl(name, content);
              if ((controlY.value.type.toLowerCase()) != 'text') {
                await this.injectDropdownFromHeader(idx, index, indexx, indexy);
              }
            }
          }
        }
      }
    }
  }

  injectDropdownFromHeader(idx, index, indexx, indexy) {
    this._isTableDropDownShow[idx][index][indexy] = true;
    const controls = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest`);
    const tableH = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${indexy}`);
    tableH.addControl('dropDownDefaultRequests', this.fb.array([]));
    let tableD = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${indexy}.dropDownDefaultRequests`);
    if (controls != null) {
      let drop = this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${indexy}.dropDownDefaultResponses`);
      if (drop != null) {
        for (let t = 0; t < Object.entries(drop.value).length; t++) {
          var HDRDRP_GRP = new FormGroup({});
          for (let u = 0; u < Object.entries(drop.value[t]).length; u++) {
            let key = Object.entries(drop.value[t])[u][0];
            let value = this.fb.control(Object.entries(drop.value[t])[u][1]);
            HDRDRP_GRP.addControl(key, value);
          }
          const controlV = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${indexx}.tableValueRequests.${indexy}.dropDownDefaultRequests`);
          // HDRDRP_GRP.addControl('oId', new FormControl(t + 1))
          tableD.push(HDRDRP_GRP);
          controlV.push(HDRDRP_GRP);
        }
      }
    }
    tableH.removeControl('dropDownDefaultRequests');
  }

  insideTableValueList(idx, index, indexT, data) {
    const control = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${indexT}`);
    control.removeControl("tableValueResponses");
    var key = "tableValueRequests"
    var value = this.fb.array([]);
    control.addControl(key, value);

    for (let ind = 0; ind < data.tableValueResponses.length; ind++) {
      var MY_GRP = new FormGroup({});
      // MY_GRP.addControl('t_id', new FormControl(ind + 1));
      for (let i = 0; i < Object.entries(data.tableValueResponses[ind]).length; i++) {
        let key = Object.entries(data.tableValueResponses[ind])[i][0];
        let value = this.fb.control(
          Object.entries(data.tableValueResponses[ind])[i][1]);
        MY_GRP.addControl(key, value);
      }
      let valueList = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${indexT}.tableValueRequests`);
      valueList.push(MY_GRP)
      this.insideTableValueRequests(idx, index, indexT, data, ind, { ...MY_GRP });
    }
  }

  insideTableValueRequests(idx, index, indexT, data, ind, MY_GRP) {
    const control = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${indexT}.tableValueRequests.${ind}`);
    control.removeControl("textResponse");
    control.removeControl("dropDownSelectedResponse");
    for (let i = 0; i < Object.entries(MY_GRP.value).length; i++) {
      var LVL_GRP = new FormGroup({});
      let key = Object.entries(MY_GRP.value)[i][0];
      let val = Object.entries(MY_GRP.value)[i][1];
      if ((key.toLowerCase()) == "textresponse") {
        if (val != null) {
          for (let v = 0; v < Object.entries(val).length; v++) {
            let name = Object.entries(val)[v][0];
            let data = this.fb.control(Object.entries(val)[v][1]);
            LVL_GRP.addControl(name, data);
          }
          let key = "textRequest";
          let value = LVL_GRP;
          control.addControl(key, value);
        } else {
          let key = "textRequest";
          let value = this.buildLevels();;
          control.addControl(key, value);
        }
      } else if ((key.toLowerCase()) == "dropdownselectedresponse") {
        if (val != null) {
          for (let v = 0; v < Object.entries(val).length; v++) {
            let name = Object.entries(val)[v][0];
            let data = this.fb.control(Object.entries(val)[v][1]);
            LVL_GRP.addControl(name, data);
          }
          let key = "dropDownSelectedRequest";
          let value = LVL_GRP;
          control.addControl(key, value);
        } else {
          let key = "dropDownSelectedRequest";
          let value = this.buildLevels();;
          control.addControl(key, value);
        }
      }
    }

    // let tableV = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${indexT}.tableValueRequests.${ind}`);
    // tableV.addControl('dropDownDefaultRequests', this.fb.array([]));
  }

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

  createSubcategory(): FormGroup {
    return this.fb.group({
      "id": 0,
      "name": [null, Validators.required],
      "description": [null, Validators.required],
      "type": [null, Validators.required],
      "tableRequest": this.fb.group({
        "tableHeaderRequests": this.fb.array([]),
        "tableValueListRequests": this.createTableValueList()
      }),
      "dropDownRequest": this.fb.group({
        'dropDownDefaultRequests': this.fb.array([]),
        "dropDownSelectedRequest": this.buildLevels(),
      })
    });
  }

  createTableValueList() {
    var array = new FormArray([]);
    var group = new FormGroup({});
    var key = 'tableValueRequests';
    var value = this.fb.array([]);
    group.addControl(key, value);
    let control = <FormArray>group.controls.tableValueRequests;
    control.push(this.createTableValueRequests())
    array.push(group);
    return array;
  }

  createTableValueRequests() {
    return this.fb.group({
      "type": this.fb.control(null),
      "textRequest": this.buildLevels(),
      "dropDownSelectedRequest": this.buildLevels(),
      "dropDownDefaultRequests": this.fb.array([])
    })
  }


  // OnChange_____________________________________________________________________
  // DropdownChange
  dropDownChanged(value, i, section, z) {
    if (value == "dropdown") {
      this._isTableShow[z][i] = false;
      this._isDropDownShow[z][i] = true;
      // this.clearDropDown(i);
      this.clearSubcategory(i, value, -1, z)
      this.addDropDownValues(i, z);
    } else if (value == "text") {
      this._isTableShow[z][i] = false;
      this._isDropDownShow[z][i] = false;
      this.clearSubcategory(i, value, -1, z)
    } else if (value == "textarea") {
      this._isDropDownShow[z][i] = false;
      this._isTableShow[z][i] = false;
      this.clearSubcategory(i, value, -1, z)
    } else if (value == "table") {
      this._isTableShow[z][i] = true;
      this._isDropDownShow[z][i] = false;
      this.clearSubcategory(i, value, -1, z)
      this.addTableValues(i, z);
    }
  }
  // Table Dropdown Change
  tableDropDownChanged(value, i, t, z) {
    if (value == "dropdown") {
      this._isTableDropDownShow[z][i][t] = true;
      this.clearSubcategory(i, value, t, z)
      this.setTypeToTableValue(i, t, z, value);
      this.addTableDropDownDefault(i, t, z);
    } else if (value == "text") {
      this._isTableDropDownShow[z][i][t] = false;
      this.clearSubcategory(i, value, t, z);
      this.setTypeToTableValue(i, t, z, value);
      // this.addTxtToTableValueListRequests();
    }
  }
  // \.OnChange_____________________________________________________________________

  // CLEAR_SUBCATEGORY____________________________________________________________________________________
  clearSubcategory(i, type, t, z) {
    if (type == 'text') {
      this.clearDropDown(i, t, z);
      this.clearTable(i, t, z);
    } else if (type == 'textarea') {
      this.clearDropDown(i, t, z);
      this.clearTable(i, t, z);
    } else if (type == 'dropdown') {
      this.clearTable(i, t, z);
    } else if (type == 'table') {
      this.clearDropDown(i, t, z);
    }
  }

  clearDropDown(i, t, z) {
    if (t >= 0) {
      let control = this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableHeaderRequests`);
      if (control.value != null) {
        let control = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableHeaderRequests.${t}.dropDownDefaultRequests`);
        while (control.length !== 0) {
          control.removeAt(0);
        }
      }
    } else {
      let control = this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.dropDownRequest`)
      if (control != null) {
        let control = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.dropDownRequest.dropDownDefaultRequests`)
        while (control.length !== 0) {
          control.removeAt(0);
        }
      }
    }
  }

  clearTable(i, t, z) {
    if (t >= 0) {

    } else {
      let control = this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableHeaderRequests`)
      if (control != null) {
        let control = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableHeaderRequests`)
        if (control != null) {
          while (control.length !== 0) {
            control.removeAt(0);
          }
        }
      }
      //console.log(control);
    }
  }
  // \.CLEAR_SUBCATEGORY___________________________________________________________________________________

  // MISC_____________________________________________________________________________
  addDropDownValues(i, z) {
    let dropdown = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.dropDownRequest.dropDownDefaultRequests`)
    dropdown.push(this.dropdownDefaultValue(1))
  }

  dropdownDefaultValue(cond) {
    if (cond == 1) {
      return this.fb.group({
        id: new FormControl({ value: '0', disabled: false }),
        key: new FormControl({ value: '', disabled: false }),
        value: new FormControl({ value: '', disabled: false }, Validators.required),
      })
    } else {
      return this.fb.group({
        id: new FormControl({ value: '0', disabled: false }),
        key: new FormControl({ value: '', disabled: false }),
        value: new FormControl({ value: '', disabled: false }),
      })
    }

  }

  addTableValues(i, z) {
    let tableHeader = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableHeaderRequests`)
    if (tableHeader.value != null) {
      tableHeader.push(this.tableValues());
      // console.log(table);
    }

    // let tableValue = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableValueListRequests`)
    // console.log(tableValue);

    // let tableRequest = <FormGroup>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest`);
    // if (tableValue.value != null) {
    //   tableRequest.removeControl('tableValueListRequests')
    //   console.log("immmmmmmmmmmmmmm");

    //   tableRequest.addControl('tableValueListRequests', this.createTableValueList())
    //   // console.log(table);
    // }
  }

  tableValues() {
    return this.fb.group({
      'id': 0,
      'name': '',
      'columnName': [null, Validators.required],
      'description': [null, Validators.required],
      'type': [null, Validators.required],
      'dropDownDefaultRequests': this.fb.array([])
    });
  }

  addTableColumn(section) {
    let table = section.get(`tableRequest.tableHeaderRequests`);
    table.push(this.tableValues());
    this.addTableColumnV(section);
  }

  addTableColumnV(section) {
    let table = section.get(`tableRequest.tableValueListRequests.${0}.tableValueRequests`);
    table.push(this.tableValues());
  }

  removeTableColumn(i, t, z) {
    let control = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableHeaderRequests`)
    control.removeAt(t);
    this.removeTableColumnV(i, t, z);
  }

  removeTableColumnV(i, t, z) {
    let control = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableValueListRequests.${0}.tableValueRequests`)
    control.removeAt(t);
  }
  // \.MISC_____________________________________________________________________________

  // GET_______________________________________________________________________________
  getCategoryRequests(z) {
    let control = <FormArray>z.categoryRequests.controls;
    return control;
  }
  getSubcategory(form) {
    // console.log(form.controls.subCategoryRequests);
    return <FormArray>form.controls.subCategoryRequests.controls;
  }
  getDropdownDefault(form) {
    return form.controls.dropDownRequest.controls.dropDownDefaultRequests.controls;
  }
  getTable(form) {
    return form.controls.tableRequest.controls.tableHeaderRequests.controls;
  }
  getTableDropdown(form) {
    return <FormArray>form.controls.dropDownDefaultRequests.controls;
  }
  // \.GET_______________________________________________________________________________

  // Modal___________________________________________________________________________
  editModal(template: TemplateRef<any>, index) {
    this._isDisabled = false;
    this.backUp = undefined;
    this.backUp = deepCopy(<FormGroup>this.form.get(`categoryRequests.${index}`));
    this._isEditMode = true;
    this.showIndex = index;
    this.modalRef = this.modalService.show(template, this.config);
  }

  openChildModal(childTemplate: TemplateRef<any>, i, z, t, tj, j) {
    this.childModalRef = this.modalService.show(childTemplate, this.childConfig);
    this.i = i;
    this.z = z;
    this.t = t;
    this.j = j;
    this.tj = tj;
  }

  confirm(): void {
    // console.log(this.i, " ", this.z, " ", this.t, " ", this.tj, " ", this.j);
    if (this.i != undefined && this.z != undefined && this.t != undefined && this.tj != undefined) {
      // console.log("a");
      this.removeTableDropdownDefault(this.i, this.t, this.tj, this.z);
    } else if (this.i != undefined && this.z != undefined && this.t != undefined) {
      // console.log("b");
      this.removeTableColumn(this.i, this.t, this.z);
    } else if (this.i != undefined && this.z != undefined && this.j != undefined) {
      // console.log("c");
      this.removeDropdownDefault(this.i, this.j, this.z);
    } else if (this.i != undefined && this.z != undefined) {
      // console.log("d");
      this.removeSubcategory(this.i, this.z);
    }
    this.childModalRef.hide();
  }

  decline(): void {
    this.childModalRef.hide();
  }

  clear(z) {
    let control = <FormArray>this.form.get(`categoryRequests`);
    control.removeAt(z);
    control.insert(z, this.backUp);
    // this.form.disable();
    this._isDisabled = true;
    this.modalRef.hide();
  }
  // \.Modal___________________________________________________________________________

  // Dynamic_Forms_________________________________________________________________
  //Add Subcategory
  addSubcategory(z) {
    let control = this.form.get(`categoryRequests.${z}.subCategoryRequests`) as FormArray;
    control.push(this.createSubcategory());
  }
  //Remove Subcategory
  removeSubcategory(i, z) {
    let control = this.form.get(`categoryRequests.${z}.subCategoryRequests`) as FormArray;
    control.removeAt(i);
  }

  // Add Dropdown
  addDropDownDefault(i, j, z) {
    let control = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.dropDownRequest.dropDownDefaultRequests`)
    control.push(this.dropdownDefaultValue(1));
  }
  //Remove Dropdown
  removeDropdownDefault(i, j, z) {
    let control = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.dropDownRequest.dropDownDefaultRequests`)
    control.removeAt(j);
  }

  // // Add Text to TableValueRequests
  // addTxtToTableValueListRequests() {
  //   let control = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableValueListRequests.${0}.tableValueRequests.${t}.dropDownDefaultRequests`)
  //   control.push(this.dropdownDefaultValue(1));
  // }

  setTypeToTableValue(i, t, z, value) {
    let controlX = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableValueListRequests`);
    if (controlX != null) {
      let controlV = <FormControl>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableValueListRequests.${0}.tableValueRequests.${t}.type`)
      controlV.setValue(value);
    }
  }

  // Add Table Dropdown
  addTableDropDownDefault(i, t, z) {
    let control = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableHeaderRequests.${t}.dropDownDefaultRequests`)
    control.push(this.dropdownDefaultValue(1));
    // console.log(this.form.getRawValue())

    let controlX = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableValueListRequests`);
    if (controlX != null) {
      let controlV = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableValueListRequests.${0}.tableValueRequests.${t}.dropDownDefaultRequests`)
      controlV.push(this.dropdownDefaultValue(2));
    }
  }

  //Remove Table Dropdown
  removeTableDropdownDefault(i, t, tj, z) {
    let control = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableHeaderRequests.${t}.dropDownDefaultRequests`)
    control.removeAt(tj);

    let controlV = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableValueListRequests.${0}.tableValueRequests.${t}.dropDownDefaultRequests`)
    controlV.removeAt(tj);
  }
  // \.Dynamic_Forms_________________________________________________________________

  // DropdownSelected_________________________________________
  selectedValueInside(z, i, t) {
    const control = this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableHeaderRequests.${t}.type`).value;
    if (control != null) {
      return control.toLowerCase().replace(/\s*/g, '');
    } else {
      return control;
    }
  }

  selectedValueOutside(z, i) {
    const control = this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.type`).value;
    if (control != null) {
      return control.toLowerCase().replace(/\s*/g, '');
    } else {
      return control;
    }
  }
  // DropdownSelected_________________________________________












  // Phase One Point Seven
  captureDropDownDefault(data) {
    var MY_ARR = new FormArray([]);
    for (let z = 0; z < data.length; z++) {
      var MY_GRP = new FormGroup({});
      for (let x = 0; x < Object.entries(data[z]).length; x++) {
        let key = Object.entries(data[z])[x][0];
        let value = new FormControl(Object.entries(data[z])[x][1]);
        if (key == 'value') {
          value.setValidators(Validators.required);
        }
        MY_GRP.addControl(key, value);
      }
      MY_ARR.push(MY_GRP);
    }
    return MY_ARR;
  }

  captureDropDownSelected(data) {
    var MY_GRP = new FormGroup({});
    for (let x = 0; x < Object.entries(data).length; x++) {
      let key = Object.entries(data)[x][0];
      let value = new FormControl(Object.entries(data)[x][1]);
      MY_GRP.addControl(key, value);
    }
    return MY_GRP;
  }

  captureTable16(data) {
    this.captureTableHeader16(data);
    this.captureTableValue16(data);
  }

  captureTableHeader16(data) {
    var MY_ARR = new FormArray([]);
    for (let z = 0; z < data.length; z++) {


    }
  }

  captureTableValue16(data) {

  }
  // +++++++++++++++++++++TBC++++++++++++++++++++++++++++++++++++++++++

  reset() {
    // this.curDate = new Date();
    this.userDetails = JSON.parse(sessionStorage.getItem('User Details'));
    this.initializeForm();
    this.begin();
    // this.form.disable();
    this._isDisabled = true;
  }

  save(form, z) {
    this.submitted = true;
    // console.log(z);
    // if (this.form.dirty) {
    //   this.data.setFormDirty(true);
    // }

    let categoryRequests = form.get(`categoryRequests.${z}`).controls;
    if (form.get(`categoryRequests.${z}`).invalid) {
      console.log("lol");

      return;
    }
    //console.log(categoryRequests);

    for (let index = 0; index < categoryRequests.subCategoryRequests.length; index++) {
      //Set Null++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++Subcategory
      let type = form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].get('type').value;
      if (type.toLowerCase() == "text") {
        //Reset Dropdown
        let drop = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.dropDownRequest.dropDownDefaultRequests`);
        if (drop != null) {
          while (drop.length !== 0) {
            drop.removeAt(0);
          }
        }
        // Reset Table
        let table = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests`);
        if (table != null) {
          while (table.length !== 0) {
            table.removeAt(0);
          }
        }
      } else if (type.toLowerCase() == "textarea") {
        //Reset Dropdown
        let drop = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.dropDownRequest.dropDownDefaultRequests`);
        if (drop != null) {
          while (drop.length !== 0) {
            drop.removeAt(0);
          }
        }
        // Reset Table
        let table = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests`);
        if (table != null) {
          while (table.length !== 0) {
            table.removeAt(0);
          }
        }
      } else if (type.toLowerCase() == "dropdown") {
        // Reset Table
        let table = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests`);
        if (table != null) {
          while (table.length !== 0) {
            table.removeAt(0);
          }
        }
      } else if (type.toLowerCase() == "table") {
        //Reset Dropdown
        let drop = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.dropDownRequest.dropDownDefaultRequests`);
        if (drop != null) {
          while (drop.length !== 0) {
            drop.removeAt(0);
          }
        }

        // INSIDE_TABLE________________________________________________________________________________
        let table = form.getRawValue().categoryRequests[z].subCategoryRequests[index].tableRequest.tableHeaderRequests;
        for (let idx = 0; idx < table.length; idx++) {
          let type = form.getRawValue().categoryRequests[z].subCategoryRequests[index].tableRequest.tableHeaderRequests[idx].type;
          if (type == 'dropdown') {

          } else if (type == 'text') {
            //Reset Dropdown
            let drop = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}.dropDownDefaultRequests`);
            if (drop != null) {
              while (drop.length !== 0) {
                drop.removeAt(0);
              }
            }
          }
        }
      }
      // \.INSIDE_TABLE________________________________________________________________________________
      //++++++++++++++++++++++++++++++++++++++++++\. Subcategory
      //Set Null++++++++++++++++++++++
    }

    // console.log(form.getRawValue());
    this.submitted = false;
    // this.addGroupItem(form.getRawValue(), z);
    this.modalRef.hide();
    // this.data.setFormLength(1);
    this.viewList = form.getRawValue().categoryRequests;

    console.log(COMMENT);
    console.log(this.viewList);


    this.data.setCategoryList(this.viewList);
    // this.form.disable();
    this._isDisabled = true;
  }


  onSubmit() {
    this.spinner.show();
    console.log(this.form);
    this.submitted = true;
    this.setNull(this.form);
    // Type
    var type = '';
    if (this.reviewId == 1) {
      type = 'Confirmation';
    } else if (this.reviewId == 2) {
      type = 'MidYear';
    } else if (this.reviewId == 3) {
      type = 'Annual';
    } else if (this.reviewId == 4) {
      type = 'Performance Improvement Plan';
    }

    // var reviewData = {
    //   'data': {
    //     'reviewType': type,
    //     'pmsTemplateRequests': [
    //       {
    //         'roleType': null,
    //         'categoryRequests': this.form.value.categoryRequests
    //       }
    //     ]
    //   }
    // };

    // var payload = {
    //   "userId": this.userDetails.userId,
    //   "reviewId": parseInt(this.reviewId),
    //   "reviewYear": this.datePipe.transform(this.curDate, "yyyy-MM-dd"),
    //   "reviewData": encodeURIComponent(JSON.stringify(reviewData)),
    //   "status": "",
    //   "rating": 0
    // }

    var reviewData = {
      'reviewType': type,
      "reviewId": parseInt(this.reviewId),
      'templateRequests': [
        {
          "categoryRequests": this.form.value.categoryRequests
        }
      ]

    };

    // console.log(JSON.stringify({ 'data': reviewData }));

    // var payload = {
    //   'performanceReviewRequests': [{
    //     "userId": this.userId,
    //     "reviewId": parseInt(this.reviewId),
    //     "reviewYear": this.datePipe.transform(this.curDate, "yyyy-MM-dd"),
    //     "reviewData": encodeURIComponent(JSON.stringify({ 'data': reviewData })),
    //     "status": "",
    //     "rating": 0
    //   }]
    // }


    // console.log(comment);
    // console.log(JSON.stringify(payload));

    // this.template.editTemplate(payload).subscribe((data: any) => {
    //   this.spinner.hide();
    //   this.status = data.body.data.responseStatus;
    //   setTimeout(() => {
    //     this.route.navigate(['review/employee']);
    //   }, 2000);
    // }, error => {
    //   this.spinner.hide();
    //   this.status = error.error.data.responseStatus;
    //   this.submitted = false;
    //   // setTimeout(() => {
    //   //   window.location.reload();
    //   // }, 2000);
    // });
  }

  setNull(form) {
    let zip = form.get(`categoryRequests`).controls;
    for (let z = 0; z < zip.length; z++) {
      let categoryRequests = form.get(`categoryRequests.${z}`).controls;
      for (let index = 0; index < categoryRequests.subCategoryRequests.length; index++) {
        //++++++++++++++++++++++++++++++++++++++++++Subcategory
        let type = form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].get('type').value.toLowerCase().replace(/\s*/g, '');
        if (type == "text") {
          //Reset TextArea
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('textAreaRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('textAreaRequest', control);
          //Reset Dropdown
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('dropDownRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('dropDownRequest', control);
          //Reset Table
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('tableRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('tableRequest', control);
        } else if (type == "textarea") {
          //Reset Text
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('textRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('textRequest', control);
          //Reset Dropdown
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('dropDownRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('dropDownRequest', control);
          //Reset Table
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('tableRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('tableRequest', control);
        } else if (type == "dropdown") {
          //Reset Text
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('textRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('textRequest', control);
          //Reset TextArea
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('textAreaRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('textAreaRequest', control);
          //Reset Table
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('tableRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('tableRequest', control);


          // Remove DropdownResponse
          form.get(`categoryRequests.${z}.subCategoryRequests.${index}.dropDownRequest`).removeControl('dropDownSelectedResponse');
        } else if (type == "table") {
          //Reset Text
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('textRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('textRequest', control);
          //Reset TextArea
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('textAreaRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('textAreaRequest', control);
          //Reset Dropdown
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].removeControl('dropDownRequest');
          var control = this.fb.control(null);
          form.get(`categoryRequests.${z}.subCategoryRequests`).controls[index].addControl('dropDownRequest', control);

          // INSIDE_TABLE________________________________________________________________________________
          let table = form.getRawValue().categoryRequests[z].subCategoryRequests[index].tableRequest.tableHeaderRequests;
          for (let idx = 0; idx < table.length; idx++) {
            form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).removeControl('dropDownDefaultResponses');
            let type = form.getRawValue().categoryRequests[z].subCategoryRequests[index].tableRequest.tableHeaderRequests[idx].type.toLowerCase().replace(/\s*/g, '');
            if (type == 'dropdown') {
              //Reset Text
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).removeControl('textRequest');
              // var control = this.fb.control(null);
              // form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).addControl('textRequest', control);

              // Remove oID
              let oID = form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}.dropDownDefaultRequests`).value;
              for (let o = 0; o < oID.length; o++) {
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}.dropDownDefaultRequests.${o}`).removeControl('oId');
              }
              console.log(oID);

            } else if (type == 'text') {
              //Reset Dropdown
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).removeControl('dropDownDefaultRequests');
              var control = this.fb.control(null);
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${idx}`).addControl('dropDownDefaultRequests', control);
            }
          }

          // INSIDE_TABLE_VALUE_REQUESTS_______________________________________
          let tableV = form.getRawValue().categoryRequests[z].subCategoryRequests[index].tableRequest.tableValueListRequests;
          for (let idx = 0; idx < tableV.length; idx++) {

            // Remove oID
            form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}`).removeControl('tid');

            // form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}`).removeControl('dropDownDefaultResponses');
            for (let f = 0; f < tableV[idx].tableValueRequests.length; f++) {
              form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('t_id');
              let type = form.getRawValue().categoryRequests[z].subCategoryRequests[index].tableRequest.tableValueListRequests[idx].tableValueRequests[f].type.toLowerCase().replace(/\s*/g, '');
              if (type == 'dropdown') {
                //Reset Text
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('textRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('textRequest', control);
                //Remove DropdownDefault
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dropDownDefaultRequests');
              } else if (type == 'text') {
                //Reset DropdownDefault
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dropDownDefaultRequests');
                // var control = this.fb.control(null);
                // form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('dropDownDefaultRequests', control);
                //Reset DropdownSelected
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).removeControl('dropDownSelectedRequest');
                var control = this.fb.control(null);
                form.get(`categoryRequests.${z}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${idx}.tableValueRequests.${f}`).addControl('dropDownSelectedRequest', control);
              }
            }
          }
          // \.INSIDE_TABLE_VALUE_REQUESTS______________________________________
        }
        // \.INSIDE_TABLE________________________________________________________________________________

        //++++++++++++++++++++++++++++++++++++++++++\. Subcategory

        //Set Null++++++++++++++++++++++
      }
    }
    // console.warn(JSON.stringify(form.value));

    // var abc = { ...JSON.parse(JSON.stringify(form.value)) };
    // console.log(abc);
  }

  // Boolean Array Initialization++++++++++++++++++++++++++++++++++++++
  initializeCollapse() {
    this._isCollapsed = [];
    for (var x = 0; x < 100; x++) {
      this._isCollapsed[x] = [];
      for (var y = 0; y < 100; y++) {
        this._isCollapsed[x][y] = false;
      }
    }
  }

  initializeTable2DArray() {
    this._isTableShow = [];
    for (var x = 0; x < 100; x++) {
      this._isTableShow[x] = [];
      for (var y = 0; y < 100; y++) {
        this._isTableShow[x][y] = false;
      }
    }
  }

  initializeDropdown2DArray() {
    this._isDropDownShow = [];
    for (var x = 0; x < 100; x++) {
      this._isDropDownShow[x] = [];
      for (var y = 0; y < 100; y++) {
        this._isDropDownShow[x][y] = false;
      }
    }
  }

  initialize3DArray() {
    this._isTableDropDownShow = [];
    for (var x = 0; x < 100; x++) {
      this._isTableDropDownShow[x] = [];
      for (var y = 0; y < 100; y++) {
        this._isTableDropDownShow[x][y] = [];
        for (let z = 0; z < 100; z++) {
          this._isTableDropDownShow[x][y][z] = false;
        }
      }
    }
  }
  // \.Boolean Array Initialization++++++++++++++++++++++++++++++++++++++

}
