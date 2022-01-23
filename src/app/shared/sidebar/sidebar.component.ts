import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'app/services/account.service';
import { NotificationService } from 'app/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  public notificationCount = 0;
  public notificationList = [];

  constructor( 
    private router: Router, 
    public accountService: AccountService, public notificationService: NotificationService, public modalService: NgbModal) { 
      this.isLogin = accountService.isLoggedIn;
      this.roleId = accountService.roleId;
  
      this.accountService.refreshObservable.subscribe(() => {
        this.isLogin = this.accountService.isLoggedIn;
        this.roleId = this.accountService.roleId;
      });
    }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    this.getNotifications();
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
  
  getNotifications() {        
    const obj = Object.assign({});
    obj.userId = this.accountService.currentUser.id;

    this.notificationService.getNotification(obj).then(
        (res) => {
          this.notificationList = res;
          this.notificationCount = res.length;
        }
    )
  }

  onOpenModal(modalNotification: any) {
    this.modalService.open(modalNotification, {ariaLabelledBy: 'modal-basic-title'});
  }

  logout() {
    this.accountService.logout().then(
      () => {
      this.isLogin = this.accountService.isLoggedIn;
      this.router.navigate(['/']);
      }
    )
  }
}
