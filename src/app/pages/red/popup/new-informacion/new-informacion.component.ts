import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
import { RepeaterService } from 'src/app/core/services/repeater.service';
import { InformacionRelevanteModel } from 'src/app/models/infoRelevante.model';

@Component({
  selector: 'app-new-informacion',
  templateUrl: './new-informacion.component.html',
  styleUrls: ['./new-informacion.component.css']
})
export class NewInformacionComponent implements OnInit {
  modeloRelevante = new InformacionRelevanteModel()

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private repService :RepeaterService, private aut : AuthService,
  public dialogRef: MatDialogRef<NewInformacionComponent>) { }

  ngOnInit() {
  }

  async crearContacto(select : number,comentario : string){
    this.modeloRelevante.comentario = comentario;
    this.modeloRelevante.estatus = select;
    this.modeloRelevante.cveUsuario = this.aut.getCveId();
    this.modeloRelevante.cveRepetidora = this.data.cveRepetidora;
    if(this.data.opc== false){
    await this.repService.insertarInformacionRelevante(this.modeloRelevante).toPromise()
    this.dialogRef.close({estatus:select,comentario:comentario,cveUsuario:this.aut.getCveId(), cveRepetidora:this.data.cveRepetidora, mensaje:"se pudo"});
    }else{
     
      //await this.repService.insertarInformacionRelevante({telefono:telefono, correo:correo, estatus:select,nombre:nombre,repetidora:this.data.cveRepetidora,id:this.data.id}).toPromise()
      //this.dialogRef.close({telefono:+telefono, correo:correo, estatus:select,nombre:nombre,repetidora:selectRep, mensaje:"se pudo"});   
    }
  }

  ver() : string{
    return this.data.repetidora;
  }

}
