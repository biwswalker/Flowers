import { LoadingService } from './../../../services/loading.service';
import { Order } from "./../../../models/order";
import { CartItem } from "./../../../forms/cart-item";
import { ProductService } from "./../../../services/product.service";
import { OrderService } from "./../../../services/order.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CartForm } from "./../../../forms/cart";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-order-info",
  templateUrl: "./order-info.component.html",
  styleUrls: ["./order-info.component.css"]
})
export class OrderInfoComponent implements OnInit {

  // Form
  cart: CartForm;

  orderId: string;
  private sub: any;
  orderStatus: string;

  paymentMethodName;
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.cart = new CartForm();
    this.loadingService.loading(true);
    Promise.all([
      this.getProductId(),
      this.getProduct(this.orderId)
    ]).then(success => {
      this.loadingService.loading(false);
    });
  }

  getProductId() {
    return Promise.resolve(
      (this.sub = this.route.params.subscribe(params => {
        this.orderId = params["oid"];
      }))
    );
  }

  getProduct(orderId: string) {
    return Promise.resolve(
      this.orderService
        .findAlreadyExistOrder(orderId)
        .then(obj => {
          if (obj.val()) {
            this.cart.order = obj.val().order;
            this.cart.address = obj.val().address;

            this.orderStatus = this.displayStatus(this.cart.order);
            if (this.cart.order.paymentType === "T") {
              this.paymentMethodName = "โอนเงินผ่านธนาคาร";
            } else if (this.cart.order.paymentType === "C") {
              this.paymentMethodName = "Credit Card/Debit Card";
            } else if (this.cart.order.paymentType === "D") {
              this.paymentMethodName = "เก็บเงินปลายทาง";
            }

            let cartItem: CartItem;
            const productOrderObj = obj.val().products;
            productOrderObj.forEach(element => {
              cartItem = new CartItem();
              cartItem.productOrder = element;
              this.productService
                .getProductByKey(cartItem.productOrder.productId)
                .then(data => {
                  cartItem.product = data;
                });
              this.cart.cartItems.push(cartItem);
            });
          }
        })
        .catch(error => {
          console.log(error.message);
        })
    );
  }

  displayStatus(order: Order): string {
    if (order.paymentStatus) {
      if (order.paymentStatus === "W") {
        return order.orderStatus;
      } else {
        return "N";
      }
    }
    return null;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onChangeStatus() {
    this.orderService.changeOrderStatus(this.cart.order.orderId, this.orderStatus);
    this.router.navigateByUrl('/order-manage');
  }
}
