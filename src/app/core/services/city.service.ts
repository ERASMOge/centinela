import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { responseService } from 'src/app/models/responseService.model';
import { CiudadModel } from 'src/app/models/ciudad.model';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarCiudades(){
    return this.http.get(this.local+"Catalogo/city.php");
  }

  llamarSoloUno(cve : number):Observable<responseService>{
    return this.http.get<responseService>(this.local+"Catalogo/city.php?cve="+cve);
  }

  insertarCiudad(input : CiudadModel){
    return this.http.post(this.local+"Catalogo/city.php",input, {responseType:"text"});  
  }

  eliminarCiudad(id:number){
    return this.http.patch(this.local+"Catalogo/city.php?id="+id,{responseType: 'text'});
  }

}
