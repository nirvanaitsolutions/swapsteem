import { Injectable } from '@angular/core';
import {WebSocketSubject,WebSocketSubjectConfig} from 'rxjs/observable/dom/WebSocketSubject';

@Injectable({
  providedIn: 'root'
})
export class WebsocketsService {
  public ws = new WebSocketSubject('wss://swapsteem-api.herokuapp.com');;

  constructor() {
    
    
    this.ws.subscribe(
      (data) => console.log(data),
      (err) => console.error(err),
      () => console.warn('Completed!')
    )
   }

}
