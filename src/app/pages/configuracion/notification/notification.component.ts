import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotifierService } from 'angular-notifier';
import { NotifyService } from 'src/app/core/services/notify.service';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  private readonly notifier: NotifierService;
  notify : any = []
  constructor(  private notifyService : NotifyService,notifierService: NotifierService,) {
    this.llenarTabla();
    this.notifier = notifierService;

  }
  selectedRowsChecked = [];
  ELEMENT_DATA: any = [ ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
 
  cargando = false;
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;
  mayorNumero : number = 0
 


  ngOnInit(): void {
   
  }

  notificacion(){

    this.notifier.notify('warning', 'Conexion Fallida');
   

  
    
    this.notifyService.insertarNotify({asunto:"warning Conexion Fallida", contenido: "conexion faillida del servidor 10.203.254.13"}).toPromise();
  }


  async llenarTabla(){
   
   

    await this.notifyService.llamarNotify().toPromise().then( (result : any) =>{
      

      for (let i=0; i<result.container.length; i++){
      this.notify.push(
        {asunto: result.container[i]["asunto"],contenido:result.container[i]["contenido"]})
      
    
    }
      
    });
      
  }

          
    
  
}






