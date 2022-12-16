import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { responseService } from "src/app/models/responseService.model";
import { RsModel } from "src/app/models/rs.model";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn:'root'
})
export class RsService {
    local = environment.api;
    constructor(private http:HttpClient){}

    llamarTodo(cve:number):Observable<responseService>{
        return this.http.get<responseService>(this.local+"Services/rs.php?cve="+cve);
    }

    deleteRS(cve:number):Observable<responseService>{       
        let headers = new HttpHeaders().set('Content-type','Application/json');
        return this.http.patch<responseService>(this.local+"Services/rs.php?cve="+cve, {headers});
    }

    updateRS(input : RsModel):Observable<responseService>{
        let headers = new HttpHeaders().set('Content-type','Application/json');
        return this.http.patch<responseService>(this.local+"Services/rs.php",input, {headers});
    }

    insertRS(input : RsModel){
        let headers = new HttpHeaders().set('Content-type','Application/json');
        return this.http.post<responseService>(this.local+"Services/rs.php",input, {headers});
    }

    llamarSoloUno(cve : number):Observable<responseService>{
        return this.http.get<responseService>(this.local+"city.php?cve2="+cve);
      }
} 