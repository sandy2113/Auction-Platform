import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuctionDetails } from '../components/auction-room/auction-details.model';
import { AuctionProduct } from '../components/auction-room/auction-productmodel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/api/auth/login'; // your backend endpoint
  public baseServiceUrl='http://localhost:8080/';
public imagePath="http://localhost:8080/uploads/images/";
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { email, password });
  }
  register(user: { name: string; email: string; password: string }) {
    return this.http.post(this.loginUrl, user);
  }

  getAuctionDetails(id: string): Observable<AuctionDetails> {
    return this.http.get<AuctionDetails>(`${this.baseServiceUrl}api/auction/${id}`);
  }
  getAllAuctionProducts(): Observable<AuctionProduct[]> {
    return this.http.get<AuctionProduct[]>(`${this.baseServiceUrl}api/auction-products`);
  }

  subscribeToAuction(productId: string, userId: string): Observable<string> {
    return this.http.post(`${this.baseServiceUrl}api/subscription/subscribe`, null, {
      params: { productId, userId },
      responseType: 'text'
    });
  }  

  getAllAuctions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseServiceUrl}auction`);
  }

  getUserSubscriptions(userId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseServiceUrl}subscription/user/${userId}`);
  }
}
