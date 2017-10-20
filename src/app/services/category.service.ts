import { Injectable } from '@angular/core';
import { Category } from "../models/category";

@Injectable()
export class CategoryService {

  categoryList: Category[] = [];
  constructor() { }

  fetchCategoryListData() {
    return firebase.database().ref('category').once('value')
      .then(list => {
        this.categoryList = [];
        list.forEach(data => {
          this.categoryList.push(data.val());
        });
        return this.categoryList;
      })
      .catch(error => {
        console.log('Error ' + error);
        return [];
      });
  }

  getCategoryList() {
    this.getDataList();
    return this.categoryList;
  }

  getDataList() {
    this.categoryList = [];
    let cate: Category;
    cate = new Category();
    cate.categoryId = '1';
    cate.categoryName = 'ช่อดอกไม้';
    cate.categoryFlag = 'Y';
    this.categoryList.push(cate);
    cate = new Category();
    cate.categoryId = '2';
    cate.categoryName = 'แจกันดอกไม้';
    cate.categoryFlag = 'Y';
    this.categoryList.push(cate);
    cate = new Category();
    cate.categoryId = '3';
    cate.categoryName = 'กระเช้าดอกไม้';
    cate.categoryFlag = 'Y';
    this.categoryList.push(cate);
  }

  getCategoryByKey(id: string): Category {
    let cList: Category[] = [];
    let cate: Category;
    let c: Category = new Category();
    cate = new Category();
    cate.categoryId = '1';
    cate.categoryName = 'ช่อดอกไม้';
    cate.categoryFlag = 'Y';
    cList.push(cate);
    cate = new Category();
    cate.categoryId = '2';
    cate.categoryName = 'แจกันดอกไม้';
    cate.categoryFlag = 'Y';
    cList.push(cate);
    cate = new Category();
    cate.categoryId = '3';
    cate.categoryName = 'กระเช้าดอกไม้';
    cate.categoryFlag = 'Y';
    cList.push(cate);
    cList.forEach((category: Category) => {
      if (category.categoryId === id) {
        c = category
      }
    })
    return c;
  }

}
