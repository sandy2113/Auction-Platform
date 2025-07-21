import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Bid } from '../components/auction-room/auction-details.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BidService {
  // private bidListSource = new BehaviorSubject<any[]>([]);
  private bidsSubject = new BehaviorSubject<any[]>([]);
  bids$ = this.bidsSubject.asObservable();

  constructor(private http:HttpClient) {}

  updateBids(newBid: any[]) {
    const currentBids = this.bidsSubject.value;
    const updatedBids = [newBid, ...currentBids]; // push new bid to top
    this.bidsSubject.next(updatedBids);
  }

  addBid(bid: any) {
    const current = this.bidsSubject.getValue();
    this.bidsSubject.next([bid, ...current]);
  }
  getBids(): Observable<Bid[]> {
    return this.bidsSubject.asObservable();
  }
  getBidsForAuction(auctionId: string) {
    return this.http.get<any[]>(`http://localhost:8080/api/auction/${auctionId}/bids`);
  }

}
