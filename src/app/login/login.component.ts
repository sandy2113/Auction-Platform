
import {HttpClient} from '@angular/common/http';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './authservice';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isSignUp = false;
  email: string = '';
  password: string = '';
  name:string='';

  switchToSignUp() {
    this.isSignUp = true;
  }

  switchToSignIn() {
    this.isSignUp = false;
  }

  constructor(private http: HttpClient, private router: Router,private authService: AuthService) {}

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
    sessionStorage.setItem('googleToken', idToken);
    // Send to your Spring Boot backend
    this.http.post('http://localhost:8080/api/auth/login', { idToken })
      .subscribe({
        next: (res: any) => {
          console.log('Logged in successfully:', res.userDetails);
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('userDetails',JSON.stringify(res.userDetails));
          this.router.navigate(['/user']);
          const sessionStart = new Date().getTime();
          const sessionDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
          sessionStorage.setItem('sessionStartTime', sessionStart.toString());
          sessionStorage.setItem('sessionDuration', sessionDuration.toString());

        },
        error: (err) => {
          console.error('Login failed', err);
        }
      });
  }

  getLogin() {
    console.log('Email:', this.email, 'Password:', this.password);
  
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // Check if the response is an empty object
        if (!response || Object.keys(response).length === 0) {
          alert('Invalid credentials');
          throw new Error('Login failed: empty response object');
        }
  
        console.log('Login successful', response);
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userDetails',JSON.stringify(response.userDetails));
        this.router.navigate(['/user']);
        const sessionStart = new Date().getTime();
        const sessionDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
        sessionStorage.setItem('sessionStartTime', sessionStart.toString());
        sessionStorage.setItem('sessionDuration', sessionDuration.toString());

      },
      error: (error) => {
        console.error('Login failed', error);
        alert('Invalid credentials');
      },
    });
  }
  
  insertUser() {
    const newUser = {
      name: this.name,
      email: this.email,
      password: this.password,
    };

    this.authService.register(newUser).subscribe({
      next: (response) => {
        if (!response || Object.keys(response).length === 0) {
          alert('Registration failed');
          return;
        }
        alert('Registration successful');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error during registration', err);
        alert('Registration failed');
      },
    });
  }

}
