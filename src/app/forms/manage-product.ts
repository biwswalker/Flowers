import { Product } from '../models/product';
import { Category } from "../models/category";
export class ManageProductForm {

  public product: Product;
  public category: Category;

  constructor(){
    this.product = new Product();
    this.category = new Category();
  }
}
