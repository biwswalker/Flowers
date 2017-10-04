import { Router } from '@angular/router';
import { CartForm } from '../../../forms/cart';
import { CartService } from '../../../services/cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // Loading
  loading = false;

  // Form
  cart: CartForm;

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cart = new CartForm();
    this.cart = this.cartService.retrieve();
  }

  onContinue(){
    this.router.navigateByUrl('/confirmation');
  }
}
