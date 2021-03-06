import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { LoadingService } from './../../../services/loading.service';
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

  // Product
  productForm: ProductForm;

  productId: string;
  private sub: any;
  pdQty: number;
  showingPrice: number;
  category: Category = new Category();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private loadingService: LoadingService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.pdQty = 1;
    window.scrollTo(0, 0);
    this.loadingService.loading(true);
    this.productForm = new ProductForm();
    Promise
      .all([this.getProductId(), this.getProduct(this.productId), this.resetFormGroup()])
      .then(success => {
        this.loadingService.loading(false);
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
            this.showingPrice = this.productForm.product.productPrice;
            this.category = this.categoryService.getCategoryByKey(this.productForm.product.productCategory);
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

  onChangeQty() {
    this.showingPrice = this.pdQty * this.productForm.product.productPrice;
  }
}
