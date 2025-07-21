import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register/register.component';
import { UserComponent } from './user/user.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { SidebarComponent } from './user/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NavigationComponent } from './user/navigation/navigation.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';
import { BidsComponent } from './user/bids/bids.component';
import { ListingsComponent } from './user/listings/listings.component';
import { NotificationComponent } from './user/notification/notification.component';
import { HistoryComponent } from './user/history/history.component';
import { SettingComponent } from './user/setting/setting.component';
import { PaymentComponent } from './user/payment/payment.component'; 
import { AuctionRoomComponent } from './components/auction-room/auction-room.component';
import { AddProductComponent } from './user/add-product/add-product.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CreateAuctionComponent } from './user/create-auction/create-auction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Needed for native Date adapter
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { SearchComponent } from './user/search/search.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductComponent } from './user/product/product.component';
import { ProductBidsDetailsComponent } from './product-bids-details/product-bids-details.component';
import { RecentsBidsComponent } from './recents-bids/recents-bids.component';
import { ProductBidComponent } from './product-bid/product-bid.component';
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    SearchComponent,
    DashboardComponent,
    NavigationComponent,
    SidebarComponent,
    BidsComponent,
    ListingsComponent,
    NotificationComponent,
    HistoryComponent,
    SettingComponent,
    PaymentComponent,
    AuctionRoomComponent,
    AddProductComponent,
    CreateAuctionComponent,
    ProductComponent,
    RecentsBidsComponent,
    ProductBidsDetailsComponent,
    ProductBidComponent,
  ],
  imports: [
    NgxPaginationModule,
    ToastrModule.forRoot(),
    BrowserModule,
    RouterModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatSelectModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    HttpClientModule,
    MatToolbarModule,
    FormsModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
