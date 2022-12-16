import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { responseService } from 'src/app/models/responseService.model';
import { environment } from 'src/environments/environment';
import { ClienteModel } from '../../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http : HttpClient) { }

  local = environment.api; 

  clienteEstatus(opc : number){
    return this.http.get(this.local+"Customer/customer.php?opc="+opc);
  }
  clientesTodos(){
    return this.http.get(this.local+"Customer/customer.php");
  }
  insertaCliente(input :ClienteModel){
    return this.http.post(this.local+"Customer/customer.php",input, {responseType: 'text'});
  }
  clienteRepetido(nombre:String){
    return this.http.get(this.local+"Customer/customer.php?nombre="+nombre);
  }
  eliminarFalso(id:String): Observable<any>{
    return this.http.patch<any>(this.local+"Customer/customer.php?id="+id,{responseType: 'text'});
  }
  acualizarCliente(input :ClienteModel){
    return this.http.patch(this.local+"Customer/customer.php",input,{responseType: 'text'});
  }
  buscarCliente(cve : number) : Observable<responseService>{
    return this.http.get<responseService>(this.local+"Customer/customer.php?cve="+cve);
  }
}
