import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from 'app/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  test : Date = new Date();
  focus;
  focus1;
  
  constructor(
    private snackBar: MatSnackBar, 
    private accountService: AccountService, 
    private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {
    const credentials = { username: f.value.username, password: f.value.password }

    if (f.valid) {
      this.accountService.login(credentials).then(
        (res) => {
          this.accountService.refreshSubject?.next(true);
          //this.router.navigate(['/home']);

          if (res[0].role_id == 1) {
            this.router.navigate(['/admin']);
          }

          if (res[0].role_id == 0) {
            this.router.navigate(['/dashboard']);
          }

        }, rej => {
          this.snackBar.open(rej.error, '', {
            duration: 2000,
         })
        }
      )
    } else {
      this.snackBar.open('Please fill in all input', '',{
        duration: 2000,
      })
    }
  }

}
