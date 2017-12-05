import { UtilsService } from './utils.service';
import { Injectable } from '@angular/core';
import { ManageProductForm } from "../forms/manage-product";
import * as firebase from 'firebase';
import { Product } from "../models/product";
import { Promise } from 'firebase';
import { resolve, reject } from 'q';


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

  fetchProductListData(district: string, productCategory: string) {
    return firebase.database().ref('product').once('value')
      .then(list => {
        var promises = [];
        this.productList = [];
        list.forEach((element) => {
          promises.push(
            this.isProductLocal(district, element.val().storeId).then(returned => {
              if (returned) {
                if (productCategory) {
                  if (element.val().productCategory === productCategory) {
                    this.productList.push(element.val());
                  }
                } else {
                  this.productList.push(element.val());
                }
              }
            })
          );
        });
        return Promise.all(promises).then(() => {
          return this.productList;
        });
      })
      .catch(error => {
        console.log('Error ' + error);
        return [];
      });
  }

  fetchProductListDataAdmin(): Promise<Product[]> {
    return firebase.database().ref('product').once('value');
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

  isProductLocal(district, storeId): Promise<boolean> {
    return firebase.database().ref('store').once('value')
      .then(list => {
        let isLocal = false;
        list.forEach(data => {
          if (data.val().district === district && data.val().storeId === storeId && data.val().status === 'Y') {
            isLocal = true;
          }
        });
        return isLocal;
      })
  }
}
