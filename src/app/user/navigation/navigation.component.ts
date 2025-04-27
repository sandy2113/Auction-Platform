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
    { icon: 'history', label: 'Browse Auctions', route: '/user/search' },
    { icon: 'bar_chart', label: 'My Bids' },
    { icon: 'account_balance_wallet', label: 'My Listings' },
    { icon: 'dashboard', label: 'Notifications' },
    { icon: 'history', label: 'Payment History' },
    { icon: 'bar_chart', label: 'Payout Settings' },
    { icon: 'account_balance_wallet', label: 'Profile Settings' },
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
