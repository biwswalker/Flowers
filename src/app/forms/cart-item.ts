import { Product } from '../models/product';
import { ProductOrder } from '../models/product-order';
export class CartItem {
  public productOrder: ProductOrder;
  public product: Product;

  constructor() {
    this.productOrder = new ProductOrder();
    this.product = new Product();
  }
}
