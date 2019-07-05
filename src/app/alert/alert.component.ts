import { Component, OnInit, Input, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styles: []
})
export class AlertComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() status;
  @ViewChild('modal', { static: true }) modal: ModalDirective;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.showModal();
  }

  showModal(): void {
    this.modal.show();
  }

  hideModal(): void {
    this.modal.hide();
  }

  ngOnDestroy() {
    this.hideModal();
  }
}
