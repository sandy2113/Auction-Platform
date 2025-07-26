import { Injectable, NgZone } from '@angular/core';
import { Client, IMessage, Stomp, StompSubscription } from '@stomp/stompjs';
import { ToastrService } from 'ngx-toastr';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client'; // ✅ Correct for using `new SockJS(...)`
import { v4 as uuidv4 } from 'uuid';
import { BidService } from './services/bid.service';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public sessionId: string;
  private stompClient!: Client;
  private bidSubject: Subject<any> = new Subject();
  // private activeUsersSubject = new BehaviorSubject<string[]>([]);
  // public activeUsers = this.activeUsersSubject.asObservable();
  connectedAuctions: Set<string> = new Set();

  private auctionUsersMap = new Map<string, any>();
  private activeUsersSubjectMap = new Map<string, BehaviorSubject<any>>();

  users:any[]=[];
  private toastSubscription: StompSubscription | null = null;
  private subscriptionsMap: Map<string, StompSubscription> = new Map();
  constructor(private toastr: ToastrService,private ngZone: NgZone,private bidService:BidService,private dialog:MatDialog) {
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


  
  // connect(auctionId: string, userId: string,onMessageCallback: (msg: string) => void): void {
  //   const socket = new SockJS('http://localhost:8080/ws');
  //   this.stompClient = new Client({ webSocketFactory: () => socket });  

  //   if (this.toastSubscription) {
  //     this.toastSubscription.unsubscribe();
  //     this.toastSubscription = null;
  //   }
  //   this.stompClient.onConnect = () => {
  //     console.log('✅ Connected to WebSocket');
  
  //     // 1️⃣ Notify server that user joined
  //     this.stompClient.publish({
  //       destination: '/app/join',
  //       body: JSON.stringify({
  //         auctionId,
  //         user: userId,
  //         sessionId: this.sessionId
  //       })
  //     });
  
  //     // 2️⃣ Subscribe to user list updates
  //     this.stompClient.subscribe(`/topic/auction/${auctionId}/users`, (msg: IMessage) => {
  //       this.users = Object.values(JSON.parse(msg.body));
  //       console.log('Active users:', this.users);
  //       this.activeUsersSubject.next(this.users);
  //     });
  //     this.subscribeToToast(auctionId);

  //     // Subscribe to bid updates
  //     this.stompClient.subscribe(`/topic/auction/${auctionId}/bids`, (message: any) => {
  //       const bidData = JSON.parse(message.body);
  //       console.log('Received bid updates:------------------------------------------------>', bidData);
  //       this.bidService.updateBids(bidData);
  //     });
      
  //     //time over subscribing
  //     this.stompClient.subscribe(`/topic/auction/auctionOver/auctionId${auctionId}`, (message: IMessage) => {
  //       this.ngZone.run(() => {
  //         const msg = message.body;
  //         this.bidService.triggerModal(msg); 
  //         console.log('Auction message received:', msg);
  //         this.toastr.info(msg); // Optional user toast
  //         onMessageCallback(msg); // Call the callback with the message
          
  //         // this.ngZone.run(() => {
  //         // });
      
  //         // this.disconnect()


  //       });
  //     });
  //   };
  
  //   this.stompClient.onStompError = (frame) => {
  //     console.error('STOMP error:', frame.headers['message']);
  //     console.error('Details:', frame.body);
  //   };
  
  //   this.stompClient.activate(); // 🔄 Starts the connection
  // }

  connect(auctionId: string, userId: string, onMessageCallback: (msg: string) => void): void {
    console.log("INSIDE CONNECT",auctionId,"-----",userId);

  this.connectedAuctions.add(auctionId);
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = new Client({ webSocketFactory: () => socket });
  
    this.stompClient.onConnect = () => {
      console.log('✅ Connected to WebSocket');
  
      // Notify server that user joined
      this.stompClient.publish({
        destination: '/app/join',
        body: JSON.stringify({
          auctionId,
          user: userId,
          sessionId: this.sessionId
        })
      });

    //   const usersSub = this.stompClient.subscribe(`/topic/auction/${auctionId}/users`, (msg: IMessage) => {
    //   const users = Object.values(JSON.parse(msg.body));
    //   console.log(`👥 Active users [${auctionId}]:`, users);
    //   const subject = this.activeUsersSubjectMap.get(auctionId);
    //   subject?.next(users);
    // });
    // this.subscriptionsMap.set(`users-${auctionId}`, usersSub);

    const usersSub = this.stompClient.subscribe(`/topic/auction/${auctionId}/users`, (msg: IMessage) => {
      const users = Object.values(JSON.parse(msg.body))as string[];
      console.log(`👥 Active users [${auctionId}]:`, users);
      const subject = this.getOrCreateActiveUserSubject(auctionId);
      subject.next(users);
    });
    this.subscriptionsMap.set(`users-${auctionId}`, usersSub);

  
      // 🔔 Subscribe to toast messages
      const toastSub = this.stompClient.subscribe(`/topic/auction/${auctionId}/toast`, (msg: IMessage) => {
        const data = JSON.parse(msg.body);
        if (this.sessionId !== data.sessionId) {
          this.ngZone.run(() => {
            this.toastr.info(`User ${data.name} has joined the room`, 'New User');
          });
        }
      });
      this.subscriptionsMap.set(`toast-${auctionId}`, toastSub);
  
      // 🔔 Subscribe to bid updates
      const bidsSub = this.stompClient.subscribe(`/topic/auction/${auctionId}/bids`, (message: IMessage) => {
        const bidData = JSON.parse(message.body);
        console.log('📥 Bid update:', bidData);
        this.bidService.updateBids(bidData);
      });

      this.subscriptionsMap.set(`bids-${auctionId}`, bidsSub);
  
      // 🔔 Subscribe to auction over event
      const auctionOverSub = this.stompClient.subscribe(`/topic/auction/auctionOver/auctionId${auctionId}`, (message: IMessage) => {
        this.ngZone.run(() => {
          const msg = message.body;
          // this.bidService.triggerModal(msg);
          this.bidService.triggerModal(msg, auctionId);
          const subject = this.getOrCreateActiveUserSubject(auctionId);
          subject.next([]);
          this.toastr.info(msg);
          onMessageCallback(msg);
        });
      });
      this.subscriptionsMap.set(`auctionOver-${auctionId}`, auctionOverSub);
    };
  
    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers['message']);
      console.error('Details:', frame.body);
    };
  
    this.stompClient.activate(); // 🔄 Connect
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

