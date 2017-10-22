import { ProductOrder } from '../models/product-order';
import { Address } from '../models/address';
import { Order } from '../models/order';

export class CartOrderForm {
  public order: Order;
  public address: Address;
  public products: ProductOrder[];
  public status: string;
  public orderDate: string;

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
