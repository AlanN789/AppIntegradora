import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { timeMessage, successDialog, errorMessage } from 'src/app/functions/alerts';
import { UserLog } from 'src/app/Interfaces/User/user';
import { AuthService } from 'src/app/Services/Services/Auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  User!: UserLog;
  ngOnInit(): void {

  }
  constructor(private fb:FormBuilder, private authService:AuthService, private router:Router, private cookieService:CookieService) {
    this.createForm();
  }

  login():void{
    if (this.loginForm.invalid){
      return Object.values(this.loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }else{
      this.setUser();
      this.authService.login(this.User).subscribe((data:any)=>{
        timeMessage('Entrando...', 1500).then(()=>{
          successDialog('Logueo Completado');
          this.cookieService.set('token', data.token);
          console.log(this.cookieService.get('token'));
          this.router.navigate(['/dashboard']);
        })
      }, (error: any) =>{
        errorMessage('Ha ocurrido un error')
      });
    }
  }

  createForm(): void{
    this.loginForm = this.fb.group({
      email:['',[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      password: ['', [Validators.required]]
    })
  }

  get emailValidate(){
    return(
      this.loginForm.get('email')?.invalid && this.loginForm.get('email')?.touched
    );
  }

  get passwordValidate(){
    return(
      this.loginForm.get('password')?.invalid && this.loginForm.get('password')?.touched
    )
  }

  setUser():void{
    this.User = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    }
  }

}