// public unsubscribeFromAuctionTopics(auctionId: string): void {
//   const keys = [`users-${auctionId}`, `toast-${auctionId}`, `bids-${auctionId}`, `auctionOver-${auctionId}`];

//   keys.forEach(key => {
//     const sub = this.subscriptionsMap.get(key);
//     if (sub) {
//       sub.unsubscribe();
//       this.subscriptionsMap.delete(key);
//       console.log(`✅ Unsubscribed from ${key}`);
//     } else {
//       console.warn(`⚠️ No subscription found for ${key}`);
//     }
//   });
// }

public unsubscribeFromAuctionTopics(auctionId: string): void {
  const keys = [`users-${auctionId}`, `toast-${auctionId}`, `bids-${auctionId}`, `auctionOver-${auctionId}`];
  keys.forEach(key => {
    const sub = this.subscriptionsMap.get(key);
    if (sub) {
      sub.unsubscribe();
      this.subscriptionsMap.delete(key);
      console.log(`✅ Unsubscribed from ${key}`);
    } else {
      console.warn(`⚠️ No subscription found for ${key}`);
    }
  });

  // Clean active users
  const subject = this.activeUsersSubjectMap.get(auctionId);
  if (subject) {
    subject.next([]);
    this.activeUsersSubjectMap.delete(auctionId);
    console.log(`🧹 Cleared active users for auction ${auctionId}`);
  }
}

public getActiveUsersObservable(auctionId: string): Observable<string[]> {
  return this.getOrCreateActiveUserSubject(auctionId).asObservable();
}
  
private getOrCreateActiveUserSubject(auctionId: string): BehaviorSubject<string[]> {
  if (!this.activeUsersSubjectMap.has(auctionId)) {
    this.activeUsersSubjectMap.set(auctionId, new BehaviorSubject<string[]>([]));
  }
  return this.activeUsersSubjectMap.get(auctionId)!;
}

  // Optional: for explicit bid subscription callback (external use)
  // public subscribeToAuctionBids(auctionId: string, callback: (bid: any) => void) {
  //   this.stompClient.subscribe(`/topic/auction/${auctionId}/bids`, (message: any) => {
  //     const bidData = JSON.parse(message.body);
  //     callback(bidData);
  //   });
  // }
}


