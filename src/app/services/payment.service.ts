import { Payment } from "./../models/payment";
import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import { UtilsService } from "./utils.service";

@Injectable()
export class PaymentService {
  constructor(private utilService: UtilsService) {}

  findAlreadyExistPayment(orderId: string) {
    return firebase
      .database()
      .ref("payment/")
      .child(orderId)
      .once("value");
  }

  addPaymentConfermation(paymentParam: Payment) {
    paymentParam.paymentId = this.utilService.generateUUID();
    paymentParam.createDatetime = new Date();
    return firebase
      .database()
      .ref("payment/" + paymentParam.orderId)
      .set(paymentParam);
  }
}
