
import {HttpClient} from '@angular/common/http';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    console.log("isUser",isLoggedIn);
    if (isLoggedIn) {
      this.router.navigate(['/user']);
      return;
    }
    this.initializeGoogleSignIn();
  }

  initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: '181383326350-sordhji70sehh00h661rmlgjai0bn5n4.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
    });

    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "filled_blue", size: "medium",shape: "pill",text:"signin_with" ,type:"standard",logo_alignment:"left"}
    );
  }

  handleCredentialResponse(response: any): void {
    const idToken = response.credential;
    console.log("ID Token from Google:", idToken);

    // Send to your Spring Boot backend
    this.http.post('http://localhost:8080/api/auth/login', { idToken })
      .subscribe({
        next: (res: any) => {
          console.log('Logged in successfully:', res);
          sessionStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/user']);
        },
        error: (err) => {
          console.error('Login failed', err);
        }
      });
  }
  
  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }

}
