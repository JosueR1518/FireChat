 import { Injectable } from '@angular/core';
 import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
 import { Observable } from 'rxjs';
 import { map } from 'rxjs/operators';
 import { Mensaje } from '../interfaces/mensaje.interface';


 import { AngularFireAuth } from '@angular/fire/auth';
 import { auth } from 'firebase/app';
 @Injectable({
  providedIn: 'root'
})
export class ChatService {

  chats: any[] = [];
  public usuario: any = {};


  private itemsCollection: AngularFirestoreCollection<any>;
  constructor(private afs: AngularFirestore,
              public afAuth: AngularFireAuth) {

        this.afAuth.authState.subscribe(usuario => {

          console.log('estado del usuario', usuario);
          if (!usuario) {
            return;
          }
          this.usuario.nombre = usuario.displayName;
          this.usuario.uid =     usuario.uid;
        });


  }

  login(proveedor: string) {


    if (proveedor === 'google') {
        this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());

    } else {
      this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider());


    }

  }


  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }
  cargarMensajes(): Observable<any> {


    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(10));

    return this.itemsCollection.valueChanges().pipe(map((mensajes: Mensaje[]) => {
      console.log(mensajes);
      this.chats = [];
      for (const mensaje of mensajes) {
        this.chats.unshift(mensaje);
      }
     // this.chats = mensajes;
    }));
  }

  crearMensaje(texto: string): Promise<any> {
      const mensaje: Mensaje = {

        nombre: this.usuario.nombre,
        mensaje: texto,
        fecha: new Date().getTime(),
        uid: this.usuario.uid
      };


      return this.itemsCollection.add(mensaje);


  }
}
