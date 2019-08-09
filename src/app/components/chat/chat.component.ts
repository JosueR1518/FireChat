import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  mensaje:string='';
  elemento:any;
  constructor(private chatService:ChatService) { 
    this.chatService.cargarMensajes().subscribe(data=>{

      setTimeout(()=>{
        this.elemento.scrollTop = this.elemento.scrollHeight;
      },20);
      //console.log(data);
    })
  }

  ngOnInit() {
    this.elemento = document.getElementById('app-mensajes');
  }

  enviarMensaje(){
      console.log(this.mensaje);
      if(this.mensaje.length===0){
        return;
      }

      this.chatService.crearMensaje(this.mensaje).then(response=>{

       // console.log(response);
        console.log('Mensaje enviado');
        this.mensaje='';

      }).catch(err=>{
        console.error('Error al enviar',err);
      });

  }

}
