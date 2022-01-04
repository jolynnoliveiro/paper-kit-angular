import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'app/services/account.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public username = "";

  constructor(
    private router: Router, 
    public accountService: AccountService) { 
      this.username = accountService.currentUser.username;
    }

  ngOnInit(): void {
  }

}
