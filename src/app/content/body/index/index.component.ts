import { Product } from "../../../models/product";
import { ProductForm } from "../../../forms/product";
import { ProductService } from "../../../services/product.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.css"]
})
export class IndexComponent implements OnInit {
  loading = false;

  // Product List
  productFormList: ProductForm[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    Promise.all([this.loadProduct()]);
  }

  loadProduct(): Promise<boolean> {
    this.loading = true;
    return Promise.resolve(
      this.productService
        .fetchLtdProductData()
        .then((products: Product[]) => {
          this.productFormList = [];
          let form: ProductForm;
          products.forEach((pd: Product) => {
            form = new ProductForm();
            form.product = pd;
            if(pd.productCategory !== '6'){
            this.productFormList.push(form);
            }
          });
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        })
    );
  }
}
