import { LoadingService } from './../../../services/loading.service';
import { AlertService } from './../../../services/alert.service';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { CartForm } from '../../../forms/cart';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  // Form
  cart: CartForm;

  canAccess = false;

  paymentMethodName;

  constructor(
    private cartService: CartService,
    private router: Router,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.cart = new CartForm();
    this.cart = this.cartService.retrieve();
    if (this.cart.order.paymentType === 'T') {
      this.paymentMethodName = 'โอนเงินผ่านธนาคาร'
    } else if (this.cart.order.paymentType === 'C') {
      this.paymentMethodName = 'Credit Card/Debit Card'
    } else if (this.cart.order.paymentType === 'D') {
      this.paymentMethodName = 'เก็บเงินปลายทาง'
    }

    if (!this.cart.address.tel) {
      this.router.navigateByUrl('/');
    }
    if (this.cart.cartItems.length == 0) {
      this.router.navigateByUrl('/');
    }
  }

  onBackToEditOrder() {
    this.router.navigateByUrl('/checkout');
  }

  onConfirmOrder() {
    window.scrollTo(0, 0)
    if (this.cart.address.tel) {
      if (this.cart.cartItems.length > 0) {
        this.loadingService.loading(true);
        this.cartService.createOrder(this.cart)
          .then((id) => {
            this.loadingService.loading(false);
            this.router.navigate(['/completeOrder'], { queryParams: { orderId: id } });
          })
          .catch(error => {
            this.loadingService.loading(false);
            this.alertService.error('เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ')
            setTimeout(() => {
              this.alertService.clear();
            }, 5000);
          });
      }
    }
  }

}
