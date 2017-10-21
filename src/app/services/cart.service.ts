import { UtilsService } from './utils.service';
import { ProductOrder } from './../models/product-order';
import { Order } from './../models/order';
import { Address } from './../models/address';
import { CartItem } from '../forms/cart-item';
import { StorageService } from './local-storage.service';
import { Product } from '../models/product';
import { CartForm } from '../forms/cart';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

const CART_KEY = "cart";

@Injectable()
export class CartService {

  private storage: Storage;

  constructor(
    private storageService: StorageService,
    private utilsService: UtilsService) {
    this.storage = this.storageService.get();
  }

  updateOrder(order: Order, address: Address) {
    const cart = this.retrieve();
    if (cart) {
      if (order) {
        cart.order = order;
      }
      if (address) {
        cart.address = address
      }
    } else {
    }
    this.save(cart);
  }

  addItem(product: Product, qty: number): void {
    const cart = this.retrieve();
    let item = cart.cartItems.find((p) => p.product.productId === product.productId);
    if (!item) {
      item = new CartItem();
      item.product = product
      item.productOrder.productId = product.productId;
      item.productOrder.productSize = 'N';
      item.productOrder.productQty = qty;
      item.productOrder.productTotalPrice = product.productPrice * qty;
      cart.cartItems.push(item);
    } else {
      item = this.updateCart(item, qty, '+');
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
    item.productOrder.productTotalPrice = item.product.productPrice * item.productOrder.productQty;
    return item;
  }

  save(cart: CartForm): void {
    this.storage.setItem(CART_KEY, JSON.stringify(cart));
  }

  public empty(): void {
    const newCart = new CartForm();
    this.save(newCart);
  }

  calculatePrice(cart: CartForm) {
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

  createOrder(cart: CartForm) {
    if (cart) {
      const orderId = this.utilsService.generateOrderID(10);
      const nowdate = new Date();
      cart.order.orderId = orderId;
      cart.order.orderDate = nowdate;
      cart.order.createDate = nowdate;
      cart.order.createUser = cart.order.firstname;
      cart.order.paymentStatus = 'N';
      cart.order.orderStatus = 'W';
      let products: ProductOrder[] = [];
      cart.cartItems.forEach(pd => {
        products.push(pd.productOrder);
      });
      let cartOrder: CartOrder = new CartOrder(cart.order, cart.address, products);
      return firebase.database().ref('order/' + orderId).set(cartOrder)
        .then((snap) => {
          this.empty();
          return orderId;
        }).catch(error => {
          console.log('Error : '+error.message)
        });
    }
  }
}


export class CartOrder {
  public order: Order;
  public address: Address;
  public products: ProductOrder[];

  constructor(
    order: Order,
    address: Address,
    products: ProductOrder[]
  ) {
    this.order = order;
    this.address = address;
    this.products = products;
  }
}
