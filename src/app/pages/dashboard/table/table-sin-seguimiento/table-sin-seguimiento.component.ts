import { Component, OnInit,  Input, ViewChild  } from '@angular/core';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { AuthService } from 'src/app/core/services/auth.service';
import { dashboardTicketsService } from 'src/app/core/services/dashboardTickets.service';
import { responseService } from 'src/app/models/responseService.model';
import { NewEquipamentComponent } from 'src/app/pages/customers/popup/new-equipament/new-equipament.component';
import { ViewSinSeguimientoComponent } from '../../forms/view-sin-seguimiento/view-sin-seguimiento.component';


interface tickets {
  idTicket: number;
  servicio:string;
  fechaAbierta:string;
  fechaCerrada:string | undefined;
  grupo:string;
  estado:string;
  fechaCompleta:string;
}

@Component({
  selector: 'app-table-sin-seguimiento',
  templateUrl: './table-sin-seguimiento.component.html',
  styleUrls: ['./table-sin-seguimiento.component.css']
})
export class TableSinSeguimientoComponent implements OnInit {

  cargando : boolean = false;

  ELEMENT_DATA:  tickets[] = [ ];
  tickets:tickets []= [];
  @Input() selectedFake : string = ""
  @Input() selectedFake2 : string = ""
  @Input() estatus : number = 0
  @Input() horaAntigua : string = ""
  @Input() horaActual : string = ""

  @Input() dialogRef? :  MatDialogRef<ViewSinSeguimientoComponent>
  
  displayedColumns: string[] = ['idTicket', 'servicio', 'fechaAbierta', 'fechaCerrada','grupo','estado','fechaCompleta'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild ("paginator") paginator!:MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;


  inicio : number=0;
  fin : number=6;
  
  constructor(private serviceDash : dashboardTicketsService,private auth :AuthService) { }


  ngOnInit() : void{
    this.cargarTablaSinSeguimiento();
  }

  async cargarTablaSinSeguimiento(){
    let fecha1 = this.selectedFake+" "+this.horaAntigua;
    let fecha2 = this.selectedFake2+" "+this.horaActual;
    this.cargando = false;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    await this.serviceDash.cargarTablaSinSeguimientoRespuesta(fecha1,fecha2,this.estatus,this.auth.getCveGrupo()).subscribe( (resp:any) =>{
      if(resp.container.length !=0){
      this.tickets = resp.container;
      for (const iterator of this.tickets) {
        this.ELEMENT_DATA.push(
          {idTicket:iterator.idTicket,
            servicio:iterator.servicio,
            fechaAbierta:iterator.fechaAbierta ,
            fechaCerrada:iterator.fechaCerrada,
            grupo:iterator.grupo,
            estado:iterator.estado,
            fechaCompleta:iterator.fechaCompleta
          }
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
