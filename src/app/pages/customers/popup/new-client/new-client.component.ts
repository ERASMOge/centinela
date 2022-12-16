import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { CustomerService } from '../../../../core/services/customer.service';
@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css']
})
export class NewClientComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private customerService : CustomerService,public dialogRef: MatDialogRef<NewClientComponent>) { }


  ngOnInit(): void {
 
  }

  crearCliente(select : number, empresa : string, nombre : string){
    
    if(this.data.opc == false){
      if(empresa.length >0 && nombre.length > 0 && select !=undefined ){     
    lastValueFrom(this.customerService.insertaCliente({empresa:empresa, nombre: nombre,estatus:select}));
    this.dialogRef.close({empresa:empresa, nombre: nombre,estatus:select, mensaje:"Se pudo"})
      }else{
        alert("Llene todos los datos")
      }
    }else{
      if(empresa.length >0 && nombre.length > 0 && select !=undefined){
      lastValueFrom(this.customerService.acualizarCliente({id:this.data.id,empresa:empresa, nombre: nombre,estatus:select, idCliente:+this.data.idSegment}));
      this.dialogRef.close({empresa:empresa, nombre: nombre,estatus:select, mensaje:"Se pudo"})
    }else{
      alert("Llene todos los datos")
    }
    }
  }

}
