import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { responseService } from "src/app/models/responseService.model";
import { environment } from 'src/environments/environment';
import { formNavSearchTicket } from 'src/app/interfaces/formNavSearchTicket.interface';

@Injectable({
    providedIn:'root'
})
export class SearchService {
    local = environment.api;
    constructor(private http:HttpClient){}

      llamarServicio(){ 
        return this.http.get(this.local+"Search/search.php");
      }

      llamarServicioEstatus(cve:number){
        return this.http.get(this.local+"Search/search.php?id="+cve);
      }
      

      // para el componente Ticket Entry

      searchTicketEntry(variable : string,opc:number):Observable<responseService>{
        return this.http.get<responseService>(this.local+"Search/searchTicketEntry.php?var="+variable+"&opc="+opc)
      }
      searchService(variable : string):Observable<responseService>{
        return this.http.get<responseService>(this.local+"Search/mainsearch.php?var="+variable)
      }

      searchContact(contacto : string):Observable<responseService>{
        return this.http.get<responseService>(this.local+"Search/mainsearch.php?contacto="+contacto)
      }
      searchTicket(ticket : string):Observable<responseService>{
        return this.http.get<responseService>(this.local+"Search/mainsearch.php?ticket="+ticket)
      }
      


      //Para el componente searchId   
      buscarMasIdentificadores(variable : number, condicion : number) :Observable<responseService>{
        return this.http.get<responseService>(this.local+"Search/searchIdentifier.php?var="+variable+"&cond="+condicion)
      }
      buscarNombres(variable : string, condicion : number) :Observable<responseService>{
        return this.http.get<responseService>(this.local+"Search/searchIdentifier.php?name="+variable+"&cond="+condicion)
      }

      //es para la vista all-ticket
      buscarPorNavbar(input:formNavSearchTicket){
        return this.http.post<responseService>(this.local+"Search/searchNavTicket.php",input)
      }
} 