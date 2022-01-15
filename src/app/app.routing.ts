import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsComponent } from './components/components.component';
import { ProfileComponent } from './examples/profile/profile.component';
import { SignupComponent } from './pages/signup/signup.component';
import{ LoginComponent } from './pages/login/login.component';
import { LandingComponent } from './examples/landing/landing.component';
import { NucleoiconsComponent } from './components/nucleoicons/nucleoicons.component';
import { HomeComponent } from './pages/home/home.component';

import { AuthGuard } from './guards/auth-guard.guard';
import { AuthAdminGuard } from './guards/auth-admin.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UploadFileComponent } from './pages/upload-file/upload-file.component';
import { BookingOrderComponent } from './pages/booking-order/booking-order.component';

const routes: Routes =[
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'components', component: ComponentsComponent },
  { path: 'user-profile', component: ProfileComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'nucleoicons', component: NucleoiconsComponent },
  { path: 'login', component: LoginComponent},

  // route that require login
  { path: 'booking-order', component: BookingOrderComponent, canActivate:[AuthGuard] },
  { path: 'upload-file', component: UploadFileComponent, canActivate:[AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},

  // route that require admin login
  { path: 'admin', component: AdminComponent, canActivate:[AuthAdminGuard]}
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: false
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
