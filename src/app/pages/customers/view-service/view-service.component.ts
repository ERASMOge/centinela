import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { lastValueFrom, Observable } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ServiceService } from 'src/app/core/services/services.service';
import { MapsModel } from 'src/app/models/maps.model';
import { responseService } from 'src/app/models/responseService.model';
import { RepeteadMethods } from '../../RepeteadMethods';
import { EditAddressComponent } from '../popup/edit-address/edit-address.component';

interface mapaDireccion {
  ciudad:string ;
  coordenadas:string ; 
  estado : string ;
  latitud : string ;
  longitud : string ;
  codigoPostal : string ;
  colonia : string ;
  numero : string ;
  cveCiudad : string ;
}

@Component({
  selector: 'app-vista-servicio',
  templateUrl: './view-service.component.html',
  styleUrls: ['./view-service.component.css']
})
export class ViewServiceComponent implements OnInit {
  load : boolean = false;
  direccionMapa!: mapaDireccion;
  idCliente = this.activoRouter.snapshot.params["id"]
  identificador :string = this.activoRouter.snapshot.params["identificador"]
  contadorIdenti :string = this.activoRouter.snapshot.params["identificador"].split("-")[2]
  servicio : any [] =[];
  metodo = new RepeteadMethods()
  ciudad:string | undefined;
  coordenadas:string | undefined; 
  estado : string | undefined;
  latitud : string | undefined;
  longitud : string | undefined;
  codigoPostal : string | undefined;
  colonia : string | undefined;
  numero : number | undefined;
  cveCiudad : number | undefined;
  avenida : string | undefined;
  contadorCoordendas : number = 0

  rutaMapaD : string | undefined;
  rutaMapaC : string | undefined;

  navLinks  =[
    {
      label: 'Otros dipositivos',
      link: './',
      index: 0
    }, {
      label: 'Radios',
      link: './radio',
      index: 1
    }, {
      label: 'Routers',
      link: './router',
      index: 2
    }, 
  ];
  activeLink = this.navLinks[0].link;

  constructor(private activoRouter : ActivatedRoute, private service : ServiceService
    , private DataService : DataService, private router : Router,private dialog:NgDialogAnimationService,
    private notificationService: NotificationService, private renderer : Renderer2) {   
      let diagonal = this.router.url.split("/",6)[5];
      if(diagonal != undefined){
        this.activeLink = "./"+diagonal
      }    
    }


  ngOnInit(): void {
    let sepId : Array<string> = this.router.url.split("/")[4].split("-")
    let identificador :string = sepId[0]+"-"+sepId[1]+"-"+sepId[3];
     lastValueFrom(this.service.selectVistaServicio(identificador, Number(this.contadorIdenti),1)).then((resp:responseService)=>{
      this.servicio = resp.container
      this.load = true
      this.mapaDireccion()
    })
  }

  //Abre el mapa en base a su respectiva direccion
  mapaDireccion(){
    setTimeout( () =>{
    this.rutaMapaD = "https://maps.google.com/maps?q="+((this.avenida?this.avenida:this.servicio[0].avenida)+" "+(this.numero?this.numero:this.servicio[0].numero)
    +", "+(this.colonia?this.colonia:this.servicio[0].colonia)+", "+(this.codigoPostal?this.codigoPostal:this.servicio[0].codigoPostal)+" "+(this.ciudad?this.ciudad:this.servicio[0].ciudad)
    +", "+(this.estado?this.estado:this.servicio[0].estado)).replace(/\ /gi,'%20')+"&t=&z=14&ie=UTF8&iwloc=B&output=embed"
    let m = this.renderer.createElement("iframe")
    this.renderer.setAttribute(m, "src",  this.rutaMapaD)
    this.renderer.setStyle(m,"width","100%")
    this.renderer.setStyle(m,"height","300px")
    this.renderer.setProperty(m,"id","md")
    let divp = document.getElementById("mapaDireccion")
    this.renderer.appendChild(divp,m)
    },500)  
    
  }

