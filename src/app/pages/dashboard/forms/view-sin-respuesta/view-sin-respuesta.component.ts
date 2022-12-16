import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RepeteadMethods } from 'src/app/pages/RepeteadMethods';

@Component({
  selector: 'app-view-sin-respuesta',
  templateUrl: './view-sin-respuesta.component.html',
  styleUrls: ['./view-sin-respuesta.component.css']
})
export class ViewSinRespuestaComponent {
  public  metodos = new RepeteadMethods()

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<ViewSinRespuestaComponent>) {
    
  }

}
