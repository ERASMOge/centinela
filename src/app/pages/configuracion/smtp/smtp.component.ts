import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { SmtpService } from 'src/app/core/services/smtp.service';
import { SmtpModel } from 'src/app/models/smtp.model';
import { runInThisContext } from 'vm';
import { NotifierService } from 'angular-notifier';
interface auth {
  value: number;
  viewValue: string;
}
interface secure {
  value: number;
  viewValue: string;
}
interface kindauth {
  value: number;
  viewValue: string;
}
interface lim_envios{
value:number;
viewValue:string
}



@Component({
  selector: 'app-smtp',
  templateUrl: './smtp.component.html',
  styleUrls: ['./smtp.component.css']
})
export class SmtpComponent implements OnInit {
  private readonly notifier: NotifierService;

password=""
host=""
username=""
lim_env=0
lim_corr=""
auth=0
smtp_secure=0
port=""

  smtModel = new SmtpModel
  auths: auth[] = [
    {value: 1, viewValue: 'Si'},
    {value: 2, viewValue: 'No'},
  ];
  selectedAuth = this.auths[0].value;
  secures: secure[] = [
    {value: 1, viewValue: 'Ninguna'},
    {value: 2, viewValue: 'Maxima'},
  ];
  kinds: kindauth[] = [
    {value: 1, viewValue: 'Usuario y contraseña'},
    {value: 2, viewValue: 'Cosas Locas'},
  ];

   selectlim_envio: lim_envios[] = [
    {value: 1, viewValue: 'Limite por dia '},
    {value: 2, viewValue: 'Limite por hora'},
  ];
  

  
  constructor(private smtpservice:SmtpService,notifierService: NotifierService) { 
    this.notifier = notifierService;

  }

  ngOnInit(): void {
    this.smtpservice.llamarSmtp().toPromise().then( (result : any) =>{
      this.lim_env=result.container[0]["lim_env"]
      this.lim_corr=result.container[0]["lim_corr"]
      this.host=result.container[0]["host"]
      this.auth=result.container[0]["auth"]
      this.username=result.container[0]["username"]
      this.password=result.container[0]["password"]
      this.smtp_secure=result.container[0]["smtp_secure"]
      this.port=result.container[0]["port"]
      
       });
    

  }
  async editarSmtp (lim_env:number,lim_corr:string,host:string,auth:number,username:string,password:string,smtp_secure:number,port:string){    
    this.smtModel.lim_env = lim_env
    this.smtModel.lim_corr=lim_corr
    this.smtModel.host=host
    this.smtModel.auth=auth
    this.smtModel.username=username
    this.smtModel.password=password
    this.smtModel.smtp_secure=smtp_secure
    this.smtModel.port=port
    lastValueFrom(this.smtpservice.updateSmtp(this.smtModel));  
    
            
  }
  notify(){
    this.notifier.notify('success', 'Informacion actualizada');
  }


  
 async smtpMail(){
  this.smtpservice.llamarSmtp().toPromise().then( (result : any) =>{
    /**this.lim_env=result.container[0]["lim_env"]*/
    /**this.lim_corr=result.container[0]["lim_corr"]*/
    this.smtModel.host=result.container[0]["host"]
    /**this.auth=result.container[0]["auth"]*/
    this.smtModel.username=result.container[0]["username"]
    this.smtModel.password=result.container[0]["password"]
    /**this.smtp_secure=result.container[0]["smtp_secure"]*/
    this.smtModel.port=result.container[0]["port"]
    lastValueFrom(this.smtpservice.smtpMail(this.smtModel));  
     });
  
 
  
}



  smtpConfig(){

  }

  

}

