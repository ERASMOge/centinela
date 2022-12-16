import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ping',
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.css']
})
export class PingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const client = require('ping-tcp-js');

const HOST = 'google.com';
const PORT = 80;

client
  .ping(HOST, PORT)
  .then(() => console.log('connect ping'))
  .catch((e:any) => console.error('not disconnet', e))

client
  .pingBackOff({ host: HOST, port: PORT })
  .then(() => console.log('connect pingBackOff'))
  .catch((e:any) => console.error('not disconnet', e))
  }


 async Ping(){
 console.log("1");
 }
}
