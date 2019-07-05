import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FUNCTIONS } from 'src/app/variable-constants';
import { PopoverDirective } from 'ngx-bootstrap/popover/public_api';
import { DataService } from 'src/app/service/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-extrinsic-view',
  templateUrl: './extrinsic-view.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtrinsicViewComponent implements OnInit, OnDestroy {
  @Input() Payload;
  @Input() showOnly;
  @Input() index;
  @Input() reviewId;
  count = 0;
  popRef: PopoverDirective;
  accRef: Subscription;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.accRef = this.data._isAccordianChanged.subscribe(data => {
      this.log(data);
    })
  }

  open(pop: PopoverDirective) {
    this.count = 1;
    this.popRef = pop;
    pop.show();
  }


  log(event: boolean) {
    if (this.popRef) {
      this.popRef.hide();
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
    this.accRef.unsubscribe();
  }
}
