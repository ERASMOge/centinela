import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NotifyService } from 'src/app/core/services/notify.service';
import { NotificationModel } from 'src/app/models/notification.model';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-notify-config',
  templateUrl: './notify-config.component.html',
  styleUrls: ['./notify-config.component.css']
})
export class NotifyConfigComponent implements OnInit {
  notifymodel = new NotificationModel
  correo_pago:string=""
  correo_caido:string=""
  no_movil:string=""
  private readonly notifier: NotifierService;


  constructor(private notifyservice:NotifyService,notifierService: NotifierService) {
    this.notifier = notifierService;

   }

  ngOnInit(): void {
    this.notifyservice.llamarNotify().toPromise().then( (result : any) =>{
      this.correo_pago=result.container[0]["correo_pago"]
      this.correo_caido=result.container[0]["correo_caido"]
      this.no_movil=result.container[0]["no_movil"]
       });
  }

  async editarNotify (correo_pago:string,correo_caido:string,no_movil:string){    
    this.notifymodel.correo_pago = correo_pago
    this.notifymodel.correo_caido = correo_caido
    this.notifymodel.no_movil = no_movil


    lastValueFrom(this.notifyservice.updateNotify(this.notifymodel));  
            
  }
  notify(){
    this.notifier.notify('success', 'Informacion actualizada');
  }
}
