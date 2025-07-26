import { Component, OnDestroy, OnInit } from '@angular/core';
import { BidService } from '../services/bid.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Bid } from '../components/auction-room/auction-details.model';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-product-bids-details',
  templateUrl: './product-bids-details.component.html',
  styleUrls: ['./product-bids-details.component.scss']
})
export class ProductBidsDetailsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['product', 'progress', 'status', 'sales'];
  private bidSubscription!: Subscription;
  productId: any;
  previousBids: any[]=[];
  liveBids: any;
  constructor(private bidService: BidService,private route:ActivatedRoute){
  }
  ngOnDestroy(): void {
    this.bidSubscription.unsubscribe();
  }
  auctionId: string = '';
  bids: any[] = [];
  currentPage: number = 1;
  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || '';

    this.bidService.getBidsForAuction(this.productId).subscribe((bids: any[]) => {
      console.log("getting bids from db",bids);
      if (bids.length > 0) {
        this.bids=bids;
        this.previousBids = bids;
      }

    });
    this.bidService.getBids().subscribe((allBids:any) => {
      this.liveBids= allBids.filter((bid: { auction: { id: any; }; }) => bid.auction.id === this.productId).map((bid: any) => ({
        amount: bid.amount,
        userId: bid.bidder.id,
        name: bid.bidder.name,
        auctionId: bid.auction.id,
        bidTime: bid.bidTime
      }));
      console.log("live bids ",this.liveBids);
      this.bids = [...this.liveBids, ...this.bids];
    });
  }

  selectedMonth = 'mar'; // default selected
trackByMonthValue(index: number, month: any): string {
  return month.value;
}
products :any[]= [];
trackByProductId(index: number, item: any): string {
  return item.id; // or whatever unique identifier you have
}

 getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'high': return 'status-high';
      case 'medium': return 'status-medium';
      case 'low': return 'status-low';
      default: return 'status-default';
    }
  }

  getRandomClass(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 10); // 10 different classes
}
getRandomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}


getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = '#' + ((hash >> 24) & 0xFF).toString(16).padStart(2, '0') +
                      ((hash >> 16) & 0xFF).toString(16).padStart(2, '0') +
                      ((hash >> 8) & 0xFF).toString(16).padStart(2, '0');
  return color;
}
}
