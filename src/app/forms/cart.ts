import { CartItem } from './cart-item';
import { Product } from '../models/product';
import { Address } from '../models/address';
import { ProductOrder } from '../models/product-order';
import { Order } from '../models/order';

export class CartForm {
  public order: Order;
  public address: Address;
  public cartItems: CartItem[];

  constructor() {
    this.order = new Order();
    this.address = new Address();
    this.cartItems = [];
  }
}
