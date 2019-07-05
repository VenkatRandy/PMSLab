import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  param: any;
  type: any;
  constructor(private route: ActivatedRoute, private titleService: Title) {
    this.titleService.setTitle("Logged Out");
    this.route.queryParams.subscribe(params => {
      this.param = params.type;
    });
    // console.log(this.param);
  }

  ngOnInit() {
  }

}
