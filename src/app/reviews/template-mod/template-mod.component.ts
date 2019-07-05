import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { FormService } from 'src/app/service/form.service';
import { FormGroup, FormArray, Validators, FormBuilder, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataService } from 'src/app/service/data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TemplateService } from 'src/app/service/template.service';
import { deepCopy, CONSTANTS, FUNCTIONS } from 'src/app/variable-constants';
import { PopoverDirective } from 'ngx-bootstrap/popover/public_api';

@Component({
  selector: 'app-template-mod',
  templateUrl: './template-mod.component.html',
  styles: [`
  .quantity::-webkit-inner-spin-button, 
.quantity::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
  `]
})
export class TemplateModComponent implements OnInit, OnDestroy {
  Template;
  form: FormGroup;
  reviewId;
  roleType;
  pgNo;
  userId;
  // currentDate;
  _isDropDownShow = [];
  _isTableShow = [];
  _isTableDropDownShow = [];
  _isCollapsed = [];
  createList: any = [];
  modalRef: BsModalRef;
  _isDisabled = true;
  backUp: FormGroup;
  _isEditMode: boolean = false;
  showIndex: number;
  config = {
    keyboard: false,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  };
  submitted = false;
  viewList: any;
  weight: FormGroup;
  weightage = []
  // weightageForm: FormGroup;
  statusMessage;
  status;
  childModalRef: BsModalRef;
  childConfig = {
    keyboard: false,
    ignoreBackdropClick: true,
    backdrop: true,
    class: 'modal-sm'
  };

  weightageRef: BsModalRef | null;

  i: number = undefined;
  z: number = undefined;
  t: number = undefined;
  tj: number = undefined;
  j: number = undefined;

  _isWeightageRatingAvailable = false;
  _isWeightageCommentsAvailable = false;

  otherData;

  totalWeightage = 0;
  postData: any;

  constructor(
    private fb: FormBuilder,
    private formservice: FormService,
    private modalService: BsModalService,
    private data: DataService,
    private spinner: NgxSpinnerService,
    private router: ActivatedRoute,
    private route: Router,
    private datePipe: DatePipe,
    private template: TemplateService,
    private dataService: DataService
  ) {
    // this.router.queryParams.subscribe(params => {
    //   this.reviewId = params.reviewId;
    //   this.pgNo = params.pgno;
    //   this.userId = params.userId
    // })
  }

  log(event: boolean) {
    this.dataService.setAccordian(event);
  }

  get formValue() {
    return this.form.get(`categoryRequests`).value;
  }

  ngOnInit() {
    this.spinner.show();
    let temp = localStorage.getItem('Template');
    let other = localStorage.getItem('otherData');
    if (temp && other) {
      this.Template = JSON.parse(decodeURI(localStorage.getItem('Template')));
      this.otherData = JSON.parse(localStorage.getItem('otherData'));
      if (this.Template) {
        this.reviewId = this.Template.reviewId;
        this.roleType = this.Template.roleType;
        let categoryRequests = this.Template.categoryRequests;
        if (categoryRequests) {
          this.formservice.injectTableValue(categoryRequests);
          this.formservice.injectNull(categoryRequests);
          for (let v = 0; v < categoryRequests.length; v++) {
            categoryRequests[v].textRequest = this.formservice.buildLevel();
          }
          this.formservice.injectIndex(categoryRequests);
        }
      }
      this.form = this.formservice.createFormGroup(this.Template);
      if (this.form) {
        this.initializeDimensions();
        const control = <FormArray>this.form.get(`categoryRequests`);
        this.addToAccordian(control.value);
        this.data.setCategoryList(control.value);
        this.weightage = [];
        for (let index = 0; index < this.createList.length; index++) {
          let categoryName = this.createList[index].title;
          let grp = {
            id: index,
            value: null,
            rejected: false,
          }
          if (
            FUNCTIONS.TRIM(categoryName).includes('ratings') ||
            FUNCTIONS.TRIM(categoryName).includes('comments') ||
            FUNCTIONS.TRIM(categoryName).includes('recommendation') ||
            FUNCTIONS.TRIM(categoryName).includes('summary')
          ) {
            grp.rejected = true
          }
          this.weightage.push(grp)
        }
      }
    } else {
      this.form = this.fb.group({
        categoryRequests: new FormArray([])
      })
      this.spinner.hide();
    }
  }

