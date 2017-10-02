import { Product } from '../models/product';
import { Address } from '../models/address';
import { ProductOrder } from '../models/product-order';
import { Order } from '../models/order';
export class CartForm {
  public order: Order;
  public productOrder: ProductOrder;
  public product: Product;
  public address: Address;
  public carts: CartForm[];
  public imagePath: any;

  constructor() {
    this.order = new Order();
    this.productOrder = new ProductOrder();
    this.product = new Product();
    this.address = new Address();
    this.carts = [];
    this.imagePath = './assets/img/empty.png'
  }
}
