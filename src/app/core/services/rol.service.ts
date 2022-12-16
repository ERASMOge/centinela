import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RepetidorModel } from '../../models/repetidor.model';
import { responseService } from 'src/app/models/responseService.model';
import { Observable } from 'rxjs';
import { ContactServiceModel } from 'src/app/models/contactService.model';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarTodo() : Observable <responseService>{
    return this.http.get<responseService>(this.local+"Customer/rol.php");
  }

  llamarRol(cve : ContactServiceModel){
    return this.http.get(this.local+"Repeater/repeater.php?id="+cve);
  }

  eliminarRol(id:number){
    return this.http.patch(this.local+"Repeater/repeater.php?id="+id,{responseType: 'text'});
  }

  insertarRol(input :any):Observable<responseService>{
    return this.http.post<responseService>(this.local+"Repeater/repeater.php",{responseType: 'text'});
  }

  updateRol(input :RepetidorModel){
    return this.http.patch(this.local+"Repeater/repeater.php",input, {responseType:"text"});
  }
  
  segmentosRol(cve:number){
    return this.http.get(this.local+"Repeater/repeater.php?cve="+cve);    
  }

}
