import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-textbox',
  templateUrl: './textbox.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class TextboxComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() iIndex: number;
  @Input() sIndex: number;
  @Input() type: string;

  @Input() rIndex: number;
  @Input() vIndex: number;

  @Input() mode;

  constructor() { }

  ngOnInit() {
    // if ((this.iIndex != undefined && this.sIndex != undefined && this.form != undefined)) {
    //   console.log(this.iIndex, " IINDEXXXXXXXXXXXXX");
    //   console.log(this.sIndex, " SINDEXXXXXXXXXXXXX");
    //   console.log(this.form, "  FORMMMMMMMMMMMMM");
    //   console.log(this.tIndex, "  FORMMMMMMMMMMMMM");
    // }
  }

}
