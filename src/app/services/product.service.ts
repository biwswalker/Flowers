import { Injectable } from '@angular/core';
import { ManageProductForm } from "../forms/manage-product";
import * as firebase from 'firebase';
import { Product } from "../models/product";


@Injectable()
export class ProductService {

  productList: Product[] = [];

  constructor() { }

  addProduct(form: ManageProductForm, imageData: any) {
    let storageRef = firebase.storage().ref();
    const pk = Math.floor(Date.now() / 1000);
    const path = `images/${pk}.jpg`;
    const imageRef = storageRef.child(path);

    // Set data
    form.product.productId = String(pk);
    form.product.productImageName = path;
    form.product.createDatetime = String(pk);
    form.product.createUser = '1';
    form.product.status = 'Y';

    return imageRef.putString(imageData, firebase.storage.StringFormat.DATA_URL)
      .then((snapshot) => {
        form.product.productImagePath = snapshot.downloadURL;
        this.productList.push(form.product);
        return firebase.database().ref('product/' + form.product.productId).set(form.product);
      })
      .catch(error => {
        console.log('Error ' + error);
      });
  }

  fetchProductListData() {
    return firebase.database().ref('product').once('value')
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

  getProductList() {
    return this.productList.slice();
  }

  getProductByKey(productId: string) {
    return firebase.database().ref('product').child(productId).once('value')
      .then(product => {
        return product.val();
      })
  }

}