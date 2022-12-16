import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { ManualService } from 'src/app/core/services/manual.service';

@Component({
  selector: 'app-delete-manual',
  templateUrl: './delete-manual.component.html',
  styleUrls: ['./delete-manual.component.css']
})
export class DeleteManualComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private manualservice : ManualService
  ,public dialogRef: MatDialogRef<DeleteManualComponent>) { }

  ngOnInit(): void {
  }
  async confirmar(){
    
        await lastValueFrom(this.manualservice.deleteManual(this.data.idManual)); 
        
        this.dialogRef.close('Se ha eliminado con exito');
      
  }

}
