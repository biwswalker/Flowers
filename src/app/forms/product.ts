import { Product } from '../models/product';
export class ProductForm {

  public product: Product;
  public imageShowPath: any;
  public priceShow: number;

  constructor(){
    this.product = new Product();
    this.imageShowPath = './assets/img/empty.png';
    this.priceShow = 0;
  }
}
