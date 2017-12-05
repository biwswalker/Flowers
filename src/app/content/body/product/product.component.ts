import { ActivatedRoute } from '@angular/router';
import { LoadingService } from './../../../services/loading.service';
import { ProductForm } from "./../../../forms/product";
import { Product } from "./../../../models/product";
import { Component, OnInit } from "@angular/core";
import { ProductService } from "../../../services/product.service";
import { AlertService } from "../../../services/alert.service";
import { CartService } from '../../../services/cart.service';

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"]
})
export class ProductComponent implements OnInit {
  // Model
  productFormList: ProductForm[] = [];

  // ImageShowing
  imagePath: any;

  district = '';
  categoryMode = "";
  productSize = "";
  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private cartService: CartService
  ) {
    let cartF = this.cartService.retrieve();
    this.district = cartF.address.district;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    Promise.all([this.getCategoryId(), this.loadProductList(this.categoryMode, "")]);
  }

  getCategoryId() {
    Promise.resolve(
      this.sub = this.route.params.subscribe(params => {
        if (params['cid']) {
          this.categoryMode = params['cid'];
        } else {
          this.categoryMode = '';
        }
      })
    )
  }

  loadProductList(category: string, size: string): Promise<boolean> {
    this.loadingService.loading(true);
    return Promise.resolve(
      this.productService
        .fetchProductListData(this.district, category)
        .then((products: Product[]) => {
          this.productFormList = [];
          let form: ProductForm;
          products.forEach((pd: Product) => {
            if (pd.status === "Y") {
              form = new ProductForm();
              form.product = pd;
              if (size) {
                if (form.product.productSize === size) {
                  this.productFormList.push(form);
                }
              } else {
                if (!category) {
                  if (form.product.productCategory !== '6') {
                    this.productFormList.push(form);
                  }
                } else {
                  this.productFormList.push(form);
                }
              }
            }
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
          return false;
        })
    );
  }

  onChangeCategory(category: string) {
    Promise.all([this.loadProductList(category, "")]);
    this.categoryMode = category;
    this.productSize = "";
  }

  onChangeSize() {
    Promise.all([this.loadProductList(this.categoryMode, this.productSize)]);
  }

  onChangeDistrict() {
    this.categoryMode = '';
    Promise.all([this.cartService.changeDistrict(this.district), this.loadProductList('', '')]);
  }
}
