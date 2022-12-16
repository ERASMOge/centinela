import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { formTicketInterface } from "src/app/interfaces/formTicketInterface.interface";
import { dosParamsNum } from "src/app/interfaces/dosParamsNum.interface";
import { responseService } from "src/app/models/responseService.model";
import { environment } from 'src/environments/environment';
import {  contactsEmailTicket } from "../../models/contactsEmailTicket.model"
import { enviarComentarioInterface } from "src/app/interfaces/enviarComentario.interface";
import { ComentarioModel } from "src/app/models/comentario.model";

@Injectable({
    providedIn:'root'
})
export class TicketService {
    local = environment.api;

    constructor(private http:HttpClient){}

    llamarHistorial(cve:number) : Observable<responseService> {
        return this.http.get<responseService>(this.local+"Tickets/tickets.php?historial="+cve);
    }
    llamarTicket(cve:number) : Observable<responseService>{
        return this.http.get<responseService>(this.local+"Tickets/tickets.php?cve="+cve);
    }

    llamarRuta(ruta:string) : Observable<any>{
        let headers = new HttpHeaders().set('Content-type','Application/json');
        return this.http.get<responseService>(this.local+"Tickets/comentario.php?ruta="+ruta, {headers});
    }

    insertarComentario(input : ComentarioModel){
        let headers = new HttpHeaders().set('Content-type','Application/json');
        return this.http.post<responseService>(this.local+"Tickets/comentario.php",input, {headers});
    }

    tickets(cond : number,cve:number) : Observable<responseService>{
        return this.http.get<responseService>(this.local+"Tickets/tickets.php?cond="+cond+"&cve="+cve);
    }
    
    llamarTodo(cve:number,identificador:string) : Observable<responseService>{
        return this.http.get<responseService>(this.local+"Tickets/tickets.php?cve="+cve+"&identificador="+identificador);
    }
    
    deleteTickets(input : dosParamsNum){
        return this.http.patch<responseService>(this.local+"Tickets/tickets.php?ticket=true",input);
    }

    updateTickets() {
    }

    actualizarPropiedad(input : dosParamsNum) : Observable<responseService>{
        return this.http.patch<responseService>(this.local+"Tickets/tickets.php?propiedad=true",input);
    }

    actualizarEstado(input : dosParamsNum) : Observable<responseService>{
        return this.http.patch<responseService>(this.local+"Tickets/tickets.php?estado=true",input);
    }
    actualizarAgente(input : dosParamsNum) : Observable<responseService>{
        return this.http.patch<responseService>(this.local+"Tickets/tickets.php?agente=true",input);
    }
    actualizarGrupo(input : dosParamsNum) : Observable<responseService>{
        return this.http.patch<responseService>(this.local+"Tickets/tickets.php?grupo=true",input);
    }
    actualizarTipo(input : dosParamsNum) : Observable<responseService>{
        return this.http.patch<responseService>(this.local+"Tickets/tickets.php?tipo=true",input);
    }
    insertTickets(ticket:formTicketInterface) : Observable<responseService> {
        return this.http.post<responseService>(this.local+"Tickets/tickets.php",ticket);
    }


    //Enviar correoTicket 
    enviarCorreo(email: contactsEmailTicket) : Observable<responseService>{
        return this.http.post<responseService>(this.local+"Tickets/correoTicket.php",email);
    }

} 