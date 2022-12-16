import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RepeteadMethods } from 'src/app/pages/RepeteadMethods';

@Component({
  selector: 'app-view-sin-seguimiento',
  templateUrl: './view-sin-seguimiento.component.html',
  styleUrls: ['./view-sin-seguimiento.component.css']
})
export class ViewSinSeguimientoComponent {

  public  metodos = new RepeteadMethods()
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<ViewSinSeguimientoComponent>) {
    
   }

}
