import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ContactModel } from '../../models/contact.model';
import { Observable } from 'rxjs';
import { responseService } from 'src/app/models/responseService.model';
import { ContactServiceModel } from 'src/app/models/contactService.model';
@Injectable({
  providedIn: 'root'
})
export class ContactService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  /**Carpeta de repetidores */
  llamarContacto(cve : number) {        
    return this.http.get(this.local+"Repeater/contact.php?id="+cve);
  }

  insertarContacto(input : ContactModel){    
    return this.http.post(this.local+"Repeater/contact.php",input, {responseType:"text" });
  }

  deleteContacto(input : number){    
    return this.http.patch(this.local+"Repeater/contact.php?id="+input, {responseType:"text" });
  }

  updateContacto(input : ContactModel){    
    return this.http.patch(this.local+"Repeater/contact.php",input, {responseType:"text" });
  }

  /**Carpeta de servicios */
  llamarTodosContactos() : Observable<responseService>{
    return this.http.get<responseService>(this.local+"Services/contacts.php?todos=true");  
  }

  llamarContactos_tServicos(cve : number): Observable<responseService>{        
    return this.http.get<responseService>(this.local+"Services/contacts.php?cve="+cve);
  }

  llamarContactos_tServicos_servicios(cve : number) : Observable<responseService>{        
    return this.http.get<responseService>(this.local+"Services/contacts.php?cveCliente="+cve);
  }
  
  llamarContactos_maxId(): Observable<responseService>{        
    return this.http.get<responseService>(this.local+"Services/contacts.php");
  }

  deleteContactos_tServicos(cve : number): Observable<responseService>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<responseService>(this.local+"Services/contacts.php?cve="+cve, {headers});
  }

  /**Este trae todos los servicios del cliente */
  llamarContactos_tContactos_cliente(cve : number, identificador : string) : Observable<responseService>{ 
    return this.http.get<responseService>(this.local+"Services/contacts.php?cveCliente="+cve+"&identificador="+identificador);
  }

  llamar_Contactos_OnlyServicio(cve : number, identificadorNum : number, condicion:number, identificadorCom : string){    
    return this.http.get<responseService>(this.local+"Services/contacts.php?cve="+cve+"&contador="+identificadorNum+"&condicion="+condicion+"&identificador="+identificadorCom);
  }

  insertServicios_tServicos(input :ContactServiceModel):Observable<responseService>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.post<responseService>(this.local+"Services/contacts.php",input, {headers});
  }

  updateContacto_tServicio(input :ContactServiceModel):Observable<responseService>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<responseService>(this.local+"Services/contacts.php",input, {headers});
  }

  /**Insertar servicio y contacto */
  insertarContacto_Servicio(input :ContactServiceModel){
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.post<responseService>(this.local+"Services/contacts.php",input, {headers});
  }


  /**Regrese todos los servicios de un contacto */
  selectServicioPorContacto(identificador:string, idcontacto:number,condicion : number){   
    return this.http.get<responseService>(this.local+"Services/contacts.php?identificador="+identificador+"&idContacto="+idcontacto+"&condicion="+condicion);
  }
}
