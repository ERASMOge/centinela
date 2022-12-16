import { Component, Inject, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { MatRadioButton } from '@angular/material/radio';
import { lastValueFrom, map, Observable, startWith } from 'rxjs';
import { SearchService } from 'src/app/core/services/search.service';
import { responseService } from 'src/app/models/responseService.model';

export interface buscarNombres {
  id : number,
  nombre : string
}

export interface buscarIdentificador {
  id : number,
  categoria : number
}

@Component({
  selector: 'app-search-id',
  templateUrl: './search-id.component.html',
  styleUrls: ['./search-id.component.css']
})
export class SearchIdComponent  {

  controlEmpresa =new FormControl("")
  controlServicio =new FormControl("")
  controlRazon =new FormControl("")

  filtradoEmpresa: Observable<buscarNombres[]> =  new Observable<buscarNombres[]>();
  filtradoServicio: Observable<buscarNombres[]> = new Observable<buscarNombres[]>();
  filtradoRazon: Observable<buscarNombres[]> = new Observable<buscarNombres[]>();

  opcionesEmpresa: any[] = [];
  opcionesServicio: any[] = [];
  opcionesRazon: any[] = [];
  datosServicio : buscarNombres | undefined;
  idEmpresa : number = 0;
  idServicio : number = 0;
  idsGuardado : Array<number> = [0,0,0]
  bIdentificador : buscarIdentificador | undefined
  identificadorSelec : string =""

  @ViewChild("idNombre") iNombre! : MatInput
  @ViewChild('placeholder', {read: ViewContainerRef, static: true}) placeholder!: ViewContainerRef;

  constructor(private fb :FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, 
  public dialogRef: MatDialogRef<SearchIdComponent>, private _renderer : Renderer2, private serviceSearch:SearchService) { 
  }

  
  
  createComponent(input: { title: string, id: string, state: boolean },_event? : any) {
    let titleElm = this._renderer.createText(input.title);
    let ref = this.placeholder?.createComponent(MatRadioButton)
    ref.instance.value = input.id;
    ref.instance.checked = input.state;
    ref.instance.color = "primary"
    
    let elm = ref.location.nativeElement as HTMLElement | any;  
    elm.firstChild.lastChild.appendChild(titleElm);
    this._renderer.addClass(elm, 'mat-radio-button')
    this._renderer.setStyle(elm,"margin-bottom","10px")
    ref.changeDetectorRef.detectChanges();
  }

  //enviar el identificador ya seleccioanda en el checkbox
  enviarIdentificador(){
      if(this.identificadorSelec !== "")
      {        
        this.dialogRef.close(this.identificadorSelec)
      }else{
        alert("Por favor ingrese seleccione un identificador");
      }
  }


  seleccionado(target:any){
    this.identificadorSelec = target.source.value;
  }

  //boton para buscar el identificador de los tres campos
  buscarIdentificador(){    
    this.identificadorSelec = ""
    this.placeholder.clear()
    if(this.controlEmpresa.value !== "" || this.controlRazon.value !== "" || this.controlServicio.value !== ""){      
      this.serviceSearch.buscarMasIdentificadores(this.bIdentificador?.id!,this.bIdentificador?.categoria!).subscribe(async(resp:responseService)=>{
       for await (const i of resp.container) {
        this.createComponent({title:i.identificador+" - "+i.nombre,id:i.identificador, state:false})
       }
          
      })
      }else{
        alert("Por favor ingrese seleccione un identificador");
      }
  }


  //input de nombre de empresa
  buscarEmpresa(palabra : string, event : any){
    this.auxBuscador(palabra,event,1);
    if(palabra !== ""){
      this._renderer.setAttribute(document.getElementById("iServicio"), "disabled", "true")   
      this._renderer.setAttribute(document.getElementById("iRazon"), "disabled", "true")  
    }else{
      this._renderer.removeAttribute(document.getElementById("iServicio"), "disabled")   
      this._renderer.removeAttribute(document.getElementById("iRazon"), "disabled")
    }
  }

  empresaSeleccionada(opcion : buscarNombres){
    this.idsGuardado[0] = opcion.id
    this.bIdentificador = {
      id : opcion.id,
      categoria : 1
    }
  }

  //input de nombre de razon social
  buscarRazon(palabra : string, event : any){
   this.auxBuscador(palabra,event,2);
   if(palabra !== ""){
    this._renderer.setAttribute(document.getElementById("iServicio"), "disabled", "true")   
    this._renderer.setAttribute(document.getElementById("iEmpresa"), "disabled", "true")
  }else{
    this._renderer.removeAttribute(document.getElementById("iServicio"), "disabled")   
    this._renderer.removeAttribute(document.getElementById("iEmpresa"), "disabled")
  }
  }

  razonSeleccionada(opcion : buscarNombres){
    this.idsGuardado[1] = opcion.id
    this.bIdentificador = {
      id : opcion.id,
      categoria : 2
    }
  }

  //input de nombre de servicio
  buscarServicio(palabra : string, event : any){
    this.auxBuscador(palabra,event,3);
    if(palabra !== ""){
      this._renderer.setAttribute(document.getElementById("iEmpresa"), "disabled", "true")   
      this._renderer.setAttribute(document.getElementById("iRazon"), "disabled", "true")
    }else{
      this._renderer.removeAttribute(document.getElementById("iRazon"), "disabled")   
      this._renderer.removeAttribute(document.getElementById("iEmpresa"), "disabled")
    }
  }

  servicioSeleccionada(opcion : buscarNombres){
    this.bIdentificador = {
      id : opcion.id,
      categoria : 3
    }
  }

  async auxBuscador(palabra : string, event : any,condicion : number) {
    if(event.key !== "tab" && event.key !=="ArrowUp" && event.key !=="ArrowDown"
    && event.key !=="ArrowLeft" && event.key !=="ArrowRight" && event.key !=="Enter" 
     ){      
      await lastValueFrom(this.serviceSearch.buscarNombres(palabra,condicion)).then(async (resp : responseService)=>{
        switch(condicion){
          case 1:
            this.opcionesEmpresa = resp.container;            
           break;
          case 2:
            this.opcionesRazon = resp.container;
            break;
          case 3:
            this.opcionesServicio = resp.container; 
            break;
        }
       
      })
      switch(condicion){
        case 1:
          this.filtradoEmpresa = this.controlEmpresa.valueChanges.pipe(
            startWith(''),
            map(value => {
              const nombre = typeof value === 'string' ? value : value?.nombre;
             return nombre ? this._filterEmpresa(nombre as string) : this.opcionesEmpresa.slice();
            } )
            )
          break;
        case 2:
          this.filtradoRazon = this.controlRazon.valueChanges.pipe(
            startWith(''),
            map(value => {
              const nombre = typeof value === 'string' ? value : value?.nombre;
             return nombre ? this._filterRazon(nombre as string) : this.opcionesRazon.slice();
            } )
            )
          break;
        case 3:
          this.filtradoServicio = this.controlServicio.valueChanges.pipe(
            startWith(''),
            map(value => {
              const nombre = typeof value === 'string' ? value : value?.nombre;
             return nombre ? this._filterServicio(nombre as string) : this.opcionesServicio.slice();
            } )
            )
          break;
      }
      
    }

    if(this.controlEmpresa.value === ""){
      this.opcionesEmpresa = [];        
      this.filtradoEmpresa = new Observable<buscarNombres[]>()
    }
   
    if(this.controlRazon.value === ""){
      this.opcionesRazon = [];
      this.filtradoRazon = new Observable<buscarNombres[]>()
    }

    if(this.controlServicio.value === ""){
      this.opcionesServicio = []; 
      this.filtradoServicio = new Observable<buscarNombres[]>()
    }
  }


    private _filterEmpresa(value: string) :buscarNombres[] {
      const filterValue = value.toLowerCase();
      return this.opcionesEmpresa.filter(opcion => opcion.nombre.toLowerCase().includes(filterValue));
    }
    private _filterServicio(value: string) :buscarNombres[] {
      const filterValue = value.toLowerCase();
      return this.opcionesServicio.filter(opcion => opcion.nombre.toLowerCase().includes(filterValue));
    }
    private _filterRazon(value: string) :buscarNombres[] {
      const filterValue = value.toLowerCase();
      return this.opcionesRazon.filter(opcion => opcion.nombre.toLowerCase().includes(filterValue));
    }


}
