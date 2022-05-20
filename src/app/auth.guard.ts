import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private route: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const res = this.auth.autoLogin();
    if (typeof res === 'boolean') {
      if (res) {
        console.log("Auth Guard: Passed (User is already logged in)"); 
        return true;
      } else {
        console.warn("Auth Guard: Failed (User is not logged in)"); // Shouldn't happen
        this.route.navigate(['/login']);
        return false;
      }
    } else {
      return res.pipe(map(result => {
        if (!result) {
          this.route.navigate(['/login']);
          console.log("Auth Guard: Failed (User is not logged in and session invalidated)");
          return false;
        }
        console.log("Auth Guard: Passed (User is logged in)");
        return true;
      }
      ));
    }
  }
}
