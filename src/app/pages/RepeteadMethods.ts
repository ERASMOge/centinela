import { formatDate } from "@angular/common";


export class RepeteadMethods {

  constructor(){ }

  /**Este es un ayudante para poder insertar datos y que este pueda reflejarse segun su id respectivo */
  buscandoIndice(id:number,ELEMENT_DATA :any, nombreId : string) : number{
    let i = 0
    while (true) {
      const element = ELEMENT_DATA[i][nombreId];
      if(element===id){
       return i
      }
      i++;
    }
  }

  /**Sirve para mostrar o no el loading individual de cada tabla
   * INCLUYENDO EL MENSAJE de si hay resultados o no
  */
  hayClientes( ELEMENT_DATA : any, cargando : any) : boolean{
    if(ELEMENT_DATA != 0 || cargando ==false){
      return true;
    }else{
      return false;
    }
  }

  hayClientes3( ELEMENT_DATA_INFO : any, cargando3 : any) : boolean{
    if(ELEMENT_DATA_INFO != 0 || cargando3 ==false){
      return true;
    }else{
      return false;
    }
  }

  /**Es ayudante para los loading individuales de las tablas */
  hayClientes2(cargando : boolean) :string{
    if(cargando !=false){
      return "table-row";
    }else{
      return "none";
    }
  }

  /**Guardando numero mayor, es ayudante del metodo 'arrayRemove' */
   numeroMayor(numero : number, mayorNumero : number){
    if (mayorNumero <numero){
      mayorNumero = numero
    }
  }

  /**Sirve para remover de forma visible una fila de la tabla */
  arrayRemove(arr : any, index : any, id : string) { 
    for( var i = 0; i < arr.length; i++){ 
      if ( arr[i][id] === arr[index][id]) { 
          arr.splice(i, 1); 
      }
    }
    return arr;
  }

  /**Transforma la representacion de del estatus de numero a letras, es muy usado, en esta proyecto */
  estatus(numero : number) : string {
   if(numero == 1){
    return "activo"
   }else{
     if(numero == 2){
    return "inactivo"
     }else{
       return "ausente"
     }
   }
  }


  /**Devuelve string esta en dudas, se reutilizara de nuevo, si no, entonces se borrara */
  tipo(tipo:string) : string{
    if(tipo == '1'){
      return "publico"
     }else{
      return "privado"
     }
  }

  /**Es muy usado es el mismo que 'estatus' pero de letras a numeros */
  estatusNumero(numero : string) : string{
    if (numero == "activo"){
      return '1'
    }else if ( numero == "inactivo"){
      return '2'
    } else if ( numero == "ausente"){
      return '3'
    }else{
      return ''
    }
  }


  /**Sirve para insertar la fecha al mysql, datepicker en español al ingles */
  formatoFechaMysql(fecha: string) : string{
    let splitted : string [] =  fecha.split("/",3);
    if(splitted.length == 1){
      splitted = fecha.split("-",3);
    }
    let fecha2 : Date=  new Date(splitted[1]+"-"+splitted[0]+"-"+splitted[2])
  return formatDate(fecha2,'yyyy-MM-dd','en-US');
  }

  /**Sirve para representar la fecha que se trae del mysql a la pantalla */
  formatoFechaEspanolMysql(fecha: string) : string{
    let splitted : string [] =  fecha.split("-");
    let fecha2 : Date=  new Date(splitted[0]+"-"+splitted[1]+"-"+(Number(splitted[2]))) 
    if(Number(splitted[2]) < 10){
      return formatDate(fecha2,'dd-MM-yyyy','en-US');
    }else{
      fecha2.setDate(fecha2.getDate() + 1); 
      return formatDate(fecha2,'dd-MM-yyyy','en-US');

    }    
  }

  /**Solo cambia la estetica, como es la diagonal y el guion*/
  cambiarSeparadoresFecha(fecha: string,separador : string, remplazar : string) : string{
    let splitted : string [] =  fecha.split(separador);
    let fecha2 :string = (splitted[0]+remplazar+splitted[1]+remplazar+splitted[2])
  return fecha2 ;
  }

  //Es para los tickets
  prioridadEnLetraTicket( valor : string) : string{
    switch (Number(valor)) {
      case 1:
        return "Baja";
      case 2:
        return "Media"
      case 3:
        return "Alta";
      case 4:
        return "Urgente";                
      default:
       return  "";
    }
  }

  tipoEnLetraTicket( valor : string) : string{
    switch (Number(valor)) {
      case 1:
        return "Soporte";
      case 2:
        return "Atencion"
      case 3:
        return "Solicitud";
      default:
       return  "";
    }
  }
  estadoEnLetraTicket( valor : string) : string{    
    switch (Number(valor)) {
      case 1:
        return "Abierto";
      case 2:
        return "En progreso";
      case 3:
        return "Pausado";  
      case 4:
        return "Cerrado";             
      default:
       return  "";
    }
  }


  
}