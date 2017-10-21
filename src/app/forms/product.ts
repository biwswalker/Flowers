import { Product } from '../models/product';
export class ProductForm {

  public product: Product;

  constructor() {
    this.product = new Product();
    this.product.productImagePath = './assets/img/empty.png';
  }
}
