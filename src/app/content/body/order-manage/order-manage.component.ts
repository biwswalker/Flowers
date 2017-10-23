import { LoadingService } from './../../../services/loading.service';
import { Order } from "../../../models/order";
import { AlertService } from "../../../services/alert.service";
import { OrderService } from "../../../services/order.service";
import { CartOrderForm } from "../../../forms/cart-order";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-order-manage",
  templateUrl: "./order-manage.component.html",
  styleUrls: ["./order-manage.component.css"]
})
export class OrderManageComponent implements OnInit {
  loaded = false;
  // Datatables
  dtOptions: DataTables.Settings = {};

  cartOrderFormList: CartOrderForm[] = [];
  orderStatus: string;

  constructor(
    private orderService: OrderService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.orderStatus = "A";
    $(".dataTables_filter").addClass("pull-left");
    console.log(new Date());
    window.scrollTo(0, 0);
    this.dtOptions = {
      paging: false,
      lengthChange: false,
      info: false
    };
    this.loadingProductList();
  }

  loadingProductList(): Promise<boolean> {
    this.loadingService.loading(true);
    return Promise.resolve(
      this.orderService
        .getAllOrder()
        .then(order => {
          this.cartOrderFormList = [];
          order.forEach(obj => {
            const orderObj: CartOrderForm = obj.val();
            orderObj.status = this.displayStatus(orderObj.order);
            orderObj.orderDate = this.displayDate(
              orderObj.order.createDatetime
            );
            if (this.orderStatus && orderObj.status) {
              if (this.orderStatus === "A") {
                this.cartOrderFormList.push(orderObj);
              } else {
                if (this.orderStatus === orderObj.status) {
                  this.cartOrderFormList.push(orderObj);
                }
              }
            } else {
              this.cartOrderFormList.push(orderObj);
            }
            this.loaded = true;
          });
          this.loadingService.loading(false);
          return false;
        })
        .catch(error => {
          this.loadingService.loading(false);
          this.alertService.error("เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ");
          setTimeout(() => {
            this.alertService.clear();
          }, 5000);
          window.scrollTo(0, 0);
          return false;
        })
    );
  }

  onSelectRow(cartOrderF: CartOrderForm) {}

  displayDate(createDatetime: string): string {
    if (createDatetime) {
      const newDate = new Date(createDatetime);
      const date: string = String(newDate.getDate());
      const month: string = String(newDate.getMonth());
      const year: string = String(newDate.getFullYear());
      return String(date + "/" + month + "/" + year);
    }
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

  onChangeCriteriaStatus() {
    this.loadingProductList();
  }

  changeStatus(cartOrder: CartOrderForm) {
    this.orderService.changeOrderStatus(
      cartOrder.order.orderId,
      cartOrder.status
    );
    this.loadingProductList();
  }

  checkIsChanged(form: CartOrderForm): boolean {
    if (form.order.paymentStatus) {
      if (form.order.paymentStatus === "N") {
        if (form.status === "N") {
          return false;
        } else {
          return true;
        }
      } else {
        if (form.status !== form.order.orderStatus) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  }
}
