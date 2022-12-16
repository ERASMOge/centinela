import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { AuthService } from 'src/app/core/services/auth.service';
import { dashboardTicketsService } from 'src/app/core/services/dashboardTickets.service';
import { responseService } from 'src/app/models/responseService.model';
import { NewEquipamentComponent } from 'src/app/pages/customers/popup/new-equipament/new-equipament.component';
import { ViewEstatusEnterpriseComponent } from '../../forms/view-estatus-enterprise/view-estatus-enterprise.component';
import { ViewTicketsEnterpriseComponent } from '../../forms/view-tickets-enterprise/view-tickets-enterprise.component';




interface tickets {
  idTicket: number;
  servicio:string;
  fechaAbierta:string;
  fechaCerrada:string | undefined;
  grupo:string;
  estado:string; 
}

@Component({
  selector: 'app-table-tickets',
  templateUrl: './table-tickets.component.html',
  styleUrls: ['./table-tickets.component.css']
})
export class TableTicketsComponent implements OnInit {
  cargando : boolean = false;

  ELEMENT_DATA:  tickets[] = [ ];
  tickets:tickets []= [];
  @Input() selectedFake : string = ""
  @Input() selectedFake2 : string = ""
  @Input() estatus : number = 0
  @Input() empresa : number = 0

  @Input() dialogRef? :  MatDialogRef<ViewTicketsEnterpriseComponent | ViewEstatusEnterpriseComponent>
  
  displayedColumns: string[] = ['idTicket', 'servicio', 'fechaAbierta', 'fechaCerrada','grupo','estado'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild ("paginator") paginator!:MatPaginator;


  inicio : number=0;
  fin : number=6;
  
  constructor(private serviceDash : dashboardTicketsService,private auth :AuthService) { }

  ngOnInit(): void {    
    this.cargarInicio();
    //this.cargarTablaSinSeguimiento();
  }

  async cargarInicio(){
    this.serviceDash.rangoDeFechasForm(this.selectedFake,this.selectedFake2,this.estatus,this.empresa,this.auth.getCveGrupo()).subscribe(async(res : responseService)=>{    
      this.ELEMENT_DATA=[];   
      this.tickets =  res.container     
      this.dataSource = new MatTableDataSource();
       while (this.inicio < this.fin + 2 && this.inicio <  this.tickets.length) {
      if(this.inicio < this.fin){              
        this.ELEMENT_DATA[this.inicio] =  (    
          {
            idTicket:res.container[this.inicio].idTicket,
            servicio:res.container[this.inicio].servicio,
            fechaAbierta:res.container[this.inicio].fechaAbierta,
            fechaCerrada:res.container[this.inicio].fechaCerrada,
            grupo:res.container[this.inicio].grupo,
            estado:res.container[this.inicio].estado
          });        
        }
      this.inicio++      
      }    
      if(this.ELEMENT_DATA.length == 0 ){
        //this.comentario = false;
      }else {
        //this.comentario = true;
      }          
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;    
      this.paginator.length =   await res.container.length;        
      })
  }

  
  hayUsers(){
    if(this.ELEMENT_DATA.length != 0 || this.cargando ==false){
      return true;
    }else{
      return false;
    }
  }

  async pageEvents(event: any) {  
    if(event.previousPageIndex > event.pageIndex) {
    this.inicio = (this.inicio-(this.inicio%6)) - 12;    
    if(this.inicio < 0){
      this.inicio = 0;
    }
    this.fin =  (this.fin - (this.fin%6)) - 6;    
    await this.cargarSiguientePag();
  } else {
    this.inicio = this.fin;
    this.fin = this.fin + 6;
    await this.cargarSiguientePag();
  }
}

  async cargarSiguientePag(){
    /*this.comentario = true
    this.cargando = false;*/
    this.ELEMENT_DATA=[];
    this.dataSource = new MatTableDataSource();
   while (this.inicio < this.fin + 2 && this.inicio < this.tickets.length) {
    if(this.inicio < this.fin){              
      this.ELEMENT_DATA[this.inicio] =  (    
        {
          idTicket:this.tickets[this.inicio].idTicket,
          servicio:this.tickets[this.inicio].servicio,
          fechaAbierta:this.tickets[this.inicio].fechaAbierta,
          fechaCerrada:this.tickets[this.inicio].fechaCerrada,
          grupo:this.tickets[this.inicio].grupo,
          estado:this.tickets[this.inicio].estado
        });        
      }
    this.inicio++      
    }
    if(this.ELEMENT_DATA.length == 0 ){
      //this.comentario = false;
    }else {
      //this.comentario = true;
    }
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;    
    this.paginator.length =  await this.tickets.length;  
   // this.cargando = true; 
    }


  salirForm(){
    this.dialogRef?.close()
  }

  


}
