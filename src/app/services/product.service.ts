import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class ProductService {

  constructor() { }

  addProduct(pd: any){

    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const path = `images/${filename}.jpg`;
    console.log('path :: ' + path);
    const imageRef = storageRef.child(path);

    return firebase.database().ref('product').set(pd);
  }

}
