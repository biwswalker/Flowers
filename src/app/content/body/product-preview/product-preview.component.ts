import { CartService } from '../../../services/cart.service';
import { ProductForm } from '../../../forms/product';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
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
    private productService: ProductService,
    private router: Router,
    private cartService: CartService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loading = true;
    this.productForm = new ProductForm();
    this.sub = this.route.params.subscribe(params => {
      this.id = params['pd'];
      this.productService.getProductByKey(this.id)
        .then((productObj: Product) => {
          if (productObj) {
            this.productForm.product = productObj;
            if (productObj.productSizeS) {
              this.productForm.imageShowPath = this.getImageUrl(productObj.productImagePathS);
              this.productForm.priceShow = productObj.productPriceS;
              this.size = 'S';
            } else if (productObj.productSizeM) {
              this.productForm.imageShowPath = this.getImageUrl(productObj.productImagePathM);
              this.productForm.priceShow = productObj.productPriceM;
              this.size = 'M';
            } else if (productObj.productSizeL) {
              this.productForm.imageShowPath = this.getImageUrl(productObj.productImagePathL);
              this.productForm.priceShow = productObj.productPriceL;
              this.size = 'L';
            }
            this.loading = false;
          }
        })
        .catch(error => {
          console.log(error.message)
        });
    });
  }

  getImageUrl(url) {
    return new Promise((resolve, reject) => {
      resolve(url);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onAddToCart() {
    this.cartService.addItem(this.productForm.product, this.size);
    this.router.navigateByUrl('/cart');
  }

  onChangeSize() {
    if (this.size === 'S') {
      this.productForm.imageShowPath = this.getImageUrl(this.productForm.product.productImagePathS);
      this.productForm.priceShow = this.productForm.product.productPriceS;
      this.size = 'S';
    } else if (this.size === 'M') {
      this.productForm.imageShowPath = this.getImageUrl(this.productForm.product.productImagePathM);
      this.productForm.priceShow = this.productForm.product.productPriceM;
      this.size = 'M';
    } else if (this.size === 'L') {
      this.productForm.imageShowPath = this.getImageUrl(this.productForm.product.productImagePathL);
      this.productForm.priceShow = this.productForm.product.productPriceL;
      this.size = 'L';
    }
  }
}
