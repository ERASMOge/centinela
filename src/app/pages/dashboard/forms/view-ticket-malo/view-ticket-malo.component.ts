import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RepeteadMethods } from 'src/app/pages/RepeteadMethods';

@Component({
  selector: 'app-view-ticket-malo',
  templateUrl: './view-ticket-malo.component.html',
  styleUrls: ['./view-ticket-malo.component.css']
})
export class ViewTicketMaloComponent {

  public  metodos = new RepeteadMethods()

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<ViewTicketMaloComponent>) { 
    
  }

}
