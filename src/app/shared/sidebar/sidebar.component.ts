import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'app/services/account.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/home', title: 'Home',  icon: 'home', class: '' },
    { path: '/login', title: 'Login',  icon:'login', class: '' },
    { path: '/signup', title: 'Sign Up',  icon:'person_add', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
    
  public isLogin = false;
  public roleId = 0;

  constructor( 
    private router: Router, 
    public accountService: AccountService) { 
      this.isLogin = accountService.isLoggedIn;
      this.roleId = accountService.roleId;
  
      this.accountService.refreshObservable.subscribe(() => {
        this.isLogin = this.accountService.isLoggedIn;
        this.roleId - this.accountService.roleId;
      });
    }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  logout() {
    this.accountService.logout().then(
      () => {
      this.isLogin = this.accountService.isLoggedIn;
      this.router.navigate(['/']);
      }
    )
  }
}
