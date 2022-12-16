import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { responseService } from 'src/app/models/responseService.model';
import { Observable } from 'rxjs';
import { MapsModel } from 'src/app/models/maps.model';


@Injectable({
  providedIn: 'root'
})
export class MapsService {
  local = environment.api; 
  constructor(private http : HttpClient, private Maps:MapsService) { }

  updateManual(input : MapsModel):Observable<responseService>{
    let headers = new HttpHeaders().set('Content-type','Application/json');   
    return this.http.patch<responseService>(this.local+"Services/maps.php",input,{headers});
  }
}
