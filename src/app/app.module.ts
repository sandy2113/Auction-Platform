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
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    DashboardComponent,
    NavigationComponent,
    SidebarComponent,
    BidsComponent,
    ListingsComponent,
    NotificationComponent,
    HistoryComponent,
    SettingComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
