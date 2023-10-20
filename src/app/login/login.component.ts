import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private Auth: AuthService, private router: Router) { }

  usernameFormControl = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

  hide = true;

  ngOnInit(): void {
    const res = this.Auth.autoLogin();
    if (typeof res === 'boolean') {
      if (res) {
        this.router.navigate(['/messages']);
      }
    } else {
      res.subscribe(result => {
        if (result) {
          this.router.navigate(['/messages']);
        }
      }
      );
    }
  }

  loginUser(e: Event, username: HTMLInputElement, password: HTMLInputElement) {
    e.preventDefault();

    if (username.value.length == 0 || password.value.length == 0) {
      return
    }

    if (username.value.length > 50 || password.value.length < 6) {
      return
    }

    this.Auth.authenticate(username.value, password.value).subscribe(response => {
      if (!response.body) {
        console.error("Server didn't return a user");
        return
      }
      if (this.Auth.isLoginErrorResponse(response.body)) {
        alert(response.body.message);
        return
      }
      this.Auth.LoggedInUser = response.body.id;
      this.Auth.setLoggedIn(true);
      this.Auth.Admin = response.body.admin;
      this.router.navigate(['/messages']);
    });
  }
}
