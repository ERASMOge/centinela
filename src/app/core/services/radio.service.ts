import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RadioModel } from 'src/app/models/radio.model';
import { Observable } from 'rxjs';
import { responseService } from 'src/app/models/responseService.model';

@Injectable({
  providedIn: 'root'
})
export class RadioService {
  local = environment.api; 
  constructor(private http : HttpClient, private radioservice:RadioService) { }

  llamarRadio(cve:number):Observable<responseService>{
    return this.http.get<responseService>(this.local+"Services/rs.php?cve="+cve);
}
  
deleteRadio(){

}
  updateRadio(input:RadioModel){
    return this.http.patch(this.local+"Devices/radio.php",input,{responseType: 'text'});
  }

  insertarRadio(input :RadioModel){
    return this.http.post(this.local+"Devices/radio.php",input, {responseType:"text"});
  }

  

}
