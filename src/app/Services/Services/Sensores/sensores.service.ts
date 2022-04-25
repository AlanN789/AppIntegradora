import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, ObservedValueOf, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SensoresService {

  apiURL = environment.apiURL
  private _refresh$ = new Subject<void>();

  constructor(private http:HttpClient, private cookieService:CookieService, ) { }

  verSensores():Observable<any>{
    return this.http.get(`${this.apiURL}/verSensores`);
  }

  getValores(id:any):Observable<any>{
    return this.http.get(`${this.apiURL}/valoresSensores/${id}`)
  }

  getSensor(id:any):Observable<any>{
    return this.http.get(`${this.apiURL}/verSensor/${id}`)
  }

  motores():Observable<any>{
    return this.http.get(`${this.apiURL}/cambiarStatus`)
  }

  agregar(sensor:any):Observable<any>{
    return this.http.post(`${this.apiURL}/guardarSensor/:request`, sensor).pipe(
      tap(()=>{
        this._refresh$.next()
      })
    )
  }

  edit(sensor:any):Observable<any>{
    return this.http.put(`${this.apiURL}/modificarSensor/:request`, sensor).pipe(
      tap(()=>{
        this._refresh$.next()
      })
    )
  }

  delete(id:any):Observable<any>{
    return this.http.delete(`${this.apiURL}/borrarSensor/${id}`).pipe(
      tap(()=>{
        this._refresh$.next()
      })
    )
  }

  get refresh$(){
    return this._refresh$
  }

}
