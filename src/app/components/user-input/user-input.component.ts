import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.scss']
})
export class UserInputComponent implements OnInit {

  constructor() { }

  username = '';
  userData = {};
  userContributions = {};

  @Output() handleUserDataChange = new EventEmitter<Object>();
  @Output() handleUserContributionsChange = new EventEmitter<Object>();
  @Output() handleRequestData = new EventEmitter<Boolean>();

  ngOnInit() {
  }

  onUserSearch() {
    const urlUser = 'https://api.github.com/users/' + this.username;
    const urlContributions = 'https://github-contributions-api.now.sh/v1/' + this.username;

    fetch(urlUser).then((data) => {
      return data.json();
    }).then((res) => {
      this.userData = res;
      this.handleUserDataChange.emit(this.userData);
    });

    fetch(urlContributions).then((data) => {
      this.handleRequestData.emit(true);
      return data.json();
    }).then((res) => {
      this.userContributions = res;
      this.handleUserContributionsChange.emit(this.userContributions);
    });
  }

}
