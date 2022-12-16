import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { responseService } from "src/app/models/responseService.model";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn: "root"
})
export class IpService {
    local = environment.api;
    constructor(private http : HttpClient){}

    insertarIp(input : any){
        
        return this.http.post(this.local+"Repeater/ip.php", input, {responseType: 'text'})
    }

    select(){
        return this.http.get(this.local+"Repeater/ip.php")
    }
    
    selectIp(segmento :string,segmento2 :string,condicion2 : number, condicion?:string) : Observable<responseService>{        
        return this.http.get<responseService>(this.local+"Repeater/ip.php?segmento="+segmento+"&segmentoFinal="+segmento2+"&condicion="+condicion+"&condicion2="+condicion2)
    }

    selectIpOneEquipament(id : number,identificador: string, condicion : number,contador: number){
        return this.http.get<responseService>(this.local+"Devices/others.php?identificador="+identificador+"    &contador="+contador+"&condicion="+condicion+"&iddevice="+id)
    }

    selectIpOneRouter(id : number,identificador: string, condicion : number,contador: number){
        return this.http.get<responseService>(this.local+"Devices/router.php?identificador="+identificador+" &contador="+contador+"&condicion="+condicion+"&iddevice="+id)
    }

    selectIpParam(segmento :string,segmento2 :string,segmento3 : string){
        return this.http.get(this.local+"Repeater/ip.php?segmento="+segmento+"&segmentoFinal="+segmento2+"&segmentoBuscar="+segmento3)
    }

    selectIpTodosSolo(segmento : string){
        return this.http.get(this.local+"Repeater/ip.php?segmentoBuscarSinParam="+segmento)
    }
    
    ping(ip : string) {
        return this.http.get(this.local+"Config/ping.php?ip="+ip)
    }
    

}