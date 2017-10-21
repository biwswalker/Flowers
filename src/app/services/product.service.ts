import { UtilsService } from './utils.service';
import { Injectable } from '@angular/core';
import { ManageProductForm } from "../forms/manage-product";
import * as firebase from 'firebase';
import { Product } from "../models/product";


@Injectable()
export class ProductService {

  productList: Product[] = [];

  constructor(private utilService: UtilsService) { }

  addProduct(form: ManageProductForm) {
    form.product.productId = this.utilService.generateUUID();
    form.product.createDatetime = String(Date.now());
    form.product.createUser = 'biwswalker';
    return firebase.database().ref('product/' + form.product.productId).set(form.product);
  }

  updateProduct(form: ManageProductForm) {
    return firebase.database().ref('product/' + form.product.productId).set(form.product);
  }

  fetchProductListData(productCategory: string) {
    return firebase.database().ref('product').once('value')
      .then(list => {
        this.productList = [];
        list.forEach(data => {
          const pd: Product = data.val();
          if (productCategory) {
            if (pd.productCategory === productCategory) {
              this.productList.push(pd);
            }
          } else {
            this.productList.push(pd);
          }
        });
        return this.productList;
      })
      .catch(error => {
        console.log('Error ' + error);
        return [];
      });
  }

  getProductByKey(productId: string) {
    return firebase.database().ref('product').child(productId).once('value')
      .then(product => {
        return product.val();
      })
  }

  fetchLtdProductData() {
    return firebase.database().ref('product').limitToLast(12).once('value')
      .then(list => {
        this.productList = [];
        list.forEach(data => {
          this.productList.push(data.val());
        });
        return this.productList;
      })
      .catch(error => {
        console.log('Error ' + error);
        return [];
      });
  }
}
