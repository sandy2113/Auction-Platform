import { Injectable, NgZone } from '@angular/core';
import { Client, IMessage, Stomp, StompSubscription } from '@stomp/stompjs';
import { ToastrService } from 'ngx-toastr';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client'; // ✅ Correct for using `new SockJS(...)`
import { v4 as uuidv4 } from 'uuid';
import { BidService } from './services/bid.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public sessionId: string;
  private stompClient!: Client;
  private bidSubject: Subject<any> = new Subject();
  private activeUsersSubject = new BehaviorSubject<string[]>([]);
  public activeUsers = this.activeUsersSubject.asObservable();
  users:any[]=[];
  private toastSubscription: StompSubscription | null = null;

  constructor(private toastr: ToastrService,private ngZone: NgZone,private bidService:BidService) {
    let storedSessionId = sessionStorage.getItem('sessionId');

    if (!storedSessionId) {
      storedSessionId = uuidv4();
      sessionStorage.setItem('sessionId', storedSessionId);
    }
  
    this.sessionId = storedSessionId;

    this.stompClient = new Client({
      brokerURL: '', // leave empty if using SockJS
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      debug: (str) => {
        console.log('[STOMP DEBUG]', str);
      }
    });
  }


  
  connect(auctionId: string, userId: string): void {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = new Client({ webSocketFactory: () => socket });  

    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe();
      this.toastSubscription = null;
    }
    this.stompClient.onConnect = () => {
      console.log('✅ Connected to WebSocket');
  
      // 1️⃣ Notify server that user joined
      this.stompClient.publish({
        destination: '/app/join',
        body: JSON.stringify({
          auctionId,
          user: userId,
          sessionId: this.sessionId
        })
      });
  
      // 2️⃣ Subscribe to user list updates
      this.stompClient.subscribe(`/topic/auction/${auctionId}/users`, (msg: IMessage) => {
        this.users = Object.values(JSON.parse(msg.body));
        console.log('Active users:', this.users);
        this.activeUsersSubject.next(this.users);
      });
      this.subscribeToToast(auctionId);

      // Subscribe to bid updates
      this.stompClient.subscribe(`/topic/auction/${auctionId}/bids`, (message: any) => {
        const bidData = JSON.parse(message.body);
        console.log('Received bid updates:------------------------------------------------>', bidData);
        this.bidService.updateBids(bidData);
      });
      
    };
  
    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers['message']);
      console.error('Details:', frame.body);
    };
  
    this.stompClient.activate(); // 🔄 Starts the connection
  }
  
  
  sendBid(bid: any,auctionId:any): void {
    if (this.stompClient && this.stompClient.connected) {
      console.log("PUSHING TO SERVICE------------->",bid);
      this.stompClient.publish({
        destination: `/app/auction/${auctionId}/bid`,
        body: JSON.stringify(bid)
      });
    }
  }

  leaveAuctionRoom(auctionId: string, userId: string) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/leave',
        body: JSON.stringify({
          auctionId,
          userId
        })
      });
    }
  }

  getBids(): Observable<any> {
    return this.bidSubject.asObservable();
  }

  sendJoinMessage(auctionId: string, username: string) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: `/app/join/${auctionId}`,
        body: JSON.stringify({ auctionId, username })
      });
    }
  }
  
  listenToRoomUsers(auctionId: string): Observable<string[]> {
    return new Observable(observer => {
      this.stompClient?.subscribe(`/topic/room-users/${auctionId}`, message => {
        const userList = JSON.parse(message.body);
        observer.next(userList);
      });
    });
  }

  public subscribeToToast(auctionId: string) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.warn('WebSocket not connected yet. Toast subscription skipped.');
      return;
    }
  
    if (this.toastSubscription) return;
  
    this.toastSubscription = this.stompClient.subscribe(
      `/topic/auction/${auctionId}/toast`,
      (msg: IMessage) => {
        const data = JSON.parse(msg.body);
        console.log('🔔 Toast Received:', data);
    console.log('My sessionId:', this.sessionId);
    console.log('Received sessionId:', data.sessionId);

    if (this.sessionId !== data.sessionId) {
      this.ngZone.run(() => {
        this.toastr.info(`User ${data.name} has joined the room`, 'New User');
      });
    } else {
      console.log('🚫 Toast skipped (own join)');
    }
      }
    );
  }

  subscribeToAuctionBids(auctionId: string, callback: (bid: any) => void) {
    console.log("in subscribeToAuctionBids------------------------------");
    this.stompClient.subscribe(`/topic/auction/${auctionId}/bids`, (message: any) => {
      const bidData = JSON.parse(message.body);
      callback(bidData);
    });}
  

public unsubscribeFromToast() {
  this.toastSubscription?.unsubscribe();
  this.toastSubscription = null;
}

  
}

