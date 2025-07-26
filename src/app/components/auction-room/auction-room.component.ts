import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AUCTION_ITEMS } from 'src/app/data/auction-items';
import { AuthService } from 'src/app/login/authservice';
import { AuctionDetails } from './auction-details.model';
import { HttpErrorResponse } from '@angular/common/http';
import { WebsocketService } from 'src/app/websocket.service';
import { ToastrService } from 'ngx-toastr';
import { BidService } from 'src/app/services/bid.service';

@Component({
  selector: 'app-auction-room',
  templateUrl: './auction-room.component.html',
  styleUrls: ['./auction-room.component.scss']
})
export class AuctionRoomComponent implements OnInit {
  productId: string = '';
  auctionId!: string;
  auctionData!: AuctionDetails;

  product: any;
  newBidAmount: number = 0;
  bids: any[] = [];
  userId:any;
  currentBid: number = 0;

  readonly IMAGE_BASE_PATH = this.auctionService.imagePath;
  activeUsers: string[] | undefined;
  activeUsersWithColor: { id: string ,color:string,badge:string}[] = [];
  auctionOver: boolean=false;
  constructor(
    private route: ActivatedRoute,
    private auctionService: AuthService,
    private websocketService: WebsocketService,
    private toastr: ToastrService,
    private bidService: BidService
  ) {}

  usersInRoom: string[] = [];

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.auctionId = this.productId;  
    const user = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    this.userId = user.userId;
    console.log("PRODUCT ID ISSS",this.auctionId,"++++++++++",this.productId);
    this.websocketService.connect(this.auctionId, this.userId,(msg: string) => {
      console.log("connecting to websocket");
      if (msg === 'Auction is over') {
        this.auctionOver = true;
      }
    });
    // this.websocketService.getActiveUsersObservable(this.auctionId).subscribe(users => {
    //   console.log("!!!!!!!!!!!!!",users);
    //   this.activeUsers = users;
    // });
  }

  ngOnDestroy(): void {
    this.websocketService.leaveAuctionRoom(this.auctionId, this.userId);
    this.websocketService.unsubscribeFromToast();

  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: any): void {
    this.websocketService.leaveAuctionRoom(this.auctionId, this.userId);
  }
  
  // placeBid() {
  //     const bid = {
  //       productId: this.productId,
  //       bidAmount: this.newBidAmount,
  //       user: 'CurrentUser',
  //       time: new Date()
  //     };
  //     this.websocketService.sendBid(bid);
  // }

  // loadAuctionData(id: string): void {
  //   this.auctionService.getAuctionDetails(id).subscribe({
  //     next: (data: AuctionDetails) => {
  //       this.product = {
  //         ...data,
  //         image: this.IMAGE_BASE_PATH + data.image,
  //         bids: [],
  //         currentBid: data.startingBid
  //       };
  //       this.currentBid = this.product.currentBid;
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       console.error('Failed to fetch auction data', err);
  //     },
  //   });
  // }


  getColorFromUUID(uuid: string): string {
    const hash = uuid.replace(/-/g, '').substring(0, 6);
    return `#${hash}`;
  }
}
