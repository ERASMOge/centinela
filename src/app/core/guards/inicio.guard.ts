import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InicioGuard implements CanActivate {
  constructor(private route:Router, private auth:AuthService){}
  
  
  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(localStorage.getItem('sesion') == undefined ){
      return true
    }else{
      if(this.auth.getTipo() == 0){
        this.route.navigateByUrl('/usuario/dashboard')
      }else{
        this.route.navigateByUrl('/admin/dashboard/dashboard-tickets')
      }
      return false;
    }
  }
  
}
