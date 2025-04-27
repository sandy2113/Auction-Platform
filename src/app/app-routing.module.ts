import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { NavigationComponent } from './user/navigation/navigation.component';
import { SearchComponent } from './user/search/search.component';
import { UserComponent } from './user/user.component';

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
