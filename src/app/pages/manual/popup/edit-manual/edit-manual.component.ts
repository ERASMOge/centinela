import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { ManualService } from 'src/app/core/services/manual.service';
import { ManualModel } from 'src/app/models/manual.model';

@Component({
  selector: 'app-edit-manual',
  templateUrl: './edit-manual.component.html',
  styleUrls: ['./edit-manual.component.css']
})
export class EditManualComponent implements OnInit {
  manualmodel=new ManualModel()

nombre:string=""

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private manualservice : ManualService
    ,public dialogRef: MatDialogRef<EditManualComponent>) { }
  
    ngOnInit(): void {
    }


    async confirmar(nombre:string){
      
      this.manualmodel.nombre = nombre
      this.manualmodel.id = this.data.idManual
     
          await lastValueFrom(this.manualservice.updateManual(this.manualmodel)); 
          
          this.dialogRef.close('Se ha Actualizado con exito');
        
    }
  
  }