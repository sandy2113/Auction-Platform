import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuctionDetails } from '../components/auction-room/auction-details.model';
import { AuthService } from '../login/authservice';
import { WebsocketService } from '../websocket.service';
import { BidService } from '../services/bid.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

interface stats {
  id: number;
  time: string;
  color: string;
  title?: string;
  subtext?: string;
  link?: string;
}
@Component({
  selector: 'app-recents-bids',
  templateUrl: './recents-bids.component.html',
  styleUrls: ['./recents-bids.component.scss']
})
export class RecentsBidsComponent {
  productId: string | undefined;
  auctionId: string | undefined;
auctionEndTime!: Date;
timeRemaining: string = '';
placeBidDisabled: boolean = false;
bidAmount: number = 0;
  userId: any;
  bids: any;
  liveAmount: number=0;
  currentuserId:any;
  // private liveAmount = new BehaviorSubject<any>([]);
  private activeUsersSubject = new BehaviorSubject<string[]>([]);
  isValid: boolean=false;
  previousBids: any[]=[];
  liveBids: any;
  liveUserId: any;


    constructor(
      private route: ActivatedRoute,
      private auctionService: AuthService,
      private websocketService: WebsocketService,
      private toastr: ToastrService,
      private bidService: BidService,
      private http:HttpClient
    ) {
      const user = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
      this.currentuserId=user.userId;
    }

    product: any;
    readonly IMAGE_BASE_PATH = this.auctionService.imagePath;

    ngOnInit(){
      this.productId = this.route.snapshot.paramMap.get('id') || '';
      this.auctionId = this.productId;
      this.startAuction(this.productId);
      console.log("productId",this.productId,"auctionId",this.auctionId);  
      this.loadAuctionData(this.productId);
      setInterval(() => {
        this.updateTimeRemaining();
      }, 1000); // Update every second

      this.bidService.getBidsForAuction(this.productId).subscribe((bids: any[]) => {
        console.log("getting bids from db",bids);
      if (bids.length > 0) {
      this.liveAmount = bids[0].amount;
      this.liveUserId = bids[0].userId; // set this from DB in case WebSocket is not quick
    }
        this.previousBids = bids;
        this.recalculateBidValidity();
        console.log("((((((((",this.currentuserId,this.liveUserId)
      });
      // for live amount update
      this.bidService.getBids().subscribe((allBids:any) => {

        //
        this.liveBids= allBids.filter((bid: { auction: { id: any; }; }) => bid.auction.id === this.productId).map((bid: any) => ({
          amount: bid.amount,
          userId: bid.bidder.id,
          name: bid.bidder.name,
          auctionId: bid.auction.id,
          bidTime: bid.bidTime
        }));
        console.log("live bids ",this.liveBids);
        this.bids = [...this.liveBids, ...this.bids];
        this.liveUserId=this.bids[0].userId;
        this.liveAmount=this.bids[0].amount;
        console.log("live amount updating---------------------",this.liveAmount);
      });
    }

    recalculateBidValidity() {
      const bid = parseFloat(this.bidAmount as any);
      const live = parseFloat(this.liveAmount as any);
      const current = parseFloat(this.product?.currentBid as any);
    
      const requiredMin = Math.max(current || 0, live || 0);
    
      if (this.liveAmount > 0) {
        this.isValid = bid > this.liveAmount;
      } else {
        this.isValid = bid >= requiredMin;
      }
    }
    

trackByTitle(index: number, stat: any): string {
    return stat.title;
  }
      loadAuctionData(id: string): void {
      console.log("productId",id,"auctionId",this.auctionId);  
      this.auctionService.getAuctionDetails(id).subscribe({
        next: (data: AuctionDetails) => {
          this.product = {
            ...data,
            image: this.IMAGE_BASE_PATH + data.image,
            bids: [],
            currentBid: data.currentBid
          };
          // this.currentBid = this.product.currentBid;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to fetch auction data', err);
        },
      });
    }

    updateTimeRemaining() {
      const now = new Date().getTime();
      const end = new Date(this.auctionEndTime).getTime();
      const diff = end - now;
    
      if (diff <= 0) {
        this.timeRemaining = "Auction Ended";
        this.placeBidDisabled = true;
      } else {
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        this.timeRemaining = `${minutes}m ${seconds}s`;
        this.placeBidDisabled = false;
      }
    }

    placeBid(bidAmount:any) {
      const user = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
      this.userId = user.userId;
      
      const bid = {
        userId: this.userId,
        amount: bidAmount,
        status: 'Pending',
        auctionId:this.auctionId
      };
      this.liveAmount=bidAmount;
      this.bidAmount=0;
      console.log("sending to service-------------------------",bid);
      this.websocketService.sendBid(bid,this.productId); // ✅ Send via WebSocket if needed
      console.log(")))))))))))",this.currentuserId,this.liveUserId)
    }

    get bidClass(): string {
      const bid = parseFloat(this.bidAmount as any);
      const current = parseFloat(this.product?.currentBid as any);
      const live = parseFloat(this.liveAmount as any);
    
      const requiredMin = Math.max(current || 0, live || 0);
    
      if(this.liveAmount>0){
         if(this.bidAmount>this.liveAmount){
          this.isValid=true;
         }
         else{
          this.isValid=false;
         }
      }
      else if (bid >= requiredMin) {
        this.isValid=true;
        return 'border-success';
      } else if (!isNaN(bid)) {
        this.isValid=false;
        return 'border-danger';
      }
      return '';
    }
    
    startAuction(auctionId: string) {
      this.auctionService.startAuction(auctionId).subscribe(() => {
      });
    }
}
