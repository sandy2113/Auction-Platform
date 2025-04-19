import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './user/dashboard/dashboard.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

   routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    // { path: 'profile', component: ProfileComponent },
    // { path: 'settings', component: SettingsComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  ];

  
}
