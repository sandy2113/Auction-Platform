import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { NavigationComponent } from './user/navigation/navigation.component';
import { SearchComponent } from './user/search/search.component';
import { UserComponent } from './user/user.component';
import { BidsComponent } from './user/bids/bids.component';
import { ListingsComponent } from './user/listings/listings.component';
import { NotificationComponent } from './user/notification/notification.component';
import { HistoryComponent } from './user/history/history.component';
import { PaymentComponent } from './user/payment/payment.component';
import { SettingComponent } from './user/setting/setting.component';

const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'login', component: LoginComponent },
  // { path: 'dashboard', component: DashboardComponent }
  {
    path: 'user',
    component: UserComponent, // ✅ Functional guard
    children: [
      { path: 'dashboard', redirectTo: 'overview', pathMatch: 'full' }, // Default child route
      { path: 'dashboard', component: DashboardComponent },
      { path: 'search', component: SearchComponent },
      { path: 'bids', component: BidsComponent },
      { path: 'listings', component: ListingsComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'setting', component: SettingComponent },
    ]
  },
  {
    path: 'navigation',
    component: NavigationComponent,
    canActivate: [authGuard] // ✅ Functional guard
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
}
