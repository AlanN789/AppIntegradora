import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenGuard implements CanActivate {

  constructor(private router:Router, private cookieService:CookieService){}

  redirect(flag:boolean):any{
    if (!flag){
      this.router.navigate(['login'])
    }
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const cookie = this.cookieService.check('token');
    console.log(this.cookieService.get('token'));
    this.redirect(cookie);
    return cookie
  }

}
