import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { numberHosts } from 'ip-utils';
import { lastValueFrom, Observable } from 'rxjs';
import { DateService } from 'src/app/core/services/date.service';
import { DateModel } from 'src/app/models/date.model';
import { responseService } from 'src/app/models/responseService.model';
interface TimeZone {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {
  
  dateModel = new DateModel
fecha:string =""
hora:string=""
zona_horaria=""
llamarDatos :  Observable<responseService> | undefined
  selectedValue: string | undefined;
  Zones: TimeZone[] = [

    {value: 1, viewValue: 'Alpha Time Zone : UTC +1'},
    {value: 2, viewValue: 'Central Standard Time :UTC -6'},
    {value: 3, viewValue: 'Central Standard Time :UTC -6'},
    {value: 4, viewValue: 'Central Standard Time :UTC -6'},
    {value: 5, viewValue: 'Central Standard Time :UTC -6'},
    
  ];
  todayDate : Date = new Date();
  selectFormControl = new FormControl('', Validators.required);
  constructor(private dateservice :DateService) { }

  ngOnInit(): void {
    
    this.llamarDatos =  this.dateservice.llamarDate()
    this.dateservice.llamarDate().toPromise().then( (result : any) =>{
       


      
    if(result.container[0]["fecha"]==undefined || result.container[0]["fecha"]=="0000-00-00") {
      
      let date=  (new Date()).toLocaleDateString('en-US');
      var fecha=date.split("/",3)
    if(Number(fecha[0])<=9 && Number(fecha[1])<=9 ){
      this.fecha=fecha[2]+"-"+"0"+fecha[0]+"-"+"0"+fecha[1];
    }else if(Number(fecha[0])<=9){
      this.fecha=fecha[2]+"-"+"0"+fecha[0]+"-"+fecha[1];
    }else if(Number(fecha[1])<=9){
      this.fecha=fecha[2]+"-"+fecha[0]+"-"+"0"+fecha[1];
    }
    }else{
      this.fecha=result.container[0]["fecha"]
    }

        if(result.container[0]["hora"]==undefined|| result.container[0]["fecha"]=="00:00:00"){

          let hour=  (new Date()).getHours()
          let minute=  (new Date()).getMinutes()
          if(minute<=9){
            this.hora=hour+":"+"0"+minute+":00";
            
          }else{
            this.hora=hour+":"+minute+":00";
          }
        }else{
          
          this.hora=result.container[0]["hora"]
        }
        this.zona_horaria=result.container[0]["zona_horaria"]
  
    });

}


  async editarDate (hora:string,fecha:string,zona_horaria:number){   
    
    this.dateModel.hora=hora
    var date=fecha.split("/",3)
    this.dateModel.fecha=date[2]+"-"+date[0]+"-"+date[1];
    this.dateModel.zona_horaria=zona_horaria
    lastValueFrom(this.dateservice.updateDate(this.dateModel));  
            
  }


}
