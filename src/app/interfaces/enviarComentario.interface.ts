export interface enviarComentarioInterface{
    idComentantario?:number,
    cveTicket : number,
    comentario : string,
    fecha?:string,
    cveUsuario:number,
    imagen?:string,
    documento?:string,
    estatus:number,
    tipo:number,
    nombre:string,
    url:string,
    tamano:string
}