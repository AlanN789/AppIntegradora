import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private cookieService:CookieService, private router:Router) { }

  redirect(flag:boolean):any{
    if (flag){
      this.router.navigate(['dashboard'])
    }
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const cookie = this.cookieService.check('token');
    console.log(cookie);
    this.redirect(cookie);
    return !(cookie)
  }

}
