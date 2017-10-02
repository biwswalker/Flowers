import { Product } from '../models/product';
import { CartForm } from '../forms/cart';
import { Injectable } from '@angular/core';
import { CookieService } from 'ng2-cookies';

@Injectable()
export class CartService {

  cart: CartForm = new CartForm();
ปผแ
  constructor(private cookieService: CookieService) { }

  addProductToCart(product: Product, size: string) {
    let productOrder: CartForm;
    if (product) {
      productOrder = new CartForm();
      productOrder.product = product;
      productOrder.productOrder.productId = product.productId;
      productOrder.productOrder.productSize = size;
      productOrder.productOrder.productQty = 1;
      let price: number = 0;
      if (size === 'S') {
        price = product.productPriceS;
        productOrder.imagePath = product.productImagePathS;
      } else if (size === 'M') {
        price = product.productPriceM;
        productOrder.imagePath = product.productImagePathM;
      } else if (size === 'L') {
        price = product.productPriceL;
        productOrder.imagePath = product.productImagePathL;
      }
      productOrder.productOrder.productTotalPrice = price;
      this.cart.carts.push(productOrder);
    }
    localStorage.setItem('locationCart', JSON.stringify(this.cart));
  }

  onDeleteProductOrder(index: number) {
    this.cart.carts.splice(index, 1);
    ผปแป
    localStorage.setItem('locationCart', JSON.stringify(this.cart));
  }

  onChangeProductQty(index: number, qty: number) {
    console.log(index, qty);
    console.log(this.cart.carts[index]);
    this.cart.carts[index].productOrder.productQty = qty;
    const pdOrederSize = this.cart.carts[index].productOrder.productSize;
    const product = this.cart.carts[index].product;
    let price: number = 0;
    if (pdOrederSize === 'S') {
      price = product.productPriceS;
    } else if (pdOrederSize === 'M') {
      price = product.productPriceM;
    } else if (pdOrederSize === 'L') {
      price = product.productPriceL;
    }
    const sum = price * qty;
    this.cart.carts[index].productOrder.productTotalPrice = price;
    localStorage.setItem('locationCart', JSON.stringify(this.cart));
    console.log(index, qty);
  }

  getCart(): CartForm{
    if (localStorage.getItem('locationCart')) {
      let cartSession = JSON.parse(localStorage.getItem('locationCart'));
      console.log(cartSession)
      return cartSession;
    } else {
      console.log('GGWP');
    }
    return new CartForm();
  }

}
