import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { UserLog } from 'src/app/Interfaces/User/user';
import { UserReg } from 'src/app/Interfaces/User/user-reg';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiURL = environment.apiURL

  constructor(private http:HttpClient, private cookieService:CookieService, ) { }

  register(user:UserReg):Observable<any>{
    return this.http.post(`${this.apiURL}/storeUser/:request`, user);
  }
  login(user:UserLog):Observable<any>{
    return this.http.post(`${this.apiURL}/login/:request`, user);
  }
  logout():Observable<any>{
    return this.http.get(`${this.apiURL}/logout`);
  }
  checkRole():Observable<any>{
    return this.http.get(`${this.apiURL}/getRol`);
  }
  checkID():Observable<any>{
    return this.http.get(`${this.apiURL}/getUser`);
  }
}
