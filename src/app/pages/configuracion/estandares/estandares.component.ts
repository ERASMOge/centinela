import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { EstandaresService } from 'src/app/core/services/estandar.service';
import { EstandaresModel } from 'src/app/models/estandares.model';

@Component({
  selector: 'app-estandares',
  templateUrl: './estandares.component.html',
  styleUrls: ['./estandares.component.css']
})
export class EstandaresComponent implements OnInit {

  estandarModel = new EstandaresModel
  estandar:number=0
  tiempo:number=0
  minutoTikCerrado:number=0
  private readonly notifier: NotifierService;

  constructor(private estandarService: EstandaresService, notifierService: NotifierService) { this.notifier = notifierService}

  ngOnInit() : void{
    this.estandarService.mostrarEstandar().toPromise().then( (result : any) =>{
      this.estandar = result.container[0]["estandar"]
      this.tiempo = result.container[0]["tiempo"]      
      this.minutoTikCerrado = result.container[0]["minutoTikCerrado"]
    });
  }

  async guardarEstandares(estandar:any, tiempo:any, minuto:any){

    this.estandarModel.estandar = estandar;
    this.estandarModel.tiempo = tiempo;
    this.estandarModel.minutoTikCerrado = minuto;
    lastValueFrom(this.estandarService.actualizarEstandar(this.estandarModel));
    this.notify()
  }
  notify(){
    this.notifier.notify('success', 'Información actualizada');
  }

}
