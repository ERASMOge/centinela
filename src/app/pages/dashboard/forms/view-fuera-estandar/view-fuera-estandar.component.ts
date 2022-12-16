import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RepeteadMethods } from 'src/app/pages/RepeteadMethods';

@Component({
  selector: 'app-view-fuera-estandar',
  templateUrl: './view-fuera-estandar.component.html',
  styleUrls: ['./view-fuera-estandar.component.css']
})
export class ViewFueraEstandarComponent {
  public  metodos = new RepeteadMethods()

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<ViewFueraEstandarComponent>) {
    
  }

}
