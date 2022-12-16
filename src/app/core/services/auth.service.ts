import { noUndefined } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public auth(payload:string){
    sessionStorage.setItem('sesion',payload)
  }

  public validateSession(){
    let sesion = sessionStorage.getItem('sesion') 
  }

  public crearSesion(token:string){
    let payload = token
    localStorage.setItem('sesion',payload)
    return true;
  }

   validatTiempoToken(){
    const d = new Date();
    let payload = localStorage.getItem('sesion')
    let info = this.parseJwt(payload!!)
    if(Number(info.expire) <d.getTime() ){
      return false
    }
    return true
  }

   getTipo(){
    let payload = localStorage.getItem('sesion')
    let info = this.parseJwt(payload!!)
    return info.tipo;
  }

   getCveRol(){
    let payload = localStorage.getItem('sesion')
    let info = this.parseJwt(payload!!)
    return info.cveRol
  }

   getCveId(){
    let payload = localStorage.getItem('sesion')
    let info = this.parseJwt(payload!!)    
    return info.id
  }

  getCveGrupo(){
    let payload = localStorage.getItem('sesion')
    let info = this.parseJwt(payload!!)    
    return info.grupo
  }

  cerrarSesion(){
    localStorage.removeItem("sesion");
  }

  parseJwt(token:string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

}
