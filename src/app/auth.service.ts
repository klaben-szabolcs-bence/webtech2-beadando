import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from './models/user';
import { Router } from '@angular/router';

interface LoginErrorResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private route: Router) { }

  private LoggedIn = false;
  public LoggedInUser = -1;
  public LoggedInUserName: string = "";
  public Admin = false;

  get isLoggedIn() {
    return this.LoggedIn;
  }

  setLoggedIn(loggedIn: boolean) {
    this.LoggedIn = loggedIn;
  }

  isLoggedInOnServer(): Observable<HttpResponse<LoginErrorResponse | User>> {
    return this.http.get<LoginErrorResponse | User>('/api/session', { observe: 'response' });
  }

  authenticate(username: string, password: string) {
    return this.http.post<User | LoginErrorResponse>('/api/login', { username, password }, { observe: 'response' });
  }

  getUserDetails(id: number): Observable<User> {
    return this.http.get<User>('/api/user?id=' + id);
  }

  isLoginErrorResponse(response: User | LoginErrorResponse): response is LoginErrorResponse {
    return (<LoginErrorResponse>response).message !== undefined;
  }

  autoLogin(): boolean | Observable<boolean> {
    if (this.isLoggedIn) {
      return true;
    }
    return this.isLoggedInOnServer().pipe(map(res => {
      if (!res.body) {
        console.log("autoLogin: Server didn't return a response body.");
        return false;
      }
      if (this.isLoginErrorResponse(res.body)) {
        console.log("autoLogin: Session got invalidated. Reason: " + res.body.message);
        return false;
      }
      this.setLoggedIn(true);
      this.LoggedInUser = res.body.id;
      this.Admin = res.body.admin;
      this.LoggedInUserName = res.body.username;
      return true;
    }));
  }


  logout() {
    this.LoggedIn = false;
    this.LoggedInUser = -1;
    this.http.post('/api/logout', {}).subscribe(() => {
      this.route.navigate(['/login']);
    });
  }

}
