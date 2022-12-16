import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EstandaresModel } from 'src/app/models/estandares.model';

@Injectable({
    providedIn: 'root'
  })
  export class EstandaresService {

    local = environment.api; 
    constructor(private http : HttpClient) { }

    insertarEstandar(input : EstandaresModel){
      return this.http.post(this.local+"Config/estandar.php",input, {responseType:"text"});
    }

    actualizarEstandar(input : EstandaresModel){
      return this.http.patch(this.local+"Config/estandar.php",input, {responseType:"text"});
    }

    mostrarEstandar(){
      return this.http.get(this.local+"Config/estandar.php");
    }
  }