import { LoadingService } from './../../../services/loading.service';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from './../../../services/payment.service';
import { Payment } from './../../../models/payment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css']
})
export class PaymentInfoComponent implements OnInit {

  // Payment
  payment: Payment = new Payment();

  orderId: string;
  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loadingService.loading(true);
    this.payment = new Payment();
    Promise
      .all([this.getProductId(), this.getProduct(this.orderId)])
      .then(success => {
        this.loadingService.loading(false);
      });
  }

  getProductId() {
    return Promise.resolve(
      this.sub = this.route.params.subscribe(params => {
        this.orderId = params['oid'];
      })
    );
  }

  getProduct(orderId: string) {
    return Promise.resolve(
      this.paymentService.findAlreadyExistPayment(orderId)
        .then((obj) => {
          if (obj.val()) {
            this.payment = obj.val();
          }
        })
        .catch(error => {
          console.log(error.message)
        })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
