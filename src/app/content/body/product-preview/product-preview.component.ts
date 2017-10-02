import { ProductForm } from '../../../forms/product';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.css']
})
export class ProductPreviewComponent implements OnInit, OnDestroy {

  // Loading
  loading = false;

  // Product
  productForm: ProductForm;

  // Size
  size: string;

  id: string;
  private sub: any;


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService) { }

  ngOnInit() {
    this.loading = true;
    this.productForm = new ProductForm();
    this.sub = this.route.params.subscribe(params => {
      this.id = params['pd'];
      this.productService.getProductByKey(this.id)
        .then((productObj: Product) => {
          if (productObj) {
            this.productForm.product = productObj;
            if (productObj.productSizeS) {
              this.productForm.imageShowPath = productObj.productImagePathS;
              this.productForm.priceShow = productObj.productPriceS;
              this.size = 'S'
            } else if (productObj.productSizeM) {
              this.productForm.imageShowPath = productObj.productImagePathM;
              this.productForm.priceShow = productObj.productPriceM;
              this.size = 'M'
            } else if (productObj.productSizeL) {
              this.productForm.imageShowPath = productObj.productImagePathL;
              this.productForm.priceShow = productObj.productPriceL;
              this.size = 'L'
            }
            this.loading = false;
          }
        })
        .catch(error => {
          console.log(error.message)
        });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
