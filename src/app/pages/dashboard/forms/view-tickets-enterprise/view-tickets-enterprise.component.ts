import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { dashboardTicketsService } from 'src/app/core/services/dashboardTickets.service';
import { responseService } from 'src/app/models/responseService.model';
import { NewEquipamentComponent } from 'src/app/pages/customers/popup/new-equipament/new-equipament.component';
import { RepeteadMethods } from 'src/app/pages/RepeteadMethods';



@Component({
  selector: 'app-view-tickets-enterprise',
  templateUrl: './view-tickets-enterprise.component.html',
  styleUrls: ['./view-tickets-enterprise.component.css']
})
export class ViewTicketsEnterpriseComponent{

  public  metodos = new RepeteadMethods()

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<ViewTicketsEnterpriseComponent>) { 
    
  }

 

}
