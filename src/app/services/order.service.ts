import { Injectable } from '@angular/core';
import * as firebase from "firebase";

@Injectable()
export class OrderService {

  constructor() { }

  findAlreadyExistOrder(orderId: string) {
    return firebase
      .database()
      .ref("order/")
      .child(orderId)
      .once("value");
  }

  changePaymentStatus(orderId: string, status: string) {
    return firebase
      .database()
      .ref("order/" + orderId + "/order")
      .update({ paymentStatus: status });
  }


}
