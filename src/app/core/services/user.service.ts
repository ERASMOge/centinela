import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { responseService } from 'src/app/models/responseService.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  local = environment.api;

  constructor(private http:HttpClient) { }

  login(contrasena:String, usuario:String, tipo : number)  {
    return this.http.get(this.local+'/Users/userLogin.php?usuario='+usuario+'&contrasena='+contrasena+'&tipo='+tipo);
  }

  todosUsuarios() :Observable<responseService> {
    return this.http.get<responseService>(this.local+'/Users/user.php');
  }

  usuariosRol(cve : number) :Observable<responseService> {
    return this.http.get<responseService>(this.local+'/Users/user.php?cveRol='+cve);
  }

  usuariosGrupo(cve : number) :Observable<responseService> {
    
    return this.http.get<responseService>(this.local+'/Users/user.php?cveGroup='+cve);
  }

  
}
