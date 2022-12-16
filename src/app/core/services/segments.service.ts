import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { segmentsModel } from '../../models/segments.model';
import { Observable } from 'rxjs';
import { responseService } from 'src/app/models/responseService.model';

@Injectable({
  providedIn: 'root'
})
export class SegmentsService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarSegments(){
    return this.http.get(this.local+"Repeater/segment.php");
  }

  deleteSegments(){
    return this.http.get(this.local+"Repeater/segment.php");
  }

  insertarSegments(input :segmentsModel){
    return this.http.post(this.local+"Repeater/segment.php",input, {responseType:"text"});
  }
  
  actualizarSegment(id:number, nombre:string,estatus : number,tipo : number){
    return this.http.patch(this.local+"Repeater/segment.php",{idSegmento:id,nombre:nombre,estatus:estatus,tipo:tipo}, {responseType:"text"});
  }

 updateElimSegment(id:String){    
    return this.http.patch(this.local+"Repeater/segment.php?id="+id,{responseType: 'text'});
   
  }
  existe(segmento:string){
    return this.http.get(this.local+"Repeater/segment.php?segmento="+segmento);    
  }

  lastSegmento(){
    return this.http.get(this.local+"Repeater/segment.php?last=true");    
  }

  countActiveSegmento(segmento :number):Observable<responseService>{
    return this.http.get<responseService>(this.local+"Repeater/ip.php?cveSegmento="+segmento);
  }
}
