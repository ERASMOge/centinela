import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { AuthService } from 'src/app/core/services/auth.service';
import { dashboardTicketsService } from 'src/app/core/services/dashboardTickets.service';
import { ViewTicketMaloComponent } from '../../forms/view-ticket-malo/view-ticket-malo.component';

interface tickets {
  idTicket: number;
  servicio:string;
  fechaAbierta:string;
  fechaCerrada:string | undefined;
  grupo:string;
  estado:string; 
}

@Component({
  selector: 'app-table-ticket-malo',
  templateUrl: './table-ticket-malo.component.html',
  styleUrls: ['./table-ticket-malo.component.css']
})
export class TableTicketMaloComponent implements OnInit {

  cargando : boolean = false;

  ELEMENT_DATA:  tickets[] = [ ];
  tickets:tickets []= [];
  @Input() selectedFake : string = ""
  @Input() selectedFake2 : string = ""
  @Input() minuto : number = 0
  @Input() idUsuario : number = 0

  @Input() dialogRef? :  MatDialogRef<ViewTicketMaloComponent>

  displayedColumns: string[] = ['idTicket', 'servicio', 'fechaAbierta', 'fechaCerrada','grupo','estado'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild ("paginator") paginator!:MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;


  inicio : number=0;
  fin : number=6;

  constructor(private serviceDash : dashboardTicketsService,private auth :AuthService) { }


  ngOnInit() {
    this.cargarTabla()
  }

  async cargarTabla(){
    this.cargando = false;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    await this.serviceDash.mostrarTablaTicketMalo(this.selectedFake,this.selectedFake2,this.auth.getCveGrupo(),this.minuto, this.idUsuario).subscribe( (resp:any) =>{
      if(resp.container.length !=0){
      this.tickets = resp.container;
      for (const iterator of this.tickets) {
        this.ELEMENT_DATA.push(
          {idTicket:iterator.idTicket,
            servicio:iterator.servicio,
            fechaAbierta:iterator.fechaAbierta ,
            fechaCerrada:iterator.fechaCerrada,
            grupo:iterator.grupo,
            estado:iterator.estado}
        );
      }
     
      this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator;    
      this.dataSource.sort =  this.sort;
    }else{
      this.ELEMENT_DATA = [];
    }
    this.cargando = true;

    });
    
  }

  hayUsers(){
    if(this.ELEMENT_DATA.length != 0 || this.cargando ==false){
      return true;
    }else{
      return false;
    }
  }


  salirForm(){
    this.dialogRef?.close()
  }

}
