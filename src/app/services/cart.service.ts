import { CartItem } from '../forms/cart-item';
import { StorageService } from './local-storage.service';
import { Product } from '../models/product';
import { CartForm } from '../forms/cart';
import { Injectable } from '@angular/core';

const CART_KEY = "cart";

@Injectable()
export class CartService {

  private storage: Storage;

  constructor(
    private storageService: StorageService) {
    this.storage = this.storageService.get();
  }

  addItem(product: Product, size: string): void {
    const cart = this.retrieve();
    let item = cart.cartItems.find((p) => p.product.productId === product.productId);
    if (!item) {
      item = new CartItem();
      item.product = product
      item.productOrder.productId = product.productId;
      item.productOrder.productSize = size;
      item.productOrder.productQty = 1;
      let price: number = 0;
      if (size === 'S') {
        price = product.productPriceS;
        item.imagePath = product.productImagePathS;
      } else if (size === 'M') {
        price = product.productPriceM;
        item.imagePath = product.productImagePathM;
      } else if (size === 'L') {
        price = product.productPriceL;
        item.imagePath = product.productImagePathL;
      }
      item.productOrder.productTotalPrice = price;
      cart.cartItems.push(item);
    } else {
      item = this.updateCart(item, 1, '+');
    }
    cart.cartItems = cart.cartItems.filter((cartItem) => cartItem.productOrder.productQty > 0);
    this.calculatePrice(cart);
    this.save(cart);
  }

  updateCart(item: CartItem, qty: number, status: string) {
    if (status === '+') {
      item.productOrder.productQty += qty;
    } else {
      item.productOrder.productQty = qty;
    }
    let price: number = 0;
    if (item.productOrder.productSize === 'S') {
      price = item.product.productPriceS * item.productOrder.productQty;
    } else if (item.productOrder.productSize === 'M') {
      price = item.product.productPriceM * item.productOrder.productQty;
    } else if (item.productOrder.productSize === 'L') {
      price = item.product.productPriceL * item.productOrder.productQty;
    }
    item.productOrder.productTotalPrice = price;
    return item;
  }

  save(cart: CartForm): void {
    this.storage.setItem(CART_KEY, JSON.stringify(cart));
  }

  public empty(): void {
    const newCart = new CartForm();
    this.save(newCart);
  }

  calculatePrice(cart: CartForm){
    let total: number = 0;
    cart.cartItems.forEach((item: CartItem) => {
      total += item.productOrder.productTotalPrice;
    })
    cart.order.totalPrice = total;
    return cart;
  }

  retrieve() {
    let cart = new CartForm();
    const storedCart = this.storage.getItem(CART_KEY);
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }
    return cart;
  }


}
