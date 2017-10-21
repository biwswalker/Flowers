import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  // FormGroup
  group: FormGroup;

  // Loading
  loading = false;

  // Product
  productForm: ProductForm;

  productId: string;
  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loading = true;
    this.productForm = new ProductForm();
    Promise
      .all([this.getProductId(), this.getProduct(this.productId), this.resetFormGroup()])
      .then(success => {
        this.loading = false;
      });
  }

  resetFormGroup() {
    this.group = new FormGroup({
      'productQty': new FormControl(1, [Validators.required, Validators.pattern('[0-9]+')])
    });
  }

  getProductId() {
    return Promise.resolve(
      this.sub = this.route.params.subscribe(params => {
        this.productId = params['pd'];
      })
    );
  }

  getProduct(productId: string) {
    return Promise.resolve(
      this.productService.getProductByKey(productId)
        .then((productObj: Product) => {
          if (productObj) {
            this.productForm.product = productObj;
          }
        })
        .catch(error => {
          console.log(error.message)
        })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onAddToCart() {
    if (this.group.valid) {
      this.cartService.addItem(this.productForm.product, this.group.value.productQty);
      this.router.navigateByUrl('/cart');
    }
  }

  onChangeSize() {
  }
}
