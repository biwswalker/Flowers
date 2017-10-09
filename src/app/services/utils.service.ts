import { Injectable } from '@angular/core';
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
}
