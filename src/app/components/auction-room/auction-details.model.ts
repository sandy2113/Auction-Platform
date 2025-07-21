export interface Bid {
    amount: number;
    user: string;
    time: string; // or Date if you convert
  }
  export interface BidDetails {
    amount: number;
    userId: string;
    time: string;
    auctionId:string // or Date if you convert
  }
  
  export interface AuctionDetails {
    startingBid: number;
    id: string;
    name: string;
    currentBid: number;
    timeRemaining: string;
    status: string;
    image: string;
    bids: Bid[];
    participants: string[];
  }

  export interface AuctionProductDTO{
    auctionId :string;
    productName:string;
    finalPrice : string;
    status :string
    bidHistory : any;
    startDate : string;
    endDate  : string;
    productImage  : string;
    auctionName :  string; 
  }
  