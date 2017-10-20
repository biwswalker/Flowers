import { Product } from '../models/product';
export class ProductForm {

  public product: Product;
  public imageShowPath: any;
  public priceShow: number;

  constructor(){
    this.product = new Product();
    this.imageShowPath = this.getImageUrl();
    this.priceShow = 0;
  }

  getImageUrl() {
    return new Promise((resolve, reject) => {
      resolve('./assets/img/empty.png');
    });
  }
}
