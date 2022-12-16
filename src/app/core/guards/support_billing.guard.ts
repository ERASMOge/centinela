import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class support_billing implements CanActivate {
  constructor(private route:Router, private auth:AuthService){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(localStorage.getItem('sesion') != undefined && this.auth.getTipo() == 1  && this.auth.getCveRol() != 4
    && localStorage.getItem('sesion') != undefined && this.auth.getTipo() == 1  && this.auth.getCveRol() != 3 ){
      return true
    }else{
        this.route.navigateByUrl('/admin/dashboard')
      return false;
    }
  }
  
}
