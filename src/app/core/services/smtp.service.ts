import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NotifyModel } from 'src/app/models/notify.model';
import { SmtpModel } from 'src/app/models/smtp.model';

@Injectable({
  providedIn: 'root'
})
export class SmtpService {
  local = environment.api; 
  constructor(private http : HttpClient, private smtpservice:SmtpService) { }

  llamarSmtp(){
  
    return this.http.get(this.local+"Config/smtp.php");
  }

  

  updateSmtp(input:SmtpModel){
    return this.http.patch(this.local+"Config/smtp.php",input,{responseType: 'text'});
  }

  insertarNotify(input :SmtpModel){
    return this.http.post(this.local+"Config/smtp.php",input, {responseType:"text"});
  }
smtpMail(input:SmtpModel){
  return this.http.post(this.local+"correoAlta.php",input, {responseType:"text"});
  
  
}
  

}
