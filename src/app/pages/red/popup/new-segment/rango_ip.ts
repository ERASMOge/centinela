
export class rango_ip {

	constructor(){ }

	 rango (ip : string, ip2:string){

		let ipArray : string [] =  ip.split(".",4);
		let ipArray2 : string [] = ip2.split(".",4);
		let contadorSub : number = 1 ; 
		let contadorSubAux : number= 0 ;
		let todaIps : string []= []; 
		let cFor : number = 0;
		let primeroOct :number = Number(ipArray2[0]) - Number(ipArray[0]);  		
		let segundoOct : number = Number(ipArray2[1]) - Number(ipArray[1]);
		let terceroOct : number = Number(ipArray2[2]) - Number(ipArray[2]);
		let cuartoOct : number =Number(ipArray2[3]) - Number(ipArray[3]);
		
		let host : number= Number(ipArray[3]);		
		let gRecorrido :number =0;
		let gRecorridoSegundo : number =0;
		let gRecorridoTercero : number =0;
		//console.log("filtro");
		
		//console.log(primeroOct+" - "+segundoOct+" - "+terceroOct+" - "+cuartoOct);
		if(primeroOct == 0&& segundoOct==0&& terceroOct ==0 && cuartoOct >0 || primeroOct == 0&& segundoOct > 0&& terceroOct ==0 && cuartoOct >0
			|| primeroOct > 0&& segundoOct == 0&& terceroOct ==0 && cuartoOct >0) {
				for(let z=Number(ipArray[3]); z<=Number(ipArray2[3]) && Number(ipArray2[3])>0; z++) {
					//console.log((cFor++)+".- "+ipArray[0]+"."+(gRecorridoSegundo=Number(ipArray[1]))+"."+(gRecorridoTercero=Number(ipArray[2]))+"."+(host++));
					todaIps.push(ipArray[0]+"."+(gRecorridoSegundo = Number(ipArray[1]))+"."+(gRecorridoTercero = Number(ipArray[2]))+"."+(host++));	
				}
		}

		// console.log("tercer");
		 
		for(let x= 0;  x<(terceroOct*259) && terceroOct > 0; x++) {
				if((x-contadorSubAux) == (256*contadorSub)) {
				contadorSub++;
				contadorSubAux++;
				host = 0;

				}else {
					if((Number(ipArray[2])+contadorSubAux) == Number(ipArray2[2]) && host ==0) {
						todaIps.push(ipArray[0]+"."+ipArray[1]+"."+(gRecorrido=(Number(ipArray[2])+Number(contadorSubAux)))+"."+(host++));	
					//console.log((cFor++)+".- "+ipArray[0]+"."+ipArray[1]+"."+(gRecorrido=(Number(ipArray[2])+contadorSubAux))+"."+(host++));	

						for(let z=0; z<Number(ipArray2[3]) && Number(ipArray2[3])>0; z++) {
						//	console.log((cFor++)+".- "+ipArray[0]+"."+ipArray[1]+"."+(gRecorrido=(Number(ipArray[2])+contadorSubAux))+"."+(host++));	
							todaIps.push(ipArray[0]+"."+ipArray[1]+"."+(gRecorrido=(Number(ipArray[2])+Number(contadorSubAux)))+"."+(host++));	
						}
					} if((Number(ipArray[2])+contadorSubAux) < Number(ipArray2[2]) && host <=255) {
					//	console.log((cFor++)+".- "+ipArray[0]+"."+ipArray[1]+"."+(gRecorrido=(Number(ipArray[2])+contadorSubAux))+"."+(host++));	

						todaIps.push(ipArray[0]+"."+ipArray[1]+"."+(gRecorrido=(Number(ipArray[2])+Number(contadorSubAux)))+"."+(host++));	
					}
				}
			}
		
		contadorSub=1;
		contadorSubAux=0;
		host = gRecorrido+gRecorridoTercero+1;
		//console.log("segundo");
		
		for(let x= 0;  x<(segundoOct*259) && segundoOct > 0; x++) {
			if((x-contadorSubAux) == (256*contadorSub) ) {
			contadorSub++;
			contadorSubAux++;
			host = 0;
			}else {
				if((Number(ipArray[1])+contadorSubAux) == Number(ipArray2[1]) && host ==0) {
				//	console.log((cFor++)+".- "+ipArray[0]+"."+(gRecorrido=(Number(ipArray[1])+contadorSubAux))+"."+(host++)+"."+ipArray2[3]);	

					todaIps.push(ipArray[0]+"."+(gRecorrido=(Number(ipArray[1])+Number(contadorSubAux)))+"."+(host++)+"."+ipArray2[3]);	
				for(let z=0; z<Number(ipArray2[2]) && Number(ipArray2[2])>0; z++) {
					//console.log((cFor++)+".- "+ipArray[0]+"."+(gRecorrido=(Number(ipArray[1])+contadorSubAux))+"."+(host++)+"."+ipArray2[3]);	

					todaIps.push(ipArray[0]+"."+(gRecorrido=(Number(ipArray[1])+Number(contadorSubAux)))+"."+(host++)+"."+ipArray2[3]);	
				}
			}else if((Number(ipArray[1])+contadorSubAux) < Number(ipArray2[1]) && host <=255) {
				//console.log((cFor++)+".- "+ipArray[0]+"."+(gRecorrido=(Number(ipArray[1])+contadorSubAux))+"."+(host++)+"."+ipArray2[3]);	

				todaIps.push(ipArray[0]+"."+(gRecorrido=(Number(ipArray[1])+Number(contadorSubAux)))+"."+(host++)+"."+ipArray2[3]);	
				}
			}
		} 

		contadorSub=1;
		contadorSubAux=0;
		host =gRecorrido+gRecorridoSegundo+1;
		//console.log("primero");
		
		for(let x= 0;  x<(primeroOct*259) && primeroOct > 0; x++) {
			if((x-contadorSubAux) == (256*contadorSub) ) {
			contadorSub++;
			contadorSubAux++;
			host = 0;
			}else {
				if((Number(ipArray[0])+contadorSubAux) == Number(ipArray2[0]) && host ==0) {
					todaIps.push((gRecorrido=(Number(ipArray[0])+Number(contadorSubAux)))+"."+(host++)+"."+ipArray2[2]+"."+ipArray2[3]);	
				//console.log((cFor++)+".- "+(gRecorrido=(Number(ipArray[0])+contadorSubAux))+"."+(host++)+"."+ipArray2[2]+"."+ipArray2[3]);	

				for(let z=0; z<Number(ipArray2[1]) && Number(ipArray2[1])>0; z++) {
				//	console.log((cFor++)+".- "+(gRecorrido=(Number(ipArray[0])+contadorSubAux))+"."+(host++)+"."+ipArray2[2]+"."+ipArray2[3]);	

					todaIps.push((gRecorrido=(Number(ipArray[0])+Number(contadorSubAux)))+"."+(host++)+"."+ipArray2[2]+"."+ipArray2[3]);	
				}
			}else if((Number(ipArray[0])+contadorSubAux) < Number(ipArray2[0]) && host <=255) {
				//console.log((cFor++)+".- "+(gRecorrido=(Number(ipArray[0])+contadorSubAux))+"."+(host++)+"."+ipArray2[2]+"."+ipArray2[3]);	

				todaIps.push((gRecorrido=(Number(ipArray[0])+Number(contadorSubAux)))+"."+(host++)+"."+ipArray2[2]+"."+ipArray2[3]);	
				}
			}
		}	

		return todaIps;
    }
}	