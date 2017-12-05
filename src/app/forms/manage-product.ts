import { Store } from '../models/store';
import { Product } from '../models/product';
import { Category } from "../models/category";
export class ManageProductForm {

  public product: Product;
  public category: Category;
  public store: Store;

  constructor(){
    this.product = new Product();
    this.category = new Category();
    this.store = new Store();
  }
}
