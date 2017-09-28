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
  product: Product;

  // Image Path
  imagePath: any;

  id: string;
  private sub: any;


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService) { }

  ngOnInit() {
    this.loading = true;
    this.product = new Product();
    this.sub = this.route.params.subscribe(params => {
      this.id = params['pd'];
      this.productService.getProductByKey(this.id)
        .then((productObj: Product) => {
          if (productObj) {
            console.log(productObj);
            this.product = productObj;
            // this.imagePath = this.product.productImagePath;
            console.log(this.product.productDetail);
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
