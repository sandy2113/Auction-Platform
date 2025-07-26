import { Component, OnInit } from '@angular/core';
import { BidService } from '../services/bid.service';
import { WebsocketService } from '../websocket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {

  constructor(private bidService:BidService,private websocketService: WebsocketService,private router:Router){}

  ngOnInit(): void {
    this.bidService.modalTrigger$.subscribe((data) => {
      this.auctionMessage = data.message;
      this.visible = true;
      console.log("acutionId isss",data.auctionId);
      this.websocketService.unsubscribeFromAuctionTopics(data.auctionId);
    });
  }

  handleDialogClose() {
    this.router.navigate(['/user/search']); // 👈 or wherever you want to go
  }
  visible: boolean = false;
  auctionMessage: string = '';
  showDialog() {
    this.visible = true;
  }

}
