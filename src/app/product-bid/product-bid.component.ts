import { Component } from '@angular/core';
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

export class ProductBidComponent {
  activeUsers: any[] | undefined;
  constructor(
    private route: ActivatedRoute,
    private auctionService: AuthService,
    private websocketService: WebsocketService
  ) {}
  ngOnInit(){
    this.websocketService.activeUsers.subscribe(users => {
      this.activeUsers = users;
    });
  }
}