  /**
  * validateWeightage
  *  */
  validateWeightage(idx) {
    if (this.weightage[idx].value) {
      // console.log(this.weightage[idx].value);

      this.totalWeightage = 0;
      if (this.weightage[idx].value >= 100) {
        let value = this.weightage[idx].value.toString().slice(0, -1);
        this.weightage[idx].value = value;
      }

      // for (let r = 0; r < this.weightage.length; r++) {
      //   if (!this.weightage[r].rejected) {
      //     if (this.weightage[r].value) {
      //       this.totalWeightage = this.totalWeightage + this.weightage[r].value;
      //       if (this.totalWeightage > 100) {
      //         console.log("hello");
      //         let value = this.weightage[idx].value.toString().slice(0, -1);
      //         if (value.length > 0) {
      //           this.weightage[idx].value = parseInt(value)
      //           console.log(this.weightage[idx].value, " True");
      //         } else {
      //           this.weightage[idx].value = null
      //           console.log(this.weightage[idx].value, " False");
      //         }
      //       }
      //     }
      //   }
      // }
      // console.log(this.totalWeightage);
    }
  }

  /**
   * Add Category To Accordian
   */
  addToAccordian(control) {
    for (let index = 0; index < control.length; index++) {
      let categoryName = control[index].name;
      let grp = {
        id: index,
        title: categoryName,
        rejected: false,
        content: `Dynamic Group Body - ${this.createList.length + 1}`
      }
      if (
        FUNCTIONS.TRIM(categoryName).includes('ratings') ||
        FUNCTIONS.TRIM(categoryName).includes('comments') ||
        FUNCTIONS.TRIM(categoryName).includes('recommendation') ||
        FUNCTIONS.TRIM(categoryName).includes('summary')
      ) {
        grp.rejected = true
      }
      this.createList.push(grp);
    }
  }

  trackByAcc(index, create) {
    return create.id;
  }

  // /**
  //  * Validates Weightage
  //  */
  // public weightage() {
  //   console.log("im called?");
  // }

  /**
 * Initializes 2D and 3D Arrays
 */
  initializeDimensions() {
    this._isDropDownShow = [];
    this._isTableShow = [];
    this._isTableDropDownShow = [];
    this._isCollapsed = [];
    this.createList = [];
    this.initializeTable2DArray();
    this.initializeDropdown2DArray();
    this.initialize3DArray();
    this.initializeCollapse();
    // this.patch();

    this.setDimensions();

    // this.setValidations();
    this.spinner.hide();
  }

  /**
* Sets Values for 2D and 3D Arrays
*/
  setDimensions() {
    let categoryRequests = this.Template.categoryRequests;
    if (categoryRequests) {
      this.formservice.setInitialValue(categoryRequests, this._isDropDownShow, this._isTableShow, this._isTableDropDownShow);
    }
  }

