import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AdminService } from 'app/services/admin.service';
import { AccountService } from 'app/services/account.service';
import { Router } from '@angular/router';
import { NotificationService } from 'app/services/notification.service';
import { Notifications } from 'app/models/notifications';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    private toggleButton: any;
    private sidebarVisible: boolean;
    public businessOpen = false;

    public isLogin = false;
    public roleId = 0;

    public notificationCount = 0;

    constructor(
        public location: Location, 
        private element : ElementRef, 
        public accountService: AccountService, 
        public router: Router,
        public adminService: AdminService,
        public notificationService: NotificationService) {
            
        this.sidebarVisible = false;

        this.isLogin = accountService.isLoggedIn;
        this.roleId = accountService.roleId;

        this.accountService.refreshObservable.subscribe(() => {
            this.isLogin = this.accountService.isLoggedIn;
            this.roleId = this.accountService.roleId;
        })
    }

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];

        this.getBusinessHourOnOff();
        this.getNotifications();
    }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        // console.log(toggleButton, 'toggle');

        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };
    isHome() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if(titlee.charAt(0) === '#'){
            titlee = titlee.slice( 1 );
        }
        if( titlee === '/home' ) {
            return true;
        }
        else if (titlee == '') {
            return true;
        }
        else {
            return false;
        }
    }

    getBusinessHourOnOff() {
        this.adminService.getBusinessHourOnOff({}).then (
            (res) => {
            this.businessOpen = res[0].is_open;

            }, rej => {
            
            }
        )
    }

    logout() {
        this.accountService.logout().then(
            () => {
            this.isLogin = this.accountService.isLoggedIn;
            this.notificationCount = 0;
            this.router.navigate(['/']);
            }
        )
    }

    getNotifications() {
        
        const obj = Object.assign({});
        obj.userId = this.accountService.currentUser.id;

        this.notificationService.getNotification(obj).then(
            (res) => {
                this.notificationCount = res.length;
            }
        )
    }
}
