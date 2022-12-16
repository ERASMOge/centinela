import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { lastValueFrom } from 'rxjs';
import { CityService } from 'src/app/core/services/city.service';
import { MapsService } from 'src/app/core/services/maps.service';
import { MapsModel } from 'src/app/models/maps.model';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.css']
})
export class EditAddressComponent implements OnInit {
  direccionForm : FormGroup = this.fb.group({
    ciudad: [this.data.cveCiudad.toString() ? this.data.cveCiudad.toString(): '', Validators.required],
    estado: [this.data.estado ? this.data.estado: '', Validators.required],
    latitud: [this.data.coordenadas.split(",")[0].trim() ? this.data.coordenadas.split(",")[0].trim(): '', Validators.required],
    longitud: [this.data.coordenadas.split(",")[1].trim() ? this.data.coordenadas.split(",")[1].trim() : '', Validators.required],
    avenida: [this.data.avenida  ? this.data.avenida : '', Validators.required],
    numero: [this.data.numero ? this.data.numero : '', Validators.required],
    codigoPostal: [this.data.codigoPostal ? this.data.codigoPostal : '', Validators.required],
    colonia: [this.data.colonia ? this.data.colonia: '', Validators.required],
  })
  mapsModel = new MapsModel()
  ciudadesArray : any [] = [];
  @ViewChild('selectCiudad') ciudadSelect! : MatSelect;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,public dialogRef: MatDialogRef<EditAddressComponent>,
  private maps:MapsService, private ciudades: CityService) { }

  ngOnInit(): void {    
    this.todasCiudades()    
  }

  async enviar(){
    if(this.direccionForm.valid){
    this.mapsModel = this.direccionForm.value
    this.mapsModel.id = this.data.idServicio
    this.mapsModel.ciudad = this.ciudadSelect?._selectionModel.selected[0].viewValue    
    this.mapsModel.cveCiudad = Number(this.ciudadSelect.value)
    await lastValueFrom(this.maps.updateManual(this.mapsModel));
    this.dialogRef.close(this.mapsModel)
    }
    else{
    alert("Por favor llene los campos")
    }
  }

  todasCiudades(){
    this.ciudades.llamarCiudades().subscribe((resp:any)=>{
      this.ciudadesArray = resp.container;
    })
  }
}
