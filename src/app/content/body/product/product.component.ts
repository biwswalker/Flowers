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

  categoryMode = '';

  constructor(
    private productService: ProductService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    let firstPromise = Promise.resolve(10);
    let secondPromise = Promise.resolve(5);
    let thirdPromise = Promise.resolve(20);

    Promise
      .all([firstPromise, secondPromise, thirdPromise])
      .then(values => {
        console.log(values);
      });

    window.scrollTo(0, 0);
    this.loading = true;
    this.categoryMode = '';
    this.productService.fetchProductListData(this.categoryMode)
      .then((products: Product[]) => {
        this.productFormList = [];
        let form: ProductForm;
        products.forEach((pd: Product) => {
          form = new ProductForm();
          form.product = pd;
          if (pd.productType === 'S') {
            if (pd.productSizeS) {
              form.imageShowPath = this.getImageUrl(pd.productImagePathS);
              form.priceShow = pd.productPriceS;
            } else if (pd.productSizeM) {
              form.imageShowPath = this.getImageUrl(pd.productImagePathM);
              form.priceShow = pd.productPriceM;
            } else if (pd.productSizeL) {
              form.imageShowPath = this.getImageUrl(pd.productImagePathL);
              form.priceShow = pd.productPriceL;
            }
            this.productFormList.push(form);
          }
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

  getImageUrl(url) {
    return new Promise((resolve, reject) => {
      resolve(url);
    });
  }

  onChangeCategory(category: string) {
    this.loading = true;
    this.categoryMode = category;
    this.productService.fetchProductListData(category)
      .then((products: Product[]) => {
        this.productFormList = [];
        let form: ProductForm;
        products.forEach((pd: Product) => {
          form = new ProductForm();
          form.product = pd;
          if (pd.productType === 'S') {
            if (pd.productSizeS) {
              form.imageShowPath = this.getImageUrl(pd.productImagePathS);
              form.priceShow = pd.productPriceS;
            } else if (pd.productSizeM) {
              form.imageShowPath = this.getImageUrl(pd.productImagePathM);
              form.priceShow = pd.productPriceM;
            } else if (pd.productSizeL) {
              form.imageShowPath = this.getImageUrl(pd.productImagePathL);
              form.priceShow = pd.productPriceL;
            }
            this.productFormList.push(form);
          }
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
