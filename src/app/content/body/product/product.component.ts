import { ProductForm } from "./../../../forms/product";
import { Product } from "./../../../models/product";
import { Component, OnInit } from "@angular/core";
import { ProductService } from "../../../services/product.service";
import { AlertService } from "../../../services/alert.service";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"]
})
export class ProductComponent implements OnInit {
  // Model
  productFormList: ProductForm[] = [];

  // Loading
  loading = false;

  // ImageShowing
  imagePath: any;

  categoryMode = "";

  constructor(
    private productService: ProductService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    let setCategory = Promise.resolve((this.categoryMode = ""));
    Promise.all([this.loadProductList(this.categoryMode), setCategory]);
  }

  loadProductList(category: string): Promise<boolean> {
    this.loading = true;
    return Promise.resolve(
      this.productService
        .fetchProductListData(category)
        .then((products: Product[]) => {
          this.productFormList = [];
          let form: ProductForm;
          products.forEach((pd: Product) => {
            if (pd.status === "Y") {
              form = new ProductForm();
              form.product = pd;
              this.productFormList.push(form);
            }
          });
          this.loading = false;
          return false;
        })
        .catch(error => {
          this.loading = false;
          this.alertService.error("เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ");
          setTimeout(() => {
            this.alertService.clear();
          }, 5000);
          return false;
        })
    );
  }

  onChangeCategory(category: string) {
    Promise.all([this.loadProductList(category)]);
    this.categoryMode = category;
  }
}
