import { Product } from '../../../models/product';
import { ProductForm } from '../../../forms/product';
import { ProductService } from '../../../services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  loading = false;

  // Product List
  productFormList: ProductForm[] = [];

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loading = true;
    this.productService.fetchLtdProductData()
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
      });
  }

}
