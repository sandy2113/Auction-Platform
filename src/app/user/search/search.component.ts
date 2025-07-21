import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/login/authservice';
import { AuctionProductDTO } from 'src/app/components/auction-room/auction-details.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  totalAuctions = 0;
  pageSize = 10;
  auctionsDetails:any =[];
  constructor(private http: HttpClient,private authService:AuthService,private router:Router) {}
  readonly IMAGE_BASE_PATH = this.authService.imagePath;
 auctions: any[] = [];
 isSubscribed : boolean =false;

ngOnInit(): void {
  this.loadAuctions();
  // this.loadStaticData();
}

loadStaticData(){
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
    const user = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    const userId = user.userId;
    this.authService.getAllAuctionProducts(userId).subscribe({
      next: (data: AuctionProductDTO[]) => {
        console.log('Auction Data:', data);
    
        // Assuming each item has productImage
        this.auctions = data.map(product => ({
          ...product,
          productImage: this.IMAGE_BASE_PATH + product.productImage
        }));
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch auction data', err);
      },
    });
    
    // Call your API, populate this.auctions
  }

  onPageChange(event: any) {
    // handle pagination logic
  }

  subscribeToAuction(productId:any,event:any){
    const user = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    const userId = user.userId;

    this.authService.subscribeToAuction(productId, userId).subscribe({
      next: (res: { productId: string; subscribed: boolean }) => {
        const targetProduct = this.auctions.find(p => p.auctionId === res.productId);
        if (targetProduct) {
          targetProduct.subscribed = res.subscribed;
        }
      },
      error: () => {
        alert('Subscription failed');
      }
    });
    console.log(this.auctions);
  }
  

  openHistoryDialog(auction: any) {
    // this.dialog.open(BidHistoryDialogComponent, {
    //   width: '600px',
    //   data: auction
    // });
  }

  redirectToRoom(id:any){
    this.router.navigate(['/user/auction',id]);
  }

} 

