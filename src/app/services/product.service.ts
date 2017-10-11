import { Injectable } from '@angular/core';
import { ManageProductForm } from "../forms/manage-product";
import * as firebase from 'firebase';
import { Product } from "../models/product";


@Injectable()
export class ProductService {

  productList: Product[] = [];

  constructor() { }

  addProductImage(imageData: File, imageName: string) {
    return firebase.storage().ref().child(imageName).put(imageData)
      .then((url) => {
        return url.downloadURL;
      })
      .catch(error => {
        console.log('Error ' + error);
      });
  }

  deleteProductImage(imageName) {
    firebase.storage().ref().child(imageName).delete().catch(function (error) {
      console.log('error ' + error.message)
    });
  }

  addProduct(form: ManageProductForm) {
    form.product.productId = String(Date.now());
    form.product.createDatetime = String(form.product.productId);
    form.product.createUser = 'biwswalker';
    this.productList.push(form.product);
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

  getProductList() {
    return this.productList.slice();
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
          const pd: Product = data.val();
          if (pd.productType == 'S') {
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
}
