import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'app/services/account.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public username = "";

  constructor(
    private router: Router, 
    public accountService: AccountService) { 
      this.username = accountService.currentUser.username;
    }

  ngOnInit(): void {
  }

}
