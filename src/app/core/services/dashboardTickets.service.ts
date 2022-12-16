import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { responseService } from 'src/app/models/responseService.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class dashboardTicketsService { 
    api = environment.api;
    constructor(private http : HttpClient) { }

  rangoDeFechas(fechaInicio:string, fechaFinal : string, condicion:number,cveGrupo : number):Observable<responseService>{
    return this.http.get<responseService>(this.api+"Tickets/ticketDashboard.php?fechaInicio="+fechaInicio+"&fechaFin="+fechaFinal+"&tipo="+condicion+"&grupo="+cveGrupo)
  }

  rangoDeFechas2(fechaInicio:string, fechaFinal : string, condicion:number,cveGrupo : number):Observable<responseService>{
    return this.http.get<responseService>(this.api+"Tickets/ticketDashboard.php?fechaInicio2="+fechaInicio+"&fechaFin2="+fechaFinal+"&tipo2="+condicion+"&grupo2="+cveGrupo)
  }

  mostrarSinSeguimientos(fechaInicio:string, fechaFinal : string,cveGrupo : number):Observable<responseService>{
    return this.http.get<responseService>(this.api+"Tickets/ticketDashboard.php?fechaInicio3="+fechaInicio+"&fechaFin3="+fechaFinal+"&grupo3="+cveGrupo)
  }

  mostrarSinRespuestas(fechaInicio:string, fechaFinal : string,cveGrupo : number):Observable<responseService>{
    return this.http.get<responseService>(this.api+"Tickets/ticketDashboard.php?fechaInicio4="+fechaInicio+"&fechaFin4="+fechaFinal+"&grupo4="+cveGrupo)
  }

  rangoDeFechasForm(fechaInicio:string, fechaFinal : string, condicion:number,empresa:number,cveGrupo : number):Observable<responseService>{
    return this.http.get<responseService>(this.api+"Tickets/ticketDashboard.php?fechaInicio="+fechaInicio+"&fechaFin="+fechaFinal+"&filtro="+condicion+"&empresa="+empresa+"&grupo="+cveGrupo)
  }

  cargarTablaSinSeguimientoRespuesta(fechaInicio:string, fechaFinal : string, condicion:number,cveGrupo : number):Observable<responseService>{
    return this.http.get<responseService>(this.api+"Tickets/ticketDashboard.php?fechaInicio5="+fechaInicio+"&fechaFin5="+fechaFinal+"&filtro5="+condicion+"&grupo5="+cveGrupo)
  }

  cargarDentroFueraEstandar(fechaInicio:string, fechaFinal : string, condicion:number,cveGrupo : number, estandar:number):Observable<responseService>{
    return this.http.get<responseService>(this.api+"Tickets/ticketDashboard.php?fechaInicio6="+fechaInicio+"&fechaFin6="+fechaFinal+"&filtro6="+condicion+"&grupo6="+cveGrupo+"&estandar="+estandar)
  }

  mostrarTicketMalo(fechaInicio:string, fechaFinal : string,cveGrupo : number, minuto:number):Observable<responseService>{
    return this.http.get<responseService>(this.api+"Tickets/ticketDashboard.php?fechaInicio7="+fechaInicio+"&fechaFin7="+fechaFinal+"&grupo7="+cveGrupo+"&minuto="+minuto)
  }

  mostrarTablaTicketMalo(fechaInicio:string, fechaFinal : string,cveGrupo : number, minuto:number, idus:number):Observable<responseService>{
    return this.http.get<responseService>(this.api+"Tickets/ticketDashboard.php?fechaInicio="+fechaInicio+"&fechaFin="+fechaFinal+"&grupo="+cveGrupo+"&minuto="+minuto+"&id="+idus)
  }
}