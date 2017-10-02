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
    this.cart = this.cartService.getCart();
  }

  onChangeQty(index: number, qty: number) {
    this.cartService.onChangeProductQty(index, qty);
    this.cart = new CartForm();
    this.cart = this.cartService.getCart();
  }
}
