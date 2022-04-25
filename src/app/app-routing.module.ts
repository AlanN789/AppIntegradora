import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { LoginGuard } from './Services/Guards/Login/login.guard';
import { TokenGuard } from './Services/Guards/Token/token.guard';

const routes: Routes = [
  {path:'login', canActivate:[LoginGuard], component: LoginComponent},
  {path:'register', canActivate:[LoginGuard], component: RegisterComponent},
  {path:'dashboard',canActivate:[TokenGuard], component: DashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
