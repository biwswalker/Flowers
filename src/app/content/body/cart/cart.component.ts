import { CartItem } from '../../../forms/cart-item';
import { CartForm } from '../../../forms/cart';
import { CartService } from '../../../services/cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  // Loading
  loading = false;

  // Form
  cart: CartForm;

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.cart = new CartForm();
    this.cart = this.cartService.retrieve();
  }

  onChangeQty(pid: string, qty: number) {
    this.loading = true;
    let item = this.cart.cartItems.find((cartItem) => cartItem.product.productId === pid);
    if(item){
      item = this.cartService.updateCart(item, qty, '');
      this.cart.cartItems = this.cart.cartItems.filter((cartItem) => cartItem.productOrder.productQty > 0);
      this.cartService.calculatePrice(this.cart);
      this.cartService.save(this.cart);
    }
    this.loading = false;
  }

  onDeleteItem(pid: string){
    this.cart.cartItems = this.cart.cartItems.filter((cartItem) => cartItem.product.productId !== pid);
    this.cartService.save(this.cart);
  }
}
