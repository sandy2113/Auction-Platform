import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bids',
  templateUrl: './bids.component.html',
  styleUrls: ['./bids.component.scss']
})
export class BidsComponent {
  totalAuctions = 0;
  pageSize = 10;

  constructor(private http: HttpClient) {}

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


}
