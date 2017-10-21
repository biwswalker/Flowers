import { Payment } from "./../models/payment";
import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import { UtilsService } from "./utils.service";

@Injectable()
export class PaymentService {
  constructor(private utilService: UtilsService) {}

  findAlreadyExistOrder(orderId: string) {
    return firebase
      .database()
      .ref("order/")
      .child(orderId)
      .once("value");
  }

  changePaymentStatus(orderId: string) {
    return firebase
      .database()
      .ref("order/" + orderId + "/order")
      .update({ paymentStatus: "W" });
  }

  addPaymentConfermation(paymentParam: Payment) {
    paymentParam.paymentId = this.utilService.generateUUID();
    paymentParam.createDatetime = new Date();
    return firebase
      .database()
      .ref("payment/" + paymentParam.paymentId)
      .set(paymentParam);
  }
}
