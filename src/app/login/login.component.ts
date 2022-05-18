import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private Auth: AuthService, private router: Router) { }

  hide = true;

  ngOnInit(): void {
    if (this.Auth.isLoggedIn) {
      this.router.navigate(['/messages']);
      return
    }
    this.Auth.isLoggedInOnServer().subscribe(res => {
      if (res.body?.user == null) {
        return
      }
      this.Auth.setLoggedIn(true);
      this.Auth.LoggedInUser = res.body.user;
      this.router.navigate(['/messages']);
    });
  }

  loginUser(e: Event, username: HTMLInputElement, password: HTMLInputElement) {
    e.preventDefault();
    this.Auth.getUserDetails(username.value, password.value).subscribe(response => {
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
      this.router.navigate(['/messages']);
    });
  }
}
