import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
declare var require: any;

@Injectable()
export class UtilsService {
  constructor() { }

  generateOrderID(len: number): string {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < len; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  generateUUID(): string {
    var uuid = require("uuid");
    return uuid.v4();
  }

  uploadImage(imageData: File, imageName: string) {
    return firebase.storage().ref().child(imageName).put(imageData)
      .then((url) => {
        return url.downloadURL;
      })
      .catch(error => {
        console.log('Error ' + error);
      });
  }

  deleteImage(imageName) {
    firebase.storage().ref().child(imageName).delete().catch(function (error) {
      console.log('error ' + error.message)
    });
  }

}
