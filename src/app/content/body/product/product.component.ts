import { Component, OnInit } from '@angular/core';
import { ProductService } from "../../../services/product.service";
import { Product } from "../../../models/product";
import { AlertService } from "../../../services/alert.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  // Model
  productList: Product[] = [];
  // Loading
  loading = false;

  constructor(
    private productService: ProductService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.productService.fetchProductListData()
      .then((products: Product[]) => {
        this.productList = [];
        this.productList.push(...products);
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this.alertService.error('เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ')
        setTimeout(() => {
          this.alertService.clear();
        }, 5000);
      });
  }
}
