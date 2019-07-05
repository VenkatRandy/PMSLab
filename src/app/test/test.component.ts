import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormArray, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styles: []
})
export class TestComponent implements OnInit {
  form: FormGroup;
  createList: any = [];
  _isEditMode: boolean = false;
  _isAddMode: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private route: Router,
    private dataService: DataService) { }

  ngOnInit() {
    // setTimeout(() => {
    //   console.info(JSON.stringify(this.form.value))
    // }, 5000);
    // this.initializeForm();
    // this.patch();

    // setTimeout(() => {
    //   // console.warn(this.form);
    //   const formValue = this.form.getRawValue().categoryRequests;
    //   this.dataService.setCategoryList(formValue);
    //   this.addToAccordian(formValue);
    // }, 1000);
  }

  // Add Into Accordian
  //   addGroupItem(value, z): void {
  //     if (this._isEditMode) {
  //       let categoryName = value.categoryRequests[z].name;
  //       this.createList[z].title = categoryName
  //       this._isEditMode = false;
  //     } else {
  //       this._isAddMode = false;
  //       let categoryName = value.categoryRequests[z].name;
  //       this.createList.push({
  //         title: categoryName,
  //         content: `Dynamic Group Body - ${this.createList.length + 1}`
  //       });
  //     }
  //   }

  //   //remove Accordian
  //   removeAccordian(index, confirm) {
  //     // this.openConfirmModal(confirm);
  //     // this.message = '';
  //     this.createList.splice(index, 1);
  //     let control = this.form.get(`categoryRequests`) as FormArray;
  //     control.removeAt(index);
  //     if (control.length == 0) {
  //       this.dataService.setFormLength(0);
  //     }
  //   }

  //   initializeForm() {
  //     this.form = this.fb.group({
  //       categoryRequests: this.fb.array([])
  //     });
  //   }

  //   patch() {
  //     // this.spinner.show();
  //     const control = <FormArray>this.form.get(`categoryRequests`);
  //     const catData = payload.data.templateResponses[0].categoryResponses;
  //     // CategoryRequests Array
  //     for (let index = 0; index < catData.length; index++) {
  //       let MY_GRP = new FormGroup({});
  //       // Object Entries
  //       for (let obj = 0; obj < Object.entries(catData[index]).length; obj++) {
  //         var key = Object.entries(catData[index])[obj][0];
  //         var value = this.fb.control(
  //           Object.entries(catData[index])[obj][1]
  //         );
  //         if (key == 'name') {
  //           value.setValidators(Validators.required);
  //         }
  //         MY_GRP.addControl(key, value);
  //       }
  //       control.push(MY_GRP);
  //       let subData = catData[index].subCategoryResponses;
  //       this.patchSubCategory(index, subData);
  //     }
  //   }

  //   patchSubCategory(idx, data) {
  //     const control = <FormGroup>this.form.get(`categoryRequests.${idx}`);
  //     control.removeControl('subCategoryResponses');
  //     var key = 'subCategoryRequests';
  //     var value = this.fb.array([]);
  //     control.addControl(key, value);
  //     this.insideSubCategory(idx, data);
  //   }

  //   insideSubCategory(idx, data) {
  //     const control = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests`);
  //     // Subcategory
  //     for (let index = 0; index < data.length; index++) {
  //       var MY_GRP = new FormGroup({});
  //       //Inside Subcategory
  //       for (let sub = 0; sub < Object.entries(data[index]).length; sub++) {
  //         var key = Object.entries(data[index])[sub][0];
  //         var value = this.fb.control(
  //           Object.entries(data[index])[sub][1]);
  //         if (key == 'name' || key == 'description' || key == 'type') {
  //           value.setValidators(Validators.required);
  //         }
  //         MY_GRP.addControl(key, value);
  //       }
  //       control.push(MY_GRP);
  //       this.insideSubCategoryObject(idx, index, data[index])
  //     }
  //   }

  //   insideSubCategoryObject(idx, index, data) {
  //     const control = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}`);
  //     control.removeControl('tableResponse');
  //     control.removeControl('dropDownResponse');

  //     if (data.dropDownResponse != null) {
  //       // this._isDropDownShow[idx][index] = true;
  //       var key = 'dropDownRequest';
  //       var value = this.captureDropdown(data);
  //       control.addControl(key, value)
  //       this.insideDropDown(idx, index, data);
  //     } else {
  //       var key = 'dropDownRequest';
  //       var value = this.buildDrop();
  //       control.addControl(key, value)
  //     }

  //     if (data.tableResponse != null) {
  //       // this._isTableShow[idx][index] = true;
  //       var key = 'tableRequest';
  //       control.addControl(key, new FormGroup({
  //         "tableHeaderRequests": this.fb.array([]),
  //         "tableValueListRequests": this.fb.array([]),
  //       }));
  //       this.captureTable(idx, index, data);
  //     } else {
  //       var key = 'tableRequests';
  //       control.addControl(key, new FormArray([]))
  //     }
  //     this.addTwoRequests(control);
  //   }

  //   captureDropdown(data) {
  //     var MY_GRP = new FormGroup({});
  //     for (let drop = 0; drop < Object.entries(data.dropDownResponse).length; drop++) {
  //       var key = Object.entries(data.dropDownResponse)[drop][0];
  //       var value = this.fb.control(Object.entries(data.dropDownResponse)[drop][1]);
  //       MY_GRP.addControl(key, value);
  //     }
  //     return MY_GRP;
  //   }

  //   insideDropDown(idx, index, data) {
  //     const control = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.dropDownRequest`);
  //     control.removeControl('dropDownDefaultResponses');
  //     var key = 'dropDownDefaultRequests';
  //     var value = this.fb.array([]);
  //     control.addControl(key, value);
  //     this.captureDropdownDefault(idx, index, data);
  //     // this.captureDropdownSelected(idx, index, data)
  //     var key = 'dropDownSelectedRequest'
  //     var val = this.buildLevels();
  //     control.addControl(key, val);
  //   }

  //   captureDropdownDefault(idx, index, data) {
  //     const control = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.dropDownRequest.dropDownDefaultRequests`);
  //     for (let index = 0; index < data.dropDownResponse.dropDownDefaultResponses.length; index++) {
  //       var MY_GRP = new FormGroup({});
  //       for (let obj = 0; obj < Object.entries(data.dropDownResponse.dropDownDefaultResponses[index]).length; obj++) {
  //         //Inside Object
  //         var key = Object.entries(data.dropDownResponse.dropDownDefaultResponses[index])[obj][0];
  //         var value = this.fb.control(
  //           Object.entries(data.dropDownResponse.dropDownDefaultResponses[index])[obj][1]);
  //         if (key == 'value') {
  //           value.setValidators(Validators.required);
  //         }
  //         MY_GRP.addControl(key, value);
  //       }
  //       control.push(MY_GRP);
  //     }
  //   }

  //   captureTable(idx, index, data) {
  //     // Inject Header
  //     const control = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests`);
  //     for (let indexT = 0; indexT < data.tableResponse.tableHeaderResponses.length; indexT++) {
  //       var MY_GRP = new FormGroup({});
  //       for (let ins = 0; ins < Object.entries(data.tableResponse.tableHeaderResponses[indexT]).length; ins++) {
  //         var key = Object.entries(data.tableResponse.tableHeaderResponses[indexT])[ins][0];
  //         var value = this.fb.control(
  //           Object.entries(data.tableResponse.tableHeaderResponses[indexT])[ins][1]);
  //         MY_GRP.addControl(key, value);
  //       }
  //       control.push(MY_GRP);
  //     }

  //     // Inject Values
  //     const control2 = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests`);
  //     for (let indexT = 0; indexT < data.tableResponse.tableValueListResponses.length; indexT++) {
  //       var MY_GRP = new FormGroup({});
  //       MY_GRP.addControl('tid', new FormControl(indexT + 1));
  //       for (let ins = 0; ins < Object.entries(data.tableResponse.tableValueListResponses[indexT]).length; ins++) {
  //         var key = Object.entries(data.tableResponse.tableValueListResponses[indexT])[ins][0];
  //         var value = this.fb.control(
  //           Object.entries(data.tableResponse.tableValueListResponses[indexT])[ins][1]);
  //         MY_GRP.addControl(key, value);
  //       }
  //       control2.push(MY_GRP);
  //       this.insideTableValueList(idx, index, indexT, data.tableResponse.tableValueListResponses[indexT]);
  //     }

  //     this.replicateTypeValues(idx, index);
  //   }

  //   insideTableValueList(idx, index, indexT, data) {
  //     const control = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${indexT}`);
  //     control.removeControl("tableValueResponses");
  //     var key = "tableValueRequests"
  //     var value = this.fb.array([]);
  //     control.addControl(key, value);

  //     for (let ind = 0; ind < data.tableValueResponses.length; ind++) {
  //       var MY_GRP = new FormGroup({});
  //       MY_GRP.addControl('t_id', new FormControl(ind + 1));
  //       for (let i = 0; i < Object.entries(data.tableValueResponses[ind]).length; i++) {
  //         let key = Object.entries(data.tableValueResponses[ind])[i][0];
  //         let value = this.fb.control(
  //           Object.entries(data.tableValueResponses[ind])[i][1]);
  //         MY_GRP.addControl(key, value);
  //       }
  //       let valueList = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${indexT}.tableValueRequests`);
  //       valueList.push(MY_GRP)
  //       this.insideTableValueRequests(idx, index, indexT, data, ind, { ...MY_GRP });
  //     }
  //   }

  //   insideTableValueRequests(idx, index, indexT, data, ind, MY_GRP) {
  //     const control = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${indexT}.tableValueRequests.${ind}`);
  //     control.removeControl("textResponse");
  //     control.removeControl("dropDownSelectedResponse");
  //     for (let i = 0; i < Object.entries(MY_GRP.value).length; i++) {
  //       var LVL_GRP = new FormGroup({});
  //       let key = Object.entries(MY_GRP.value)[i][0];
  //       let val = Object.entries(MY_GRP.value)[i][1];
  //       if ((key.toLowerCase()) == "textresponse") {
  //         if (val != null) {
  //           for (let v = 0; v < Object.entries(val).length; v++) {
  //             let name = Object.entries(val)[v][0];
  //             let data = this.fb.control(Object.entries(val)[v][1]);
  //             LVL_GRP.addControl(name, data);
  //           }
  //           let key = "textRequest";
  //           let value = LVL_GRP;
  //           control.addControl(key, value);
  //         } else {
  //           let key = "textRequest";
  //           let value = this.buildLevels();;
  //           control.addControl(key, value);
  //         }
  //       } else if ((key.toLowerCase()) == "dropdownselectedresponse") {
  //         if (val != null) {
  //           for (let v = 0; v < Object.entries(val).length; v++) {
  //             let name = Object.entries(val)[v][0];
  //             let data = this.fb.control(Object.entries(val)[v][1]);
  //             LVL_GRP.addControl(name, data);
  //           }
  //           let key = "dropDownSelectedRequest";
  //           let value = LVL_GRP;
  //           control.addControl(key, value);
  //         } else {
  //           let key = "dropDownSelectedRequest";
  //           let value = this.buildLevels();;
  //           control.addControl(key, value);
  //         }
  //       }
  //     }
  //   }

  //   replicateTypeValues(idx, index) {
  //     const controls = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest`);
  //     if (controls != null) {
  //       const controlH = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests`);

  //       // ADD DROPDOWN DEFAULT
  //       for (let indexx = 0; indexx < controlH.value.length; indexx++) {
  //         const controlV = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${indexx}.tableValueRequests`);
  //         if (controlV != null) {
  //           for (let indexy = 0; indexy < controlV.value.length; indexy++) {
  //             const controlY = <FormGroup>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${indexx}.tableValueRequests.${indexy}`);
  //             if (controlY != null) {
  //               let name = 'dropDownDefaultRequests'
  //               let content = this.fb.array([]);
  //               controlY.addControl(name, content);
  //               if ((controlY.value.type.toLowerCase()) != 'text') {
  //                 this.injectDropdownFromHeader(idx, index, indexx, indexy);
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }

  //   injectDropdownFromHeader(idx, index, indexx, indexy) {
  //     const controls = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest`);
  //     if (controls != null) {
  //       let drop = this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableHeaderRequests.${indexy}.dropDownDefaultResponses`);
  //       if (drop.value != null) {
  //         for (let t = 0; t < Object.entries(drop.value).length; t++) {
  //           var HDRDRP_GRP = new FormGroup({});
  //           for (let u = 0; u < Object.entries(drop.value[t]).length; u++) {
  //             let key = Object.entries(drop.value[t])[u][0];
  //             let value = this.fb.control(Object.entries(drop.value[t])[u][1]);
  //             HDRDRP_GRP.addControl(key, value);
  //           }
  //           const controlV = <FormArray>this.form.get(`categoryRequests.${idx}.subCategoryRequests.${index}.tableRequest.tableValueListRequests.${indexx}.tableValueRequests.${indexy}.dropDownDefaultRequests`);
  //           HDRDRP_GRP.addControl('oId', new FormControl(t + 1))
  //           controlV.push(HDRDRP_GRP);
  //         }
  //       }
  //     }
  //   }

  //   /* ++++++++++++ BUILD ++++++++++++++++ */
  //   buildDrop() {
  //     return this.fb.group({
  //       dropDownDefaultRequests: this.fb.array([]),
  //       dropDownSelectedRequest: this.buildLevels()
  //     })
  //   }

  //   buildLevels() {
  //     return this.fb.group({
  //       employee: new FormControl(null),
  //       level1: new FormControl(null),
  //       level2: new FormControl(null),
  //       level3: new FormControl(null),
  //     })
  //   }

  //   addTwoRequests(control) {
  //     if (true) {
  //       //Text Requests
  //       var key = 'textRequest';
  //       var value = this.buildLevels();
  //       control.addControl(key, value)

  //       // TextArea Requests
  //       var key = 'textAreaRequest';
  //       var value2 = this.buildLevels();
  //       control.addControl(key, value2)
  //     }
  //   }

  //   //First Time
  //   addToAccordian(control) {
  //     for (let index = 0; index < control.length; index++) {
  //       let categoryName = control[index].name;
  //       this.createList.push({
  //         title: categoryName,
  //         content: `Dynamic Group Body - ${this.createList.length + 1}`
  //       });
  //     }
  //   }
  // }
}





























