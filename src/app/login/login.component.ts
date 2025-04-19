import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isSignUp = false;

  switchToSignUp() {
    this.isSignUp = true;
  }

  switchToSignIn() {
    this.isSignUp = false;
  }
}
