import { Component, OnInit, EventEmitter, Output, Input, ViewChild, OnDestroy } from '@angular/core';
import { TabDirective } from 'ngx-bootstrap/tabs/public_api';
import { CONSTANTS } from '../variable-constants';

@Component({
  selector: 'app-tabset',
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.scss']
})
export class TabsetComponent implements OnInit, OnDestroy {
  @ViewChild('staticTabs', { static: true }) staticTabs: TabsetComponent;
  @Output() tabnumber = new EventEmitter<number>();
  @Input() reviewType;
  tabs: any[] = [
    {
      title: 'Confirmation Review',
      content: '1',
      customClass: 'customClass'
    },
    {
      title: 'Mid-year Review',
      content: '2',
      customClass: 'customClass'
    },
    {
      title: 'Annual Review',
      content: '3',
      customClass: 'customClass'
    },
    {
      title: 'Performance Improvement Plan',
      content: '4',
      customClass: 'customClass'
    }
  ];
  show: number = 1;
  pre;

  constructor() { }

  ngOnInit() {
    this.pre = CONSTANTS.TABNUMBER;
    if (this.pre) {
      this.tabnumber.emit(this.pre);
      this.show = this.pre;
    } else {
      this.tabnumber.emit(1);
      this.show = 1;
    }
  }

  onSelect(data: TabDirective, index, value): void {
    console.log(value);
    this.show = index + 1;
    sessionStorage.setItem('TabNumber', JSON.stringify(this.show));
    this.tabnumber.emit(this.show);
  }
  ngOnDestroy() {
    // sessionStorage.removeItem('TabNumber');
  }
}
