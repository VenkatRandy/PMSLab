import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../service/data.service';
import { CONSTANTS } from '../variable-constants';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styles: []
})
export class ErrorComponent implements OnInit {
  error;
  constructor(private dataservice: DataService) { }

  ngOnInit() {
    this.error = CONSTANTS.ERROR_CODE;
    // this.dataservice.errorCode.subscribe(data => {
    //   if (data != 0) {
    //     this.error = data;
    //   }
    // })
  }

}
