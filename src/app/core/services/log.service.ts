import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { log_clienteEmpresa } from "src/app/models/log_clienteEmpresa.model";
import { responseService } from "src/app/models/responseService.model";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn:'root'
})
export class LogService {
    local = environment.api;
    constructor(private http:HttpClient){}


    //Vista empresa-cliente
    llamarTodo(cve:number) : Observable<responseService>{
        return this.http.get<responseService>(this.local+"Logs/logs_clienteEmpresa.php?cve="+cve);
    }

    insertLog(input : log_clienteEmpresa,tipo : number):Observable<responseService> {
        let headers = new HttpHeaders().set('Content-type','Application/json')        
        return this.http.post<responseService>(this.local+"Logs/logs_clienteEmpresa.php?condicion="+tipo,input,{headers});
    }    
    
    deleteLog(cve : number):Observable<responseService> {
        return this.http.delete<responseService>(this.local+"Logs/logs_clienteEmpresa.php?cve="+cve);
    }    
} 