import { Product } from '../models/product';
export class ManageProductForm {

  public product: Product;

  constructor(){
    this.product = new Product();
  }
}
