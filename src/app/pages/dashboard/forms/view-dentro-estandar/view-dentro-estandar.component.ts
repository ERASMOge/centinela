import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RepeteadMethods } from 'src/app/pages/RepeteadMethods';

@Component({
  selector: 'app-view-dentro-estandar',
  templateUrl: './view-dentro-estandar.component.html',
  styleUrls: ['./view-dentro-estandar.component.css']
})
export class ViewDentroEstandarComponent {

  public  metodos = new RepeteadMethods()

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<ViewDentroEstandarComponent>) {
    
  }

}