  /**
* Sets Form Validation
*/
  // setValidations() {
  //   let categoryRequests = <FormArray>this.form.get(`categoryRequests`).value;
  //   for (let index = 0; index < categoryRequests.length; index++) {
  //     let categoryName = <FormControl>this.form.get(`categoryRequests.${index}.name`)
  //     // categoryName.disable()
  //   }
  // }

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
    } else if (value == "date") {
      this._isTableShow[z][i] = false;
      this._isDropDownShow[z][i] = false;
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
    } else if (value == "textarea") {
      this._isTableDropDownShow[z][i][t] = false;
      this.clearSubcategory(i, value, t, z);
      this.setTypeToTableValue(i, t, z, value);
      // this.addTxtToTableValueListRequests();
    } else if (value == "date") {
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
    } else if (type == 'date') {
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
        if (control) {
          while (control.length !== 0) {
            control.removeAt(0);
          }
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

  // Modal___________________________________________________________________________
  editModal(template: TemplateRef<any>, index) {
    this.log(true);
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
    // this._isTableShow[z][i] = false;
    let control = this.form.get(`categoryRequests.${z}.subCategoryRequests`) as FormArray;
    control.removeAt(i);
    this.refreshArrays();
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
    this.refreshArrays();
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
      // console.log(controlV);

      controlV.setValue(value);
    }
  }

  // Add Table Dropdown
  addTableDropDownDefault(i, t, z) {
    let control = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableHeaderRequests.${t}.dropDownDefaultRequests`);
    control.push(this.dropdownDefaultValue(1));
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
    this.refreshArrays();
    let controlV = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableValueListRequests.${0}.tableValueRequests.${t}.dropDownDefaultRequests`)
    controlV.removeAt(tj);
  }

  createSubcategory(): FormGroup {
    return this.fb.group({
      "id": 0,
      "name": [null, Validators.required],
      "goal": null,
      "description": [null, Validators.required],
      "type": [null, Validators.required],
      "textRequest": this.buildLevels(),
      "textAreaRequest": this.buildLevels(),
      "dateRequest": this.buildLevels(),
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
      'textAreaRequest': this.buildLevels(),
      "dateRequest": this.buildLevels(),
      "dropDownSelectedRequest": this.buildLevels(),
      "dropDownDefaultRequests": this.fb.array([])
    })
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
  // \.Dynamic_Forms_________________________________________________________________

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
    }

    let tableValue = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableValueListRequests`)
    let tableRequest = <FormGroup>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest`);
    if (tableValue.value != null) {
      tableRequest.removeControl('tableValueListRequests')
      tableRequest.addControl('tableValueListRequests', this.createTableValueList())
      // console.log(table);
    }
  }

  tableValues() {
    return this.fb.group({
      'id': 0,
      'name': '',
      'columnName': [null, Validators.required],
      'description': [null, Validators.required],
      'type': [null, Validators.required],
      'dropDownDefaultRequests': this.fb.array([]),
      'dropDownSelectedRequest': this.buildLevels(),
      'dateRequest': this.buildLevels(),
      'textRequest': this.buildLevels(),
      'textAreaRequest': this.buildLevels()
    });
  }

  tableValuesNoValidators() {
    return this.fb.group({
      'id': 0,
      'name': '',
      'columnName': null,
      'description': null,
      'type': null,
      'dropDownDefaultRequests': this.fb.array([]),
      'dropDownSelectedRequest': this.buildLevels(),
      'dateRequest': this.buildLevels(),
      'textRequest': this.buildLevels(),
      'textAreaRequest': this.buildLevels()
    });
  }

  addTableColumn(section) {
    let table = section.get(`tableRequest.tableHeaderRequests`);
    table.push(this.tableValues());
    this.addTableColumnV(section);
  }

  addTableColumnV(section) {
    let table = section.get(`tableRequest.tableValueListRequests.${0}.tableValueRequests`);
    table.push(this.tableValuesNoValidators());
  }

  removeTableColumn(i, t, z) {
    let control = <FormArray>this.form.get(`categoryRequests.${z}.subCategoryRequests.${i}.tableRequest.tableHeaderRequests`)
    control.removeAt(t);
    this.refreshArrays();
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

  isSelected(z) {
    let weightageAgainstKRA = this.form.get(`categoryRequests.${z}.weightageAgainstKRA`).value;
    return weightageAgainstKRA;
  }
  // \.GET_______________________________________________________________________________

  // TrackBy_______________________________________________________
  trackByCategoryFn(index) {

  }
  // \.TrackBy______________________________________________________

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

  refreshArrays() {
    this._isDropDownShow = [];
    this._isTableShow = [];
    this._isTableDropDownShow = [];
    this.initializeTable2DArray();
    this.initializeDropdown2DArray();
    this.initialize3DArray();
    this.initializeCollapse();
    this.scanForm();
  }

  scanForm() {
    let categoryRequests = this.form.get(`categoryRequests`).value;
    if (categoryRequests) {
      for (let z = 0; z < categoryRequests.length; z++) {
        let subCategoryRequests = categoryRequests[z].subCategoryRequests;
        if (subCategoryRequests) {
          for (let x = 0; x < subCategoryRequests.length; x++) {
            let type = subCategoryRequests[x].type.toLowerCase().replace(/\s*/g, '');
            if (type) {
              if (type == 'text') {

              } else if (type == 'textarea') {

              } else if (type == 'date') {

              } else if (type == 'dropdown') {
                this._isDropDownShow[z][x] = true;
              } else if (type == 'table') {
                this._isTableShow[z][x] = true;
                let tableRequest = subCategoryRequests[x].tableRequest;
                if (tableRequest) {
                  let tableHeaderRequests = tableRequest.tableHeaderRequests;
                  for (let c = 0; c < tableHeaderRequests.length; c++) {
                    let type = tableHeaderRequests[c].type.toLowerCase().replace(/\s*/g, '');
                    if (type == 'text') {

                    } else if (type == 'date') {

                    } else if (type == 'dropdown') {
                      this._isTableDropDownShow[z][x][c] = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }


  back() {
    this.route.navigate(['review', 'employee']);
  }

  reset() {
    this.ngOnInit();
  }

  save(form, z) {
    this.submitted = true;
    let categoryRequests = form.get(`categoryRequests.${z}`).controls;
    if (form.get(`categoryRequests.${z}`).invalid) {
      return;
    }
    this.formservice.resetType(form, z);

    // console.log(form.getRawValue());
    this.submitted = false;
    // this.addGroupItem(form.getRawValue(), z);
    this.modalRef.hide();
    // this.data.setFormLength(1);
    this.viewList = form.getRawValue().categoryRequests;

    // console.log(CONSTANTS.COMMENT);
    // console.log(this.viewList);


    this.data.setCategoryList(this.viewList);
    // this.form.disable();
    this._isDisabled = true;
  }

  async onSubmit(weightage: TemplateRef<any>) {
    // console.log(this.form);
    // console.log(this.Template);
    this.form.enable();
    if (this.form.invalid) {
      return;
    }
    let totalWeight = 0;
    let count = 0;
    let isBad = false;
    for (let idx = 0; idx < this.weightage.length; idx++) {
      if (!this.weightage[idx].rejected) {
        if (this.weightage[idx].value) {
          if (this.weightage[idx].value == 0) {
            isBad = true;
          }
          totalWeight = totalWeight + this.weightage[idx].value;
        } else {
          count++;
        }
      }
    }

    if (count != 0 || totalWeight < 100 || totalWeight > 100 || totalWeight == 0 || isBad) {
      this.weightageRef = this.modalService.show(weightage, { class: 'modal-md', ignoreBackdropClick: true, backdrop: true })
      return;
    } else {
      // console.log("im gud");
      // return
    }

    this.submitted = true;


    this.spinner.show();
    // Type
    var type = '';
    if (this.reviewId == 1) {
      type = CONSTANTS.REVIEW_TYPE_CONFIRMATION
    } else if (this.reviewId == 2) {
      type = CONSTANTS.REVIEW_TYPE_MIDYEAR
    } else if (this.reviewId == 3) {
      type = CONSTANTS.REVIEW_TYPE_ANNUAL
    } else if (this.reviewId == 4) {
      type = CONSTANTS.REVIEW_TYPE_PIP
    }

    this.postData = this.form.getRawValue();
    await this.setNull(this.postData);
    await this.setWeightage(this.postData);
    let templateRequests = [];
    templateRequests.push(this.postData)


    // console.warn(this.postData);

    var reviewData = {
      'reviewType': type,
      'templateRequests': templateRequests
    };

    var payload = {
      "saveAsDraft": false,
      'performanceReviewRequests': [{
        "id": this.otherData.id,
        "userId": this.otherData.userId,
        "reviewId": parseInt(this.reviewId),
        'reviewType': type,
        "reviewStartDate": this.otherData.reviewStartDate,
        "reviewEndDate": this.otherData.reviewEndDate,
        "reviewData": encodeURIComponent(JSON.stringify({ 'data': reviewData })),
        "status": this.otherData.status,
        "rating": null
      }]
    }

    // console.log(CONSTANTS.COMMENT);
    // console.log(JSON.stringify(payload));



    this.template.editTemplate(payload).subscribe((data: any) => {
      this.spinner.hide();
      this.statusMessage = CONSTANTS.REVIEW_PROCESSES_SUCCESS;
      this.status = CONSTANTS.SUCCESS
      setTimeout(() => {
        this.route.navigate(['review', 'employee']);
      }, 2000);
    }, error => {
      this.statusMessage = CONSTANTS.FAILURE;
      this.status = CONSTANTS.FAILURE
      this.spinner.hide();
      this.submitted = false;
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  /**
   * setWeightage
   */
  public setWeightage(form) {
    if (form) {
      let categoryRequests = form.categoryRequests;
      if (categoryRequests) {
        for (let r = 0; r < categoryRequests.length; r++) {
          categoryRequests[r].weightage = this.weightage[r].value;
        }
      }
    }
  }

  /**
   * setNull
   */
  public setNull(form) {
    if (form) {
      let categoryRequests = form.categoryRequests;
      if (categoryRequests) {
        let categoryRequests = form.categoryRequests;
        for (let q = 0; q < categoryRequests.length; q++) {
          delete categoryRequests[q].categoryRequest;
          if (categoryRequests[q].weightageAgainstKRA) {
            categoryRequests[q].textRequest = this.formservice.buildLevel();
          } else {
            categoryRequests[q].textRequest = null;
          }
          // delete categoryRequests[q].weightage;
          let subCategoryRequests = categoryRequests[q].subCategoryRequests;
          if (subCategoryRequests) {
            for (let w = 0; w < subCategoryRequests.length; w++) {
              delete subCategoryRequests[w].subCategoryRequest;
              let type = subCategoryRequests[w].type.toLowerCase().replace(/\s*/g, '');
              if (type == 'text') {
                subCategoryRequests[w].textAreaRequest = null;
                subCategoryRequests[w].dateRequest = null;
                subCategoryRequests[w].dropDownRequest = null;
                subCategoryRequests[w].tableRequest = null;
              } else if (type == 'textarea') {
                subCategoryRequests[w].textRequest = null;
                subCategoryRequests[w].dateRequest = null;
                subCategoryRequests[w].dropDownRequest = null;
                subCategoryRequests[w].tableRequest = null;
              } else if (type == 'date') {
                subCategoryRequests[w].textRequest = null;
                subCategoryRequests[w].textAreaRequest = null;
                subCategoryRequests[w].dropDownRequest = null;
                subCategoryRequests[w].tableRequest = null;
              } else if (type == 'dropdown') {
                subCategoryRequests[w].textRequest = null;
                subCategoryRequests[w].textAreaRequest = null;
                subCategoryRequests[w].dateRequest = null;
                subCategoryRequests[w].tableRequest = null;
              } else if (type == 'table') {
                subCategoryRequests[w].textRequest = null;
                subCategoryRequests[w].textAreaRequest = null;
                subCategoryRequests[w].dateRequest = null;
                subCategoryRequests[w].dropDownRequest = null;
                let tableRequest = subCategoryRequests[w].tableRequest;
                if (tableRequest) {
                  delete tableRequest.tableValueListRequests;
                  let tableHeaderRequests = tableRequest.tableHeaderRequests;
                  if (tableHeaderRequests) {
                    for (let e = 0; e < tableHeaderRequests.length; e++) {
                      delete tableHeaderRequests[e].tableHeaderRequest;
                      let type = tableHeaderRequests[e].type.toLowerCase().replace(/\s*/g, '');

                      /*
                      Add Multiple Cols
                      */

                      if (type == 'text' || type == 'textarea' || type == 'date') {
                        delete tableHeaderRequests[e].textRequest;
                        delete tableHeaderRequests[e].textAreaRequest;
                        delete tableHeaderRequests[e].dateRequest;
                        tableHeaderRequests[e].dropDownDefaultRequests = null;
                      } else if (type == 'dropdown') {
                        delete tableHeaderRequests[e].textRequest;
                        delete tableHeaderRequests[e].textAreaRequest;
                        delete tableHeaderRequests[e].dateRequest;
                        if (tableHeaderRequests[e].dropDownDefaultRequests) {
                          let dropdowndefault = tableHeaderRequests[e].dropDownDefaultRequests;
                          for (let r = 0; r < dropdowndefault.length; r++) {
                            delete dropdowndefault[r].dropDownDefaultRequest;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.weightageRef) {
      this.weightageRef.hide();
    }
  }
}
