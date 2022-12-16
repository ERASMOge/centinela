import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AsuntoModel } from 'src/app/models/asunto.model';

@Injectable({
  providedIn: 'root'
})
export class AsuntoService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarAsunto(){
    return this.http.get(this.local+"Catalogo/asunto.php");
  }

  insertarAsunto(input : AsuntoModel){
    return this.http.post(this.local+"Catalogo/asunto.php",input, {responseType:"text"});  
  }

  eliminarAsunto(id:number){
    return this.http.patch(this.local+"Catalogo/asunto.php?id="+id,{responseType: 'text'});
  }

  /*updateAsunto(input:ManualModel){
    return this.http.patch(this.local+"Catalogo/asunto.php",input,{responseType: 'text'});
  }

  insertarAsunto(input :ManualModel){
   
    
    return this.http.post(this.local+"Catalogo/asunto.php",input, {responseType:"text"});
  }

  deleteAsunto(id:number){
    
    return this.http.delete(this.local+"Catalogo/asunto.php?id="+id,{responseType: 'text'});  }*/

}
