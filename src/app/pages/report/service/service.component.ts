import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-services',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  ELEMENT_DATA : any = [{
    id:"1",
    servicio:"1",
    plan:"1",
    rs:"1",
    ip:"1",
    estado:"1",
    ciudad:"1"
  }]
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['id', 'servicio','plan','rs','Ip','estado','ciudad'];
  constructor() { }

  ngOnInit(): void {
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminar(){

  }

  editar(){
    
  }
}
