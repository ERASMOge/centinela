import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SesionGuard implements CanActivate {
  constructor(private route:Router, private auth:AuthService){}
  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      if(localStorage.getItem('sesion') !== undefined ){
        if(this.auth.getTipo() == 0 ){          
          this.route.navigateByUrl('/usuario')
        }else{
          this.route.navigateByUrl('/admin')
        }
        return true
      }else{
        return false;
      }
    
  }
  
}
