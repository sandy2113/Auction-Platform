import { AfterViewInit, Component, ViewChild,OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { AuctionServiceService } from 'src/app/auction-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements AfterViewInit,OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  userDetails:any;
  sessionEndsIn: string = '';
private intervalId: any;
private sessionDuration = 0;
private sessionStartTime = 0;
private sessionTimeout = 5 * 60 * 1000; // 5 minutes in ms
private timeoutHandle: any;
private countdownIntervalId: any;


  constructor(private drawerService: AuctionServiceService,private router:Router) {}

  ngOnDestroy(): void {
    if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
  }
  

  ngOnInit(): void {
    // your init code
    this.getUserDetails();
    this.resetSessionTimer(); // start initially
    this.listenToUserActivity(); // detect activity
  };

  resetSessionTimer(): void {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
  
    const expireTime = new Date().getTime() + this.sessionTimeout;
    this.startCountdown(expireTime); // update display
  
    this.timeoutHandle = setTimeout(() => {
      this.logout();
    }, this.sessionTimeout);
  }
  
  startSessionCountdown(expireAt: number): void {
    const updateCountdown = () => {
      const now = Date.now();
      const totalSeconds = Math.floor((expireAt - now) / 1000);
  
      if (totalSeconds <= 0) {
        clearInterval(this.countdownIntervalId);
        this.sessionEndsIn = 'Session expired';
        this.logout();
      } else {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        this.sessionEndsIn = `Session ends in ${minutes} min ${seconds < 10 ? '0' : ''}${seconds}s`;
      }
    };
  
    // Clear any existing interval to prevent overlapping
    clearInterval(this.countdownIntervalId);
  
    updateCountdown(); // Run once immediately
    this.countdownIntervalId = setInterval(updateCountdown, 1000);
  }
  

  private getUserDetails() {
    const userJson = sessionStorage.getItem('userDetails');
    if (userJson !== null) {
      const user = JSON.parse(userJson);
      this.userDetails=user;
      console.log("User details:", user);
    } else {
      console.warn("No user details found in session");
    }

  }

  private intervalTime(){
    const start = sessionStorage.getItem('sessionStartTime');
    const duration = sessionStorage.getItem('sessionDuration');
  
    if (start && duration) {
      this.sessionStartTime = parseInt(start, 10);
      this.sessionDuration = parseInt(duration, 10);
  
      const now = new Date().getTime();
      const timeElapsed = now - this.sessionStartTime;
      let timeLeft = this.sessionDuration - timeElapsed;
  
      if (timeLeft <= 0) {
        this.logout(); // session expired
      } else {
        this.startSessionCountdown(timeLeft);
      }
    } else {
      this.logout(); // fallback for missing session data
    }
  }

  startCountdown(expireAt: number): void {
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const remaining = expireAt - now;
  
      if (remaining <= 0) {
        clearInterval(intervalId);
        this.sessionEndsIn = 'Session expired';
      } else {
        const minutes = Math.floor(remaining / 1000 / 60);
        const seconds = Math.floor((remaining / 1000) % 60);
        this.sessionEndsIn = `Session ends in ${minutes} min ${seconds}s`;
      }
    }, 1000);
  }
  
  listenToUserActivity(): void {
    const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'click'];
    events.forEach(event =>
      window.addEventListener(event, this.resetSessionTimer.bind(this))
    );
  }
  

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  
  
  ngAfterViewInit() {
    console.log("qqqqqqqq",this.drawer);
    this.drawerService.registerDrawer(this);
  }

  toggleDrawer() {
    console.log("eeeesasdsaddf");
    this.drawer.toggle();
  }

  openDrawer() {
    this.drawer.open();
  }

  closeDrawer() {
    this.drawer.close();
  }

  bankingItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/user/dashboard' },
    { icon: 'search', label: 'Browse Auctions', route: '/user/search' },
    { icon: 'view_list', label: 'My Bids', route: '/user/bids' },
    { icon: 'business', label: 'My Listings', route: '/user/listings' },
    { icon: 'notifications', label: 'Notifications', route: '/user/notification' },
    { icon: 'history', label: 'Payment History', route: '/user/history' },
    { icon: 'payment', label: 'Payout Settings', route: '/user/payment'},
    { icon: 'settings', label: 'Profile Settings', route: '/user/setting' },
  ];

  // serviceItems = [
  //   { icon: 'mail', label: 'Messages' },
  //   { icon: 'folder', label: 'Documents' },
  //   { icon: 'apps', label: 'Products' },
  // ];

  // otherItems = [
  //   { icon: 'help', label: 'Help' },
  //   { icon: 'settings', label: 'Settings' },
  // ];
}
