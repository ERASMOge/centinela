import {Injectable, EventEmitter, Output} from "@angular/core";    

@Injectable({
  providedIn: 'root'
})

export class DataService {
  constructor (){}
  @Output() open : EventEmitter<any> = new EventEmitter();

   despejarEvent(){
  }
 
}
