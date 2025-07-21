import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuctionDetails, AuctionProductDTO } from '../components/auction-room/auction-details.model';
import { AuctionProduct } from '../components/auction-room/auction-productmodel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/api/auth/login'; // your backend endpoint
  public API_BASE_URL='http://localhost:8080/';
public imagePath="http://localhost:8080/uploads/images/";
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { email, password });
  }
  register(user: { name: string; email: string; password: string }) {
    return this.http.post(this.loginUrl, user);
  }

  getAuctionDetails(id: string): Observable<AuctionDetails> {
    return this.http.get<AuctionDetails>(`${this.API_BASE_URL}api/auction/${id}`);
  }

  getAllAuctionProducts(userId: any): Observable<AuctionProductDTO[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<AuctionProductDTO[]>(`${this.API_BASE_URL}api/auction-products`, { params });
  }
  subscribeToAuction(productId: string, userId: string): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}api/subscription/subscribe`, {
      productId,
      userId
    });
  }  

  getAllAuctions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE_URL}auction`);
  }

  getUserSubscriptions(userId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_BASE_URL}subscription/user/${userId}`);
  }
}
