export interface AuctionProduct {
    id: string;
    name: string;
    startingBid: number;
    currentBid: number;
    startTime: string;
    endTime: string;
    imagePath: string;
    status: string;
    createdAt: string;
    sellerId: string;
  }