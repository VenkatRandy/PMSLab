import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styles: []
})
export class DatepickerComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() iIndex: number;
  @Input() sIndex: number;
  @Input() type: string;

  @Input() rIndex: number;
  @Input() vIndex: number;

  @Input() mode;

  constructor() { }

  ngOnInit() {
  }

}
