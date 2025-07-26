import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../login/authservice';
import { WebsocketService } from '../websocket.service';
// ecommerce card
interface productCards {
  userId: number;
  // title: string;
}

@Component({
  selector: 'app-product-bid',
  templateUrl: './product-bid.component.html',
  styleUrls: ['./product-bid.component.scss']
})

export class ProductBidComponent{
  activeUsers: any[] = [];
  auctionId!: string;
  constructor(
    private route: ActivatedRoute,
    private auctionService: AuthService,
    private websocketService: WebsocketService
  ) {}
  ngOnInit(){
    // this.websocketService.activeUsers.subscribe(users => {
    //   this.activeUsers = users;
    // });
    // this.websocketService.getActiveUsersObservable(this.auctionId).subscribe(users => {
    //   this.activeUsers = users;
    // });
    this.auctionId = this.route.snapshot.paramMap.get('id') || '';
    const user = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    this.websocketService.connect(this.auctionId, user.userId, () => {});
    this.websocketService.getActiveUsersObservable(this.auctionId).subscribe(users => {
      console.log(" INSIDE BID COMPONENT--!!!!!!!!!!!!!",users);
      this.activeUsers = users;
    });
  }
}
