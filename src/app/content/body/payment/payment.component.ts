import { LoadingService } from './../../../services/loading.service';
import { OrderService } from "./../../../services/order.service";
import { PaymentService } from "./../../../services/payment.service";
import { Payment } from "./../../../models/payment";
import { UtilsService } from "./../../../services/utils.service";
import { AlertService } from "./../../../services/alert.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.css"]
})
export class PaymentComponent implements OnInit, OnDestroy {
  // Payment
  payment: Payment = new Payment();

  // FormGroup
  group: FormGroup;

  // Image
  img: any;

  constructor(
    private alertService: AlertService,
    private utilsService: UtilsService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.payment = new Payment();
    this.resetFormGroup();
  }

  resetFormGroup() {
    this.group = new FormGroup({
      orderId: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10)
      ]),
      firstname: new FormControl(null, Validators.required),
      lastname: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      amount: new FormControl(null, [
        Validators.required,
        Validators.pattern("[0-9]+")
      ]),
      bank: new FormControl(null, Validators.required),
      transDate: new FormControl(null, Validators.required),
      transTime: new FormControl(null, Validators.required),
      file: new FormControl(null)
    });
  }

  onUploadImage(event) {
    this.loadingService.loading(true);
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const file: File = files[0];
      const name = Date.now();
      const imageName = `images/slip/${name}.${file.type}`;
      if (file.size < 5000000) {
        this.payment.imageName = imageName;
        Promise.all([
          Promise.resolve(
            this.utilsService.uploadImage(file, imageName).then(data => {
              this.img = data;
              this.payment.imagePath = data;
            })
          )
        ]).then(success => {
          this.loadingService.loading(false);
        });
      } else {
        this.loadingService.loading(false);
        this.alertService.warn("ขนาดไฟล์ไม่เกิน 5 mb");
        setTimeout(() => {
          this.alertService.clear();
        }, 5000);
        window.scrollTo(0, 0);
      }
    } else {
      this.loadingService.loading(false);
      this.alertService.error("เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ");
      setTimeout(() => {
        this.alertService.clear();
      }, 5000);
      window.scrollTo(0, 0);
    }
  }

  ngOnDestroy() {
    this.group.reset();
    this.img = "";
  }

  sentPayment() {
    window.scrollTo(0, 0);
    if (this.group.valid) {
      if (!this.payment.imagePath) {
        this.alertService.warn("กรุณาอัพโหลดไฟล์รูปภาพ");
        setTimeout(() => {
          this.alertService.clear();
        }, 5000);
        return;
      }
      this.loadingService.loading(true);
      const orderId: string = this.group.value.orderId;
      this.payment.orderId = orderId.toUpperCase();
      this.payment.firstname = this.group.value.firstname;
      this.payment.lastname = this.group.value.lastname;
      this.payment.email = this.group.value.email;
      this.payment.amount = this.group.value.amount;
      this.payment.bank = this.group.value.bank;
      this.payment.transDate = this.group.value.transDate;
      this.payment.transTime = this.group.value.transTime;

      Promise.resolve(
        this.orderService
          .findAlreadyExistOrder(this.payment.orderId)
          .then(snapshot => {
            if (snapshot.val()) {
              if (
                snapshot.val().order.paymentStatus === "N" ||
                snapshot.val().order.paymentStatus === "I"
              ) {
                Promise.all([
                  this.paymentService.addPaymentConfermation(this.payment),
                  this.orderService.changePaymentStatus(
                    this.payment.orderId,
                    "W"
                  )
                ])
                  .then(snapshot => {
                    this.loadingService.loading(false);
                    this.group.reset();
                    this.img = "";
                    this.alertService.success(
                      "แจ้งการชำระเงินเรียบร้อย ติดตามสินค้าได้ที่เมนูติดตามสถานะ"
                    );
                  })
                  .catch(error => {
                    this.loadingService.loading(false);
                    this.ngOnDestroy();
                    this.alertService.error(
                      "เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ"
                    );
                    setTimeout(() => {
                      this.alertService.clear();
                    }, 15000);
                  });
              } else {
                this.loadingService.loading(false);
                this.alertService.warn(
                  "Order ID ที่ระบุได้ทำการชำระเงินเรียบร้อยแล้ว"
                );
                setTimeout(() => {
                  this.alertService.clear();
                }, 20000);
              }
            } else {
              this.loadingService.loading(false);
              this.alertService.warn(
                "ไม่พบ Order ID ที่ระบุ โปรตรวจสอบใหม่อีกครั้ง"
              );
              setTimeout(() => {
                this.alertService.clear();
              }, 15000);
            }
          })
      );
    }
  }
}
