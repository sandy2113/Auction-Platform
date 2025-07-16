import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AUCTION_ITEMS } from 'src/app/data/auction-items';
import { AuthService } from 'src/app/login/authservice';
import { AuctionDetails } from './auction-details.model';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-auction-room',
  templateUrl: './auction-room.component.html',
  styleUrls: ['./auction-room.component.scss']
})
export class AuctionRoomComponent implements OnInit {
  constructor(private route: ActivatedRoute,private auctionService:AuthService) {}
  productId: string = '';
  product: any;
  newBidAmount: number = 0;
  auctionId!: string;
  auctionData!: AuctionDetails;
  readonly IMAGE_BASE_PATH = this.auctionService.imagePath;

  ngOnInit() {
    console.log("heloss fetching in action room");
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.loadAuctionData(this.productId);
  }

  getDummyProductById(id: string) {
      // items = AUCTION_ITEMS;
    return AUCTION_ITEMS.find(p => p.id === id);
  }

  placeBid() {
    if (this.newBidAmount > this.product.currentBid) {
      this.product.bids.push({
        amount: this.newBidAmount,
        user: 'CurrentUser', // Later: fetch from session
        time: new Date()
      });
      this.product.currentBid = this.newBidAmount;
      this.newBidAmount = 0;
    } else {
      alert('Bid must be higher than current bid.');
    }
  }

  loadAuctionData(id: string): void {
    this.auctionService.getAuctionDetails(id).subscribe({
      next: (data: AuctionDetails) => {
        console.log('Auction Data:', data);
        this.product = {
          ...data,
          image: this.IMAGE_BASE_PATH + data.image  // assuming 'image' is the correct field (not imagePath)
        };
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch auction data', err);
      },
    });
  }
  
}
