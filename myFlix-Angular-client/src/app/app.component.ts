import { Component } from '@angular/core';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'myFlix-Angular-client';

// opens user registration
  constructor(public dialog: MatDialog) { }
  // this function will open the dialog when the signup button is clicked
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      // assigning the dialog a width
      width: '280px'
    });
  }

  // opens user login form
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      //assign dialog width
      width: '280px'
    });
  }
}
