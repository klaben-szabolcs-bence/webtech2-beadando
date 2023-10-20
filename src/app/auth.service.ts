import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, throwError, Observable } from 'rxjs';
import { User } from './user';

interface AuthResponseData {
  user: number;
  message: string;
}

interface LoginErrorResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  private LoggedIn = false;
  public LoggedInUser = -1;

  get isLoggedIn() {
    return this.LoggedIn;
  }

  setLoggedIn(loggedIn: boolean) {
    this.LoggedIn = loggedIn;
  }

  isLoggedInOnServer(): Observable<HttpResponse<AuthResponseData>> {
    return this.http.get<AuthResponseData>('/api/session', { observe: 'response' });
  }

  getUserDetails(username: string, password: string) {
    return this.http.post<User | LoginErrorResponse>('/api/login', { username, password }, { observe: 'response' });
  }

  isLoginErrorResponse(response: User | LoginErrorResponse): response is LoginErrorResponse {
    return (<LoginErrorResponse>response).message !== undefined;
  }
}
