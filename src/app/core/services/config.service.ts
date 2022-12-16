import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigModel } from '../../models/config.model';
import { ImageModel } from 'src/app/models/image.model';
import { LogoModel } from 'src/app/models/logo.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarEmpresa(){
    return this.http.get(this.local+"Config/config.php");
  }
  llamarImagen(){
    return this.http.get(this.local+"Config/config.php");
  }


  updateImage(input:ImageModel){
    return this.http.patch(this.local+"Config/config.php",input,{responseType: 'text'});
  
  }
  updateLogo(input:LogoModel){
    return this.http.patch(this.local+"Config/config.php",input,{responseType: 'text'});
  
  }

  insertarEmpresa(input :ConfigModel){
    return this.http.post(this.local+"Config/config.php",input, {responseType:"text"});
  }

  updateEmpresa(input :ConfigModel){
    return this.http.patch(this.local+"Config/config.php",input, {responseType:"text"});
  }

}
