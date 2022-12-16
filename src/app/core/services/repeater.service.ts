import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RepetidorModel } from '../../models/repetidor.model';
import { Observable } from 'rxjs';
import { responseService } from 'src/app/models/responseService.model';
import { InformacionRelevanteModel } from 'src/app/models/infoRelevante.model';

@Injectable({
  providedIn: 'root'
})
export class RepeaterService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarRepitdores():Observable<responseService>{
    return this.http.get<responseService>(this.local+"Repeater/repeater.php");
  }

  llamarRepitdoresTipo(tipo:number):Observable<responseService>{
    return this.http.get<responseService>(this.local+"Repeater/repeater.php?tipo="+tipo);
  }

  llamarRepitdor(cve : number){
    return this.http.get(this.local+"Repeater/repeater.php?id="+cve);
  }

  deleteRepetidor(id:number){
    return this.http.patch(this.local+"Repeater/repeater.php?id="+id,{responseType: 'text'});
  }

  insertarRepetidor(input :RepetidorModel){
    return this.http.post(this.local+"Repeater/repeater.php",input, {responseType:"text"});
  }

  updateRepetidor(input :RepetidorModel){
    return this.http.patch(this.local+"Repeater/repeater.php",input, {responseType:"text"});
  }
  
  segmentosTodoRepetidor(cve:number){
    return this.http.get(this.local+"Repeater/repeater.php?cve="+cve);    
  }

  buscarSegmentoRepetidor(cve:number) : Observable<responseService>{
    return this.http.get<responseService>(this.local+"Repeater/repeater.php?idr="+cve);    
  }
  
  buscarSegmentoRepetidorTipo(cve:number,tipo:number) : Observable<responseService>{  
    return this.http.get<responseService>(this.local+"Repeater/repeater.php?idr="+cve+"&tipo="+tipo);    
  }

  llamarInformacionRelevante(cve : number) {        
    return this.http.get(this.local+"Repeater/infoRelevante.php?id="+cve);
  }

  insertarInformacionRelevante(input : InformacionRelevanteModel){
    let headers = new HttpHeaders().set('Content-type','Application/json');  
    return this.http.post(this.local+"Repeater/infoRelevante.php",input, {headers});
  }

  eliminarInformacionRelevante(id:number){
    return this.http.patch(this.local+"Repeater/infoRelevante.php?id="+id,{responseType: 'text'});
  }

}
