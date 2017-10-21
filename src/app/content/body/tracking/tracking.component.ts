import { OrderService } from "./../../../services/order.service";
import { Order } from "./../../../models/order";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-tracking",
  templateUrl: "./tracking.component.html",
  styleUrls: ["./tracking.component.css"]
})
export class TrackingComponent implements OnInit {
  // Loading
  loading = false;

  searched = false;
  orderId: string;
  status: string;
  order: Order = new Order();

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderId = "";
    this.status = "";
    this.order = new Order();
  }

  onSearch() {
    this.order = new Order();
    if (this.orderId) {
      const orderIdStr = this.orderId.toUpperCase();
      this.orderService.findAlreadyExistOrder(orderIdStr).then(data => {
        console.log(data.val());
        if (data.val()) {
          this.searched = false;
          this.order = data.val().order;
          if (this.order.paymentStatus === 'W') {
            if (this.order.orderStatus === 'W') {
              this.status = "รอการตรวจสอบ";
            } else if (this.order.orderStatus === 'P') {
              this.status = "กำลังดำเนินการ";
            } else if (this.order.orderStatus === 'T') {
              this.status = "กำลังจัดส่ง";
            } else if (this.order.orderStatus === 'Y') {
              this.status = "รับสินค้าแล้ว";
            }
          } else {
            this.status = "รอการชำระเงิน";
          }
        } else {
          this.searched = true;
        }
      });
    } else {
      this.searched = true;
    }
  }
}
