import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Bid } from '../components/auction-room/auction-details.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BidService {
  // private bidListSource = new BehaviorSubject<any[]>([]);

  private activeUsersSubjectMap = new Map<string, BehaviorSubject<any>>();

  private bidsSubject = new BehaviorSubject<any[]>([]);
  bids$ = this.bidsSubject.asObservable();
  private modalTriggerSubject = new Subject<{ message: string, auctionId: string }>();
  modalTrigger$ = this.modalTriggerSubject.asObservable();
  constructor(private http:HttpClient) {}

  updateBids(newBid: any[]) {
    const currentBids = this.bidsSubject.value;
    const updatedBids = [newBid, ...currentBids]; // push new bid to top
    this.bidsSubject.next(updatedBids);
  }

  triggerModal(message: string, auctionId: string) {
    this.modalTriggerSubject.next({ message, auctionId });
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


  private getOrCreateActiveUserSubject(auctionId: string): BehaviorSubject<string[]> {
    if (!this.activeUsersSubjectMap.has(auctionId)) {
      this.activeUsersSubjectMap.set(auctionId, new BehaviorSubject<string[]>([]));
    }
    return this.activeUsersSubjectMap.get(auctionId)!;
  }

}
