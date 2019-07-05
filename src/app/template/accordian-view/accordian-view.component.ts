import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormService } from 'src/app/service/form.service';
import { DataService } from 'src/app/service/data.service';
import { FUNCTIONS, CONSTANTS } from 'src/app/variable-constants';
import { PopoverDirective } from 'ngx-bootstrap/popover/public_api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-accordian-view',
  templateUrl: './accordian-view.component.html',
  styles: []
})
export class AccordianViewComponent implements OnInit, OnDestroy {
  @Input() Responses: any;
  @Input() reviewId: number;
  @Input() type: string;
  @Input() index: number;
  @Input() selectedRole: string;

  _isTemplateAvailable: boolean;
  roleType = [];
  accordianList = [];
  vault;
  Requests;
  level: string;
  rate;
  count = 0;
  popRef: PopoverDirective;
  catListSub: Subscription;
  accChangeSub: Subscription;

  constructor(private formservice: FormService, private data: DataService) { }

  ngOnInit() {
    this.catListSub = this.data.categoryList.subscribe(data => {
      if (this.type == 'request') {
        this.request(this.Responses, this.reviewId);
      } else if (this.type == 'response') {
        this.response(this.Responses, this.reviewId);
      }
    });

    this.accChangeSub = this.data._isAccordianChanged.subscribe(data => {
      if (this.count) {
        this.popRef.hide();
      }
    })
  }

  open(pop: PopoverDirective) {
    this.count = 1;
    this.popRef = pop;
    pop.show();
  }

  request(requests, reviewId) {
    if (requests && reviewId) {
      let categoryRequests = JSON.parse(JSON.stringify(requests));
      this.formservice.injectIndex(categoryRequests);
      this.Requests = categoryRequests;
      if (this.Requests) {
        this._isTemplateAvailable = true;
        this.addToAccordian(categoryRequests);
        this.data.selectedRole.subscribe(data => {
          if (data) {
            this.selectedRole = data;
            // let requests = this.Requests;
            // this.processRating(requests);
          } else {
            // this.selectedRole = FUNCTIONS.FINDLEVEL(this.reviewId);
            // this.processRating(this.Requests);
          }
        });
      } else {
        this._isTemplateAvailable = false;
      }
    }
  }

  response(response, reviewId) {
    if (response && reviewId) {
      let templateResponses = response.templateResponses;
      if (templateResponses) {
        let template = templateResponses[0];
        if (template) {
          this.vault = JSON.parse(JSON.stringify(template));
          if (this.vault) {
            let converted = this.formservice.convertTo(this.vault);
            this.formservice.injectIndex(converted.categoryRequests)
            this.Requests = converted;
            if (this.Requests) {
              this._isTemplateAvailable = true;
              let categoryRequests = this.Requests.categoryRequests;
              if (categoryRequests) {
                this.addToAccordian(categoryRequests)
                this.data.selectedRole.subscribe(data => {
                  if (data) {
                    this.selectedRole = data;
                    let requests = this.Requests;
                    this.processRating(requests);
                  } else {
                    // this.selectedRole = FUNCTIONS.FINDLEVEL(this.reviewId);
                    // this.processRating(this.Requests);
                  }
                });
              } else {
                this._isTemplateAvailable = false;
              }
            }
          }
        }
      }
    }
  }

  addToAccordian(control) {
    this.accordianList = [];
    for (let index = 0; index < control.length; index++) {
      let categoryName = control[index].name;
      this.accordianList.push({
        id: index,
        title: categoryName,
        content: `Dynamic Group Body - ${this.accordianList.length + 1}`
      });
    }
  }

  processRating(requests) {
    this.level = undefined;
    if (this.selectedRole == CONSTANTS.LEVEL1) {
      this.rate = requests.level1Rating;
    } else if (this.selectedRole == CONSTANTS.LEVEL2) {
      this.rate = requests.level2Rating;
    } else if (this.selectedRole == CONSTANTS.LEVEL3) {
      this.rate = requests.level3Rating;
    } else if (this.selectedRole == CONSTANTS.SELF) {
      this.rate = requests.employeeRating
    }

    if (this.rate) {
      if (this.reviewId == 1) {
        if (this.rate == 4) {
          this.level = 'Outstanding';
        } else if (this.rate == 3) {
          this.level = 'Exceed Expectations';
        } else if (this.rate == 2) {
          this.level = 'Meets Expectations';
        } else if (this.rate == 1) {
          this.level = 'Below Expectations';
        }
      } else if (this.reviewId == 3) {
        if (this.rate >= 90) {
          this.level = 'Outstanding';
        } else if ((this.rate >= 80) && (this.rate <= 89)) {
          this.level = 'Exceed Expectations';
        } else if ((this.rate >= 60) && (this.rate <= 79)) {
          this.level = 'Meets Expectations';
        } else if (this.rate < 60) {
          this.level = 'Below Expectations';
        }
      }
    } else {
      this.level = 'Below Expectations';
    }
  }

  // Get_______________________________________________
  getTableValueRequests(weightageAgainstKRA, tableRequest, rows) {
    if (weightageAgainstKRA) {
      let data = [];
      let tableHeaderRequests = tableRequest.tableHeaderRequests;
      for (let v = 0; v < rows.tableValueRequests.length; v++) {
        let colName = tableHeaderRequests[v].columnName;
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

  getTableColumns(weightageAgainstKRA, tableRequest) {
    if (weightageAgainstKRA) {
      let data = [];
      let tableHeader = tableRequest.tableHeaderRequests;
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
      return tableRequest.tableHeaderRequests;
    }
  }

  // TrackBy_________________________________________________
  /**
 * Accordian
 */
  trackByAcc(index, accordian) {
    return accordian.id;
  }
  /**
 * CategoryRequests
 */
  public trackByCat(index, cat) {
    return cat.categoryRequest;
  }
  /**
* SubCategoryRequests
*/
  public trackBySub(index, sub) {
    return sub.subCategoryRequest;
  }
  /**
* tableHeaderRequests
*/
  public trackByTH(index, row) {
    return row.tableHeaderRequest;
  }
  /**
* tableValueListRequests
*/
  public trackByFnRows(index, row) {
    return row.tableValueListRequest;
  }
  /**
* tableValueRequests
*/
  public trackByFnCols(index, values) {
    return values.tableValueRequest;
  }
  // \.TrackBy_________________________________________________

  ngOnDestroy() {
    this.catListSub.unsubscribe();
    this.accChangeSub.unsubscribe();
  }
}
