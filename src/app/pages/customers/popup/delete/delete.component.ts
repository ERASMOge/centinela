import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ContactService } from 'src/app/core/services/contact.service';
import { DeviceService } from 'src/app/core/services/device.service';
import { LogService } from 'src/app/core/services/log.service';
import { RsService } from 'src/app/core/services/rs.service';
import { ServiceService } from 'src/app/core/services/services.service';
import { log_clienteEmpresa } from 'src/app/models/log_clienteEmpresa.model';
import { CustomerService } from '../../../../core/services/customer.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  id :number = Number(this.ruta.url.split("/")[3]);
  mensaje : string = ""
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private servicioCliente : CustomerService, private serviceService : ServiceService,public dialogRef: MatDialogRef<DeleteComponent>
  ,private contact : ContactService, private rs : RsService, private deviceService:DeviceService, private authService:AuthService,
  private logServicio:LogService, private ruta : Router, private logService : LogService) { }
  $sub = new Subscription();
  logModel = new log_clienteEmpresa();
  ngOnInit(): void {
    this.mensaje = "¿Estas seguro que desea eliminarlo?";
    switch(Number(this.data.opc)){
      case 0:
        break;
      case 1:
      
        break;
      case 2:
        break;
      case 3: 
      this.mensaje = "Si elimina esta razon social, los servicios relacionados se eliminaran tambien";       
        break;
      case 4:
        this.mensaje = "Si elimina este servicio, los tickets relacionados se eliminaran tambien";       

        break;  
      case 5:
        break;
      case 6:
        break;  
      case 7:        
        break;
      case 8:
        break;
      case 9:
        break;
    }
  }
  

  async confirmar(){
    this.data.salir = false;
    this.logModel.cveUsuario = this.authService.getCveId();
    this.logModel.cveCliente = this.id;
    this.logModel.tipo[0] = 2;
    this.logModel.cve = this.data.idCliente;
    switch(Number(this.data.opc)){
      case 0:
        await lastValueFrom(this.servicioCliente.eliminarFalso(this.data.idCliente));
        break;
      case 1:
        await lastValueFrom(this.contact.deleteContactos_tServicos(this.data.idCliente));
        await lastValueFrom(this.logServicio.insertLog(this.logModel,1));
        break;
      case 2:
        await lastValueFrom(this.servicioCliente.eliminarFalso(this.data.idCliente));
        break;
      case 3:        
        await lastValueFrom(this.rs.deleteRS(this.data.idCliente));
        await lastValueFrom(this.logServicio.insertLog(this.logModel,3));
        break;
      case 4:
        this.logModel.cve = this.data.identificador;
        await lastValueFrom(this.serviceService.deleteService(this.data.idCliente));
        await lastValueFrom(this.logServicio.insertLog(this.logModel,2));
        break;  
      case 5:
        await lastValueFrom(this.servicioCliente.eliminarFalso(this.data.idCliente));
        break;
      case 6:
        await lastValueFrom(this.deviceService.eliminarRouter(this.data.idCliente));
        break;  
      case 7:        
          await lastValueFrom(this.deviceService.eliminarRadio(this.data.idCliente));
        break;
      case 8:
        await lastValueFrom(this.deviceService.eliminarOtros(this.data.idCliente));
        break;
      case 9:
        await lastValueFrom(this.logService.deleteLog(this.data.idCliente));
        break;
    }
    this.dialogRef.close('Se ha eliminado con exito');
  }

  ngOnDestroy(): void {
    
  }
  salir(){
    this.dialogRef.close()
  }
  closeDialog(){
    this.$sub.unsubscribe();
  }
}
