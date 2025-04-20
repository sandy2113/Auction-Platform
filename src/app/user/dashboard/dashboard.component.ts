import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    constructor(private http: HttpClient, private route: ActivatedRoute) {}
  ngOnInit(): void {
    console.log("helooo");
    // This will trigger after the Google redirect completes.
    // If you're using the One Tap button or Sign-in button:
    this.initializeGoogleSignIn();

    // Or if you're using OAuth redirect, you'll check the URL for the token
    const idToken = this.route.snapshot.queryParamMap.get('id_token');
    if (idToken) {
      this.sendTokenToBackend(idToken);  // send the token to backend for verification
    }
  }

  initializeGoogleSignIn(): void {
    console.log("helooo");
    google.accounts.id.initialize({
      client_id: '181383326350-sordhji70sehh00h661rmlgjai0bn5n4.apps.googleusercontent.com',
      callback: (response: any) => {
        console.log("helooo",response);
        // The ID token is available here
        const idToken = response.credential;
        this.sendTokenToBackend(idToken);  // send it to the backend to verify and store
      }
    });

    google.accounts.id.renderButton(
      document.getElementById('googleBtn'),
      { theme: 'outline', size: 'large' }
    );
  }

  sendTokenToBackend(idToken: string): void {
    // Send the token to your Spring Boot backend
    this.http.post('http://localhost:8080/api/auth/google', { idToken })
      .subscribe({
        next: (res) => {
          console.log('Backend response:', res);
          // After backend processes, you can store additional info in localStorage/sessionStorage
          // Or handle user redirection if needed
        },
        error: (err) => {
          console.error('Error sending token to backend:', err);
        }
      });
  }


}
