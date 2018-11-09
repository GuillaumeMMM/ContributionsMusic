import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  userData = {};
  requestData = false;
  userContributions = {};

  ngOnInit() {
  }

  onUserDataChange(userData) {
    // console.log('data user', userData);
    this.userData = userData;
  }

  onUserContributionsChange(userContributions) {
    // console.log('data user', userContributions);
    this.userContributions = userContributions;
  }

  onRequestData() {
    this.requestData = true;
  }

}
