import { ProductForm } from './../../../forms/product';
import { Product } from './../../../models/product';
import { Component, OnInit } from '@angular/core';
import { ProductService } from "../../../services/product.service";
import { AlertService } from "../../../services/alert.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  // Model
  productFormList: ProductForm[] = [];

  // Loading
  loading = false;

  // ImageShowing
  imagePath: any;

  constructor(
    private productService: ProductService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.productService.fetchProductListData()
      .then((products: Product[]) => {
        this.productFormList = [];
        let form: ProductForm;
        products.forEach((pd: Product) => {
          form = new ProductForm();
          form.product = pd;
          if (pd.productSizeS) {
            form.imageShowPath = pd.productImagePathS;
            form.priceShow = pd.productPriceS;
          } else if (pd.productSizeM) {
            form.imageShowPath = pd.productImagePathM;
            form.priceShow = pd.productPriceM;
          } else if (pd.productSizeL) {
            form.imageShowPath = pd.productImagePathL;
            form.priceShow = pd.productPriceL;
          }
          this.productFormList.push(form);
        })
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
