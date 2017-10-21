import { Injectable } from '@angular/core';
import { Category } from "../models/category";

@Injectable()
export class CategoryService {

  categoryList: Category[] = [];
  constructor() {
    this.getDataList();
  }

  getCategoryList() {
    return this.categoryList;
  }

  getDataList() {
    this.categoryList = [];
    let cate: Category;
    cate = new Category();
    cate.categoryId = '1';
    cate.categoryName = 'ช่อดอกไม้สด';
    this.categoryList.push(cate);
    cate = new Category();
    cate.categoryId = '2';
    cate.categoryName = 'ช่อดอกไม้แห้ง';
    this.categoryList.push(cate);
    cate = new Category();
    cate.categoryId = '3';
    cate.categoryName = 'แจกันดอกไม้สด';
    this.categoryList.push(cate);
    cate = new Category();
    cate.categoryId = '4';
    cate.categoryName = 'แจกันดอกไม้แห้ง';
    this.categoryList.push(cate);
    cate = new Category();
    cate.categoryId = '5';
    cate.categoryName = 'กระเช้าดอกไม้';
    this.categoryList.push(cate);
    cate = new Category();
    cate.categoryId = '6';
    cate.categoryName = 'พวงหรีด';
    this.categoryList.push(cate);
  }

  getCategoryByKey(id: string): Category {
    let category = new Category();
    this.categoryList.forEach((categoryObj: Category) => {
      if (categoryObj.categoryId === id) {
        category = categoryObj
      }
    })
    return category;
  }

}
