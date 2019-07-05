import { Component, OnInit, Input } from '@angular/core';
import { FormService } from 'src/app/service/form.service';
import { FUNCTIONS, CONSTANTS } from 'src/app/variable-constants';
import { DataService } from 'src/app/service/data.service';
import { PopoverDirective } from 'ngx-bootstrap/popover/public_api';

@Component({
  selector: 'app-template-view',
  templateUrl: './template-view.component.html',
  styles: []
})
export class TemplateViewComponent implements OnInit {
  _isTemplateAvailable: boolean;
  @Input() selectedRole: string;
  roleType = [];
  accordianList = [];
  @Input() Responses;
  @Input() reviewId;
  vault;
  Requests;
  level: string;
  rate;
  weightage;
  count = 0;
  popRef: PopoverDirective;

  constructor(private formservice: FormService, private data: DataService) { }

  log(event) {
    if (this.popRef) {
      this.popRef.hide();
    }
  }

  open(pop: PopoverDirective) {
    this.count = 1;
    this.popRef = pop;
    pop.show();
  }

  ngOnInit() {
    if (this.Responses && this.reviewId) {
      let templateResponses = this.Responses.templateResponses;
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
                this.addToAccordian(categoryRequests);
                this.weightage = [];
                for (let index = 0; index < this.accordianList.length; index++) {
                  let categoryName = this.accordianList[index].title;
                  let weightage = this.accordianList[index].weightage;
                  let grp = {
                    id: index,
                    value: weightage,
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
    for (let index = 0; index < control.length; index++) {
      let categoryName = control[index].name;
      let weightage = control[index].weightage;
      let grp = {
        id: index,
        title: categoryName,
        rejected: false,
        weightage: weightage,
        content: `Dynamic Group Body - ${this.accordianList.length + 1}`
      }
      if (
        FUNCTIONS.TRIM(categoryName).includes('ratings') ||
        FUNCTIONS.TRIM(categoryName).includes('comments') ||
        FUNCTIONS.TRIM(categoryName).includes('recommendation') ||
        FUNCTIONS.TRIM(categoryName).includes('summary')
      ) {
        grp.rejected = true
      }
      this.accordianList.push(grp);
    }
  }

  processRating(requests) {
    this.level = undefined;
    if (this.selectedRole == CONSTANTS.REVIEWER) {
      this.rate = requests.level1Rating;
    } else if (this.selectedRole == CONSTANTS.APPRAISERI) {
      this.rate = requests.level2Rating;
    } else if (this.selectedRole == CONSTANTS.APPRAISERII) {
      this.rate = requests.level3Rating;
    } else if (this.selectedRole == CONSTANTS.EMPLOYEE) {
      this.rate = requests.employeeRating
    }

    if (this.rate) {
      if (this.reviewId == 1) {
        if (this.rate == 4) {
          this.level = CONSTANTS.RATING_OUTSTANDING;
        } else if (this.rate == 3) {
          this.level = CONSTANTS.RATING_EXCEED;
        } else if (this.rate == 2) {
          this.level = CONSTANTS.RATING_MEET;
        } else if (this.rate == 1) {
          this.level = CONSTANTS.RATING_BELOW;
        }
      } else if (this.reviewId == 3) {
        if (this.rate >= 90) {
          this.level = CONSTANTS.RATING_OUTSTANDING;
        } else if ((this.rate >= 80) && (this.rate <= 89)) {
          this.level = CONSTANTS.RATING_EXCEED;
        } else if ((this.rate >= 60) && (this.rate <= 79)) {
          this.level = CONSTANTS.RATING_MEET;
        } else if (this.rate < 60) {
          this.level = CONSTANTS.RATING_BELOW;
        }
      }
    } else {
      this.level = CONSTANTS.RATING_BELOW;
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
}
