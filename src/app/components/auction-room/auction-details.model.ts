export interface Bid {
    amount: number;
    user: string;
    time: string; // or Date if you convert
  }
  
  export interface AuctionDetails {
    id: string;
    name: string;
    currentBid: number;
    timeRemaining: string;
    status: string;
    image: string;
    bids: Bid[];
    participants: string[];
  }
  