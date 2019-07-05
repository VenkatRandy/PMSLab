import { Component, OnInit, OnDestroy } from '@angular/core';
import { CONSTANTS } from '../variable-constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserWorkflowService } from '../service/user-workflow.service';
import { Title } from '@angular/platform-browser';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styles: []
})
export class WorkflowComponent implements OnInit, OnDestroy {

  names = [];
  list = [];
  filteredList = [];
  level2 = [];
  level2Names = [];
  level3Names = [];
  level3 = [];
  employeeList = [];
  employeeNameList = [];
  reviewId: number;
  reviewType = 'Confirmation Review Template';
  userId;
  initialEmployeeNameList = [];
  intialLevel2NamesList = [];
  intialLevel3NamesList = [];
  searchText;
  statusMessage: string;
  status;
  p = 1;

  constructor(private userWorkFlowService: UserWorkflowService, private spinner: NgxSpinnerService, private title: Title, private data: DataService) {
    this.title.setTitle('Workflow');
  }

  ngOnInit() {
    var userInfo = JSON.parse(sessionStorage.getItem('User Details'));
    this.userId = userInfo.userId;
    this.getAllUsers();
    // this.getLevel2(userInfo.userId);
    // this.getLevel3(userInfo.userId);
    this.spinner.show();
    this.userWorkFlowService.getReviewees(userInfo.userId).subscribe(
      (data: any) => {
        this.spinner.hide();
        this.list = data.data.userWorkFlowLevelsResponses;
        let first = sessionStorage.getItem('TabNumber')
        if (first) {
          this.filterByReviewType(first);
        } else {
          this.filterByReviewType(1);
        }
      }, error => {
        this.spinner.hide();
      });
  }

  // getLevel2(userId) {
  //   this.level2 = [];
  //   this.level2Names = [];
  //   this.userWorkFlowService.getAllLevels(userId, 2).subscribe(
  //     (data: any) => {
  //       this.level2 = data.data.levelResponses;
  //       this.level2.forEach(element => {
  //         this.level2Names.push(
  //           {
  //             userId: element.userId,
  //             name: this.concatNames(element.firstName, element.lastName)
  //           });
  //       });
  //       this.intialLevel2NamesList = this.level2Names;
  //     }
  //   );
  // }

  // getLevel3(userId) {
  //   this.level3 = [];
  //   this.level3Names = [];
  //   this.userWorkFlowService.getAllLevels(userId, 3).subscribe(
  //     (data: any) => {
  //       this.level3 = data.data.levelResponses;
  //       this.level3.forEach(element => {
  //         this.level3Names.push(
  //           {
  //             userId: element.userId,
  //             name: this.concatNames(element.firstName, element.lastName)
  //           });
  //       });

  //       this.intialLevel3NamesList = this.level3Names;
  //     }
  //   );
  // }

  getAllUsers() {
    this.employeeList = [];
    this.employeeNameList = [];
    this.userWorkFlowService.getAllUsers().subscribe(
      (data: any) => {
        this.employeeList = data.data.employeeResponses;
        this.employeeList.forEach(element => {
          this.employeeNameList.push(
            {
              userId: element.userId,
              name: this.concatNames(element.firstName, element.lastName)
            });
        });


        this.initialEmployeeNameList = this.employeeNameList;
      }
    );
  }

  getTabNumber(value) {
    this.searchText = '';
    this.p = 1;
    let searchText = sessionStorage.getItem('searchText');
    if (searchText) {
      this.searchText = searchText;
    }

    this.reviewId = value;
    this.filterByReviewType(this.reviewId);
  }

  filterByReviewType(reviewId) {
    this.filteredList = [];
    for (let index = 0; index < this.list.length; index++) {
      if (reviewId == 1) {
        if (this.list[index].reviewId == 1) {
          this.filteredList.push(this.list[index]);
        }
      } else if (reviewId == 2) {
        if (this.list[index].reviewId == 2) {
          this.filteredList.push(this.list[index]);
        }
      } else if (reviewId == 3) {
        if (this.list[index].reviewId == 3) {
          this.filteredList.push(this.list[index]);
        }
      } else if (reviewId == 4) {
        if (this.list[index].reviewId == 4) {
          this.filteredList.push(this.list[index]);
        }
      }

    }
    this.filteredList = [...this.filteredList]
  }

  concatNames(firstName, lastName) {
    return firstName + " " + lastName;
  }

  // omitGivenUserLevel2(userId) {
  //   var filteredLevel2List = [];
  //   filteredLevel2List = this.intialLevel2NamesList.filter(
  //     (item) => item.userId != userId
  //   );
  //   this.level2Names = [...filteredLevel2List];
  // }

  // omitGivenUserLevel3(userId) {
  //   var filteredLevel3List = [];
  //   filteredLevel3List = this.intialLevel3NamesList.filter(
  //     (item) => item.userId != userId
  //   );
  //   this.level3Names = [...filteredLevel3List];
  // }

  omitGivenUser(userId) {
    var filteredNameList = [];
    filteredNameList = this.initialEmployeeNameList.filter(
      (item) => item.userId != userId
    );
    filteredNameList = filteredNameList.filter(
      (item) => item.userId != this.userId
    );
    this.employeeNameList = [...filteredNameList];
  }

  omitGivenUserAndLevel2(userId, level2) {
    var filteredNameList = [];
    filteredNameList = this.initialEmployeeNameList.filter(
      (item) => item.userId != userId
    );

    filteredNameList = filteredNameList.filter(
      (item) => item.userId != level2
    );

    filteredNameList = filteredNameList.filter(
      (item) => item.userId != this.userId
    );

    this.employeeNameList = [...filteredNameList];
  }

  update(event, data) {


    let payload = [];
    payload.push(data);


    payload.forEach(element => {
      if (element.level2Name == null) {
        element.level2 = null;
        element.level3 = null;
        element.level3Name = null;
      }
      else if (element.level3Name == null) {


        element.level3 = null;
      }
      if (event) {
        if (element.level2Name != null && element.level2Name == event.name) {
          element.level2 = event.userId;
        }
        if (element.level3Name != null && element.level3Name == event.name) {
          element.level3 = event.userId;
        }
      }

    });



    this.spinner.show();
    this.userWorkFlowService.updateLevels(payload).subscribe(data => {
      // this.getLevel2(this.userId);
      // this.getLevel3(this.userId);
      this.getAllUsers();
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    }, error => {
      this.spinner.hide();
      this.status = CONSTANTS.FAILURE;
      this.statusMessage = CONSTANTS.FAILURE;
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    }
    );
  }

  ngOnDestroy() {
    sessionStorage.removeItem('searchText');
  }
}
