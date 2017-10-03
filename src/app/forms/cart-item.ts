import { Product } from '../models/product';
import { ProductOrder } from '../models/product-order';
export class CartItem {
  public productOrder: ProductOrder;
  public product: Product;
  public imagePath: any;

  constructor() {
    this.productOrder = new ProductOrder();
    this.product = new Product();
    this.imagePath = './assets/img/empty.png'
  }
}