var payload = {
  "data": {
    "reviewType": "Confirmation",
    "templateResponses": [
      {
        "employeeRating": "",
        "employeeComments": "",
        "level1Rating": "",
        "level1Comments": "",
        "level2Rating": "",
        "level2Comments": "",
        "level3Rating": "",
        "level3Comments": "",
        "roleType": null,
        "categoryResponses": [
          {
            "name": "Factor",
            "type": null,
            "subCategoryResponses": [
              {
                "name": "Skills",
                "description": null,
                "type": "Table",
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "name": null,
                      "description": "Skills Type",
                      "type": "Text",
                      "columnName": "Skills Type",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "name": null,
                      "description": "Skills Description",
                      "type": "Text",
                      "columnName": "Skills Description",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "name": null,
                      "description": null,
                      "type": "DropDown",
                      "columnName": "Rating",
                      "dropDownDefaultResponses": [
                        {
                          "key": "Outstanding",
                          "value": "4"
                        },
                        {
                          "key": "Exceed Expectations",
                          "value": "3"
                        },
                        {
                          "key": "Meet Expectations",
                          "value": "2"
                        },
                        {
                          "key": "Below Expectations",
                          "value": "1"
                        }
                      ]
                    }, {
                      "name": null,
                      "description": null,
                      "type": "DropDown",
                      "columnName": "Rating",
                      "dropDownDefaultResponses": [
                        {
                          "key": "Outstandddddddddddddding",
                          "value": "4"
                        },
                        {
                          "key": "Exceed Esssadasdxpectations",
                          "value": "3"
                        },
                        {
                          "key": "Meet Expeasfasfctations",
                          "value": "2"
                        },
                        {
                          "key": "Belowasfsaf Expectations",
                          "value": "1"
                        }
                      ]
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "Text",
                          "textResponse": {
                            "employee": "",
                            "level1": "",
                            "level2": "",
                            "level3": ""
                          },
                          "dropDownSelectedResponse": null
                        },
                        {
                          "type": "Text",
                          "textResponse": {
                            "employee": "",
                            "level1": "",
                            "level2": "",
                            "level3": ""
                          },
                          "dropDownSelectedResponse": null
                        },
                        {
                          "type": "DropDown",
                          "textResponse": null,
                          "dropDownSelectedResponse": {
                            "employee": "",
                            "level1": "",
                            "level2": "",
                            "level3": ""
                          }
                        },
                        {
                          "type": "DropDown",
                          "textResponse": null,
                          "dropDownSelectedResponse": {
                            "employee": "",
                            "level1": "",
                            "level2": "",
                            "level3": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "textAreaResponse": null,
                "textResponse": null
              },
              {
                "name": "Communication",
                "description": null,
                "type": "Text",
                "textResponse": {
                  "employee": "",
                  "level1": "",
                  "level2": "",
                  "level3": ""
                },
                "tableResponse": null,
                "textAreaResponse": null,
                "dropDownResponse": null
              },
              {
                "name": "Explanation of Performance Rating",
                "description": null,
                "type": "DropDown",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": null,
                "dropDownResponse": {
                  "dropDownDefaultResponses": [
                    {
                      "key": "Outstanding",
                      "value": "4"
                    },
                    {
                      "key": "Exceed Expectations",
                      "value": "3"
                    },
                    {
                      "key": "Meet Expectations",
                      "value": "2"
                    },
                    {
                      "key": "Below Expectations",
                      "value": "1"
                    }
                  ],
                  "dropDownSelectedResponse": {
                    "employee": "",
                    "level1": "",
                    "level2": "",
                    "level3": ""
                  }
                }
              }
            ]
          },
          {
            "name": "Summary",
            "type": null,
            "subCategoryResponses": [
              {
                "name": "Reviewer’s summary of Reviewee’s performance",
                "description": null,
                "type": "Text Area",
                "textAreaResponse": {
                  "employee": "",
                  "level1": "",
                  "level2": "",
                  "level3": ""
                },
                "textResponse": null,
                "tableResponse": null,
                "dropDownResponse": null
              }
            ]
          },
          {
            "name": "Recommendations",
            "type": null,
            "subCategoryResponses": [
              {
                "name": "Confirmation Recommendations - Reviewer:",
                "description": null,
                "type": "Text Area",
                "textAreaResponse": {
                  "employee": "",
                  "level1": "",
                  "level2": "",
                  "level3": ""
                },
                "textResponse": null,
                "tableResponse": null,
                "dropDownResponse": null
              }
            ]
          }
        ]
      }
    ]
  }
}