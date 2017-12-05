import { Injectable } from '@angular/core';
import { Store } from '../models/store';
import * as firebase from 'firebase';

@Injectable()
export class StoreService {

  storeList: Store[] = [];

  constructor() {
  }

  setStore(store: Store) {
    for (let storeObj of this.storeList) {
      if (storeObj.status === 'Y' && storeObj.district === store.district) {
        return 'Duplicated';
      }
    }
    return firebase.database().ref('store/' + store.storeId).set(store);
  }

  fetchStoreListData() {
    return firebase.database().ref('store').once('value')
      .then(list => {
        this.storeList = [];
        list.forEach(data => {
          this.storeList.push(data.val());
        });
        console.log(this.storeList.length);
        return true;
      })
      .catch(error => {
        console.log('Error ' + error);
        return false;
      });
  }

  getStoreById(storeId: string){
    return firebase.database().ref('store/'+storeId).once('value').then((returned)=> {
      return returned.val();
    });
  }

  getStoreList(): Store[] {
    return this.storeList;
  }
}
