import { CartService } from '../../../services/cart.service';
import { CartForm } from '../../../forms/cart';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

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

}
