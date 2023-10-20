import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private route: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.auth.isLoggedIn) {
      return true;
    }
    return this.auth.isLoggedInOnServer().pipe(map(res => {
      this.auth.LoggedInUser = -1;
      if (!res.body) {
        console.error("Server didn't return a user");
        this.route.navigate(['/login']);
        return false;
      }
      if (res.body.user == null) {
        this.route.navigate(['/login']);
        return false;
      }
      this.auth.setLoggedIn(true);
      this.auth.LoggedInUser = res.body.user;
      return true;
    }));
  }
}
