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


  ngOnInit(): void {
  }

  loginUser(e: Event, username: HTMLInputElement, password: HTMLInputElement) {
    e.preventDefault();
    this.Auth.getUserDetails(username.value, password.value).subscribe(respone => {
      if (respone.status === 200) {
        this.Auth.isLoggedIn = true;
        this.router.navigate(['/messages']);
      } else {
        window.alert(respone.body);
      }
    });
  }
}
