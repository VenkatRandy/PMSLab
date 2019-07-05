import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PopoverDirective } from 'ngx-bootstrap/popover/public_api';

@Component({
  selector: 'app-view-subcategory',
  templateUrl: './view-subcategory.component.html',
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewSubcategoryComponent implements OnInit, OnDestroy {
  @Input() index;
  @Input() form: FormGroup;
  @Input() mode;
  @Input() reviewId;
  view;
  _insideTable = 'insideTable';
  _outsideTable = 'outsideTable';
  popRef: PopoverDirective
  count = 0;
  catListSub: Subscription;
  accChangeSub: Subscription;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.catListSub = this.data.categoryList.subscribe(data => {
      this.view = data;
    });

    this.accChangeSub = this.data._isAccordianChanged.subscribe(data => {
      if (this.count) {
        this.popRef.hide();
      }
    })

    if (this.mode) {
      if ((this.mode.toLowerCase()) == 'viewmode') {
        // || (this.mode.toLowerCase()) == 'editmode') {
        this.form.disable();
      }
    }
  }

  open(pop: PopoverDirective) {
    this.count = 1;
    this.popRef = pop;
    pop.show();
  }

  trackByCategoryFn(index, cat) {
    return cat.categoryRequest;
  }

  trackBySubCategoryFn(index, sub) {
    return sub.subCategoryRequest;
  }

  ngOnDestroy() {
    this.catListSub.unsubscribe();
    this.accChangeSub.unsubscribe();
  }

}
