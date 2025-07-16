import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CreateAuctionComponent } from '../create-auction/create-auction.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss']
})
export class ListingsComponent {
   totalAuctions = 0;
    pageSize = 10;
  
    constructor(private http: HttpClient,private dialog: MatDialog) {}
  
   auctions: any[] = [];
  
  ngOnInit(): void {
    this.http.get<any[]>('assets/my-bids.json').subscribe(data => {
      // Convert date strings to Date objects
      this.auctions = data.map(item => ({
        ...item,
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
        bidHistory: item.bidHistory.map((bid: any) => ({
          ...bid,
          time: new Date(bid.time)
        }))
      }));
    });
  }
  
    loadAuctions() {
      // Call your API, populate this.auctions
    }
  
    onPageChange(event: any) {
      // handle pagination logic
    }
  
    openHistoryDialog(auction: any) {
      // this.dialog.open(BidHistoryDialogComponent, {
      //   width: '600px',
      //   data: auction
      // });
    }

    openCreateAuctionDialog() {
  const dialogRef = this.dialog.open(CreateAuctionComponent, {
    width: '600px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Add the new auction to your auctions array
      console.log('Auction Created:', result);
      this.auctions.push({
        ...result,
        status: 'Upcoming',
        currentBid: 0,
        productImage: this.getProductImage(result.productId),
      });
      this.auctions = [...this.auctions];
    }
  });
}

getProductImage(productId: string) {
  // Lookup product image based on your list of products
  // const product = this.products.find((p: { id: string; }) => p.id === productId);
  // return product?.image || '';
}
}
