import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ManualModel } from 'src/app/models/manual.model';

@Injectable({
  providedIn: 'root'
})
export class ManualService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarManual(){
  
    return this.http.get(this.local+"Manual/manual.php");
  }
  llamarManualbyuser(user:string){
  
    return this.http.get(this.local+"Manual/manual.php?user="+user);
  }

  llamarManualbycount(count:string){
  
    return this.http.get(this.local+"Manual/manual.php?count="+count);
  }

  

  updateManual(input:ManualModel){
    return this.http.patch(this.local+"Manual/manual.php",input,{responseType: 'text'});
  }

  insertarManual(input :ManualModel){ 
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.post(this.local+"Manual/manual.php",input, {headers});
  }

  deleteManual(id:number){
    
    return this.http.delete(this.local+"Manual/manual.php?id="+id,{responseType: 'text'});  }

}
