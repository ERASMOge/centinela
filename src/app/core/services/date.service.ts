import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DateModel } from 'src/app/models/date.model';
import { Observable } from 'rxjs';
import { responseService } from 'src/app/models/responseService.model';


@Injectable({
  providedIn: 'root'
})
export class DateService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarDate(): Observable<responseService>{
    
    
    return this.http.get<responseService>(this.local+"Config/date.php");
  }
  insertarDate(input :DateModel) : Observable<responseService>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.post<responseService>(this.local+"Config/date.php",input,{headers});
  }
  updateDate(input:DateModel){
    
    return this.http.patch(this.local+"Config/date.php",input,{responseType: 'text'});

  }

  

}
