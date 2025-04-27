import { Injectable } from '@angular/core';
import { NavigationComponent } from './user/navigation/navigation.component';

@Injectable({
  providedIn: 'root'
})
export class AuctionServiceService {
  private drawerContainer?: NavigationComponent;

  registerDrawer(container: NavigationComponent) {
    this.drawerContainer = container;
  }

  toggleDrawer() {
    console.log("ddsassdf");
    console.log(this.drawerContainer);
    this.drawerContainer?.toggleDrawer();
  }

  openDrawer() {
    this.drawerContainer?.openDrawer();
  }

  closeDrawer() {
    this.drawerContainer?.closeDrawer();
  }
}
