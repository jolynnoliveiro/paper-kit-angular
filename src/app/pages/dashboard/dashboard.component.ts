import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'app/services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'app/services/admin.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public username = "";
  public contactNo = "";

  page = 1;
  pageSize = 4;
  collectionSize = 0;

  uploadRecords = [];

  bookedOrders = [];

  constructor(public adminService: AdminService, public accountService: AccountService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.refreshCountries();

    this.getUploadRecordsByUserId();

    this.getBookedOrdersByUserId();

    this.username = this.accountService.currentUser.username;
    this.contactNo = this.accountService.currentUser.contact_number;
  }

  refreshCountries() {
    this.collectionSize = this.uploadRecords.length;
    this.uploadRecords = this.uploadRecords
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  
  getUploadRecordsByUserId() {
    const obj = Object.assign({});
    obj.userId = this.accountService.currentUser.id;

    this.adminService.getUploadRecordsByUserId(obj).then(
      (res) => {
        this.uploadRecords = res;

      }, rej => {
        this.snackBar.open(rej.error, '', {
          duration: 2000, //2000 ms = 2 seconds
        })
      }
    )
  }

  onDownloadClick(fileName: string) {
    const obj = Object.assign({});
    obj.fileNamePath = fileName;

    console.log(obj);

    this.adminService.postDownloadPDFFile(fileName).then(
      (res) => {
        var blob = new Blob([res], { type: 'application/pdf' });
        var url = window.URL.createObjectURL(blob);
        window.open(url);

      }, rej => {
        this.snackBar.open(rej.error, '', {
          duration: 2000, //2000 ms = 2 seconds
        })
      }
    )
  }

  getBookedOrdersByUserId() {
    const obj = Object.assign({});
    obj.userId = this.accountService.currentUser.id;

    this.adminService.getBookedOrdersByUserId(obj).then(
      (res) => {
        this.bookedOrders = res;

      }, rej => {
        this.snackBar.open(rej.error, '', {
          duration: 2000, //2000 ms = 2 seconds
        })
      }
    )
  }

  onDeleteBookingDate() {
    
  }

  getCover(data: number ): String {
    var value = "No Cover";
    
    if (data == 1) {
      value = "Transparent Hard Plastic Cover";
    }

    if (data == 2) {
      value = "Hard Cover";
    }

    return value;
  }
}
