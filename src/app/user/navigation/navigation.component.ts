import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { AuctionServiceService } from 'src/app/auction-service.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements AfterViewInit {
  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(private drawerService: AuctionServiceService) {}

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
