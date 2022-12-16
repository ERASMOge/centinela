import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NotifyModel } from 'src/app/models/notify.model';
import { NotificationModel } from 'src/app/models/notification.model';


@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarNotify(){
    return this.http.get(this.local+"Config/notify.php");
  }
  insertarNotify(input :NotifyModel){
    return this.http.post(this.local+"Config/notify.php",input, {responseType:"text"});
  }
  updateNotify(input:NotificationModel){
    
    return this.http.patch(this.local+"Config/notify.php",input,{responseType: 'text'});

  }

  

}
