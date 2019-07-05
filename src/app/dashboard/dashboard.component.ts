import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { TabDirective } from 'ngx-bootstrap/tabs/public_api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private route: Router, private data: DataService, private modalService: BsModalService, private fb: FormBuilder) { }

  ngOnInit() {
  }

  getTabNumber(value) {
    console.log(value);
    if (value == 1) {
    }
  }

  submit(value) {
    console.log(value);
  }

}
