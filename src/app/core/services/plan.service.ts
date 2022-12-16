import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PlanModel } from "src/app/models/plan.model";
import { serviceModel } from "src/app/models/service.model";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn:'root'
})
export class planService {
    local = environment.api;
    constructor(private http:HttpClient){}

    llamarTodo(){
        return this.http.get(this.local+"Catalogo/plan.php");
    }

    insertarPlan(input : PlanModel){
        return this.http.post(this.local+"Catalogo/plan.php",input, {responseType:"text"});
    }

    eliminarPlan(id:number){
        return this.http.patch(this.local+"Catalogo/plan.php?id="+id,{responseType: 'text'});
      }

    /*insertService(input : serviceModel) : Observable<serviceModel> {
        let headers = new HttpHeaders().set('Content-type','Application/json')
        return this.http.post<serviceModel>(this.local+"Services/services.php", input, {headers})
    }*/
} 