  cambiarMapa(){
    
    ++this.contadorCoordendas;    
    if(this.contadorCoordendas == 1){
    this.rutaMapaC = "https://maps.google.com/maps?hl=en&q="+((this.latitud?this.latitud:this.servicio[0].coordenadas.split(",")[0])
    +", "+(this.longitud?this.longitud:this.servicio[0].coordenadas.split(",")[1].trim())).replace(/\ /gi,'%20')+"&t=&z=14&ie=UTF8&iwloc=B&output=embed"
    let m2 = this.renderer.createElement("iframe")    
    this.renderer.setAttribute(m2, "src",  this.rutaMapaC)
    this.renderer.setStyle(m2,"width","100%")
    this.renderer.setStyle(m2,"height","300px")
    this.renderer.setProperty(m2,"id","mc")
    let divpc = document.getElementById("mapaCoordenadas")
    this.renderer.appendChild(divpc,m2)
    }else{
      try{
      this.rutaMapaC = "https://maps.google.com/maps?hl=en&q="+((this.latitud?this.latitud:this.servicio[0].coordenadas.split(",")[0])
      +", "+(this.longitud?this.longitud:this.servicio[0].coordenadas.split(",")[1].trim()))+"&t=&z=14&ie=UTF8&iwloc=B&output=embed" 
        this.renderer.setAttribute(document.getElementById("mc"), "src",  this.rutaMapaC)
      }catch(Exception){}
      try{
        this.rutaMapaD = "https://maps.google.com/maps?q="+((this.avenida?this.avenida:this.servicio[0].avenida)+" "+(this.numero?this.numero:this.servicio[0].numero)
        +", "+(this.colonia?this.colonia:this.servicio[0].colonia)+", "+(this.codigoPostal?this.codigoPostal:this.servicio[0].codigoPostal)+" "+(this.ciudad?this.ciudad:this.servicio[0].ciudad)
        +", "+(this.estado?this.estado:this.servicio[0].estado)).replace(/\ /gi,'%20')+"&t=&z=14&ie=UTF8&iwloc=B&output=embed"  
          this.renderer.setAttribute(document.getElementById("md"), "src",  this.rutaMapaD)
      }catch(Exception){}
      
    }
    
    
  }
  
  

  abrirMapaCoordendas(coordenadas : string){
    window.open(("https://www.google.com/maps/place/"+coordenadas).replace(/\ /gi,'+'), "_blank");
  }
  
  abrirMapaDireccion(avenida: string, numero: string, colonia: string, codigoPostal: string, 
    ciudad: string,  estado: string){
    window.open(("https://www.google.com/maps/place/av. "+avenida+" "+numero+", "+colonia+", "+codigoPostal+" "+ciudad+", "+estado).replace(/\ /gi,'+'), "_blank");
  }
  editarMapa(idServicio : number,ciudad: string,coordenadas: string,numero: number, 
    colonia: string, 
    codigoPostal: number,  
    estado: string,cveCiudad: number, avenida:number){      
    let dialogRef = this.dialog.open(EditAddressComponent,
      {data: {idServicio:idServicio,ciudad: ciudad,coordenadas: coordenadas,numero: numero, 
        colonia: colonia, 
        codigoPostal: codigoPostal,  
        estado: estado,cveCiudad: cveCiudad, avenida:avenida},
        animation: { to: "bottom" },
        height:"auto", width:"300px",
      });

    dialogRef.afterClosed().subscribe((result:MapsModel)=>{
      if(result !=undefined){        
       try{       
        this.cveCiudad = result.cveCiudad
        this.ciudad=result.ciudad,
        this.coordenadas=result.latitud+", "+result.longitud,
        this.estado =result.estado
        this.latitud =result.latitud
        this.longitud =result.longitud
        this.codigoPostal =result.codigoPostal
        this.colonia =result.colonia
        this.numero =result.numero
        this.cveCiudad =result.cveCiudad   
        this.avenida = result.avenida  
        try {
        this.rutaMapaD = "https://maps.google.com/maps?q="+(this.avenida+" "+this.numero
        +", "+this.colonia+", "+this.codigoPostal+" "+this.ciudad
        +", "+this.estado).replace(/\ /gi,'%20')+"&t=&z=14&ie=UTF8&iwloc=B&output=embed"  
        this.renderer.setAttribute(document.getElementById("md"), "src",  this.rutaMapaD)
        }catch(Exception){}
        
        try {
        this.rutaMapaC = "https://maps.google.com/maps?hl=en&q="+(this.latitud
        +", "+(this.longitud)).replace(/\ /gi,'%20')+"&t=&z=14&ie=UTF8&iwloc=B&output=embed" 
        this.renderer.setAttribute(document.getElementById("mc"), "src",  this.rutaMapaC)
        }catch(Exception){}
        setTimeout(()=>{
        this.notificationService.openSnackBar("Se edito con exito");
        })
       }catch(Exception){}
      }
     })
  }

  agregar(form : string){    
    this.DataService.open.emit(form)
  }

}

