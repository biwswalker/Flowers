import { NgModule } from '@angular/core';
import * as firebase from 'firebase';

export const firebaseConfig = {
  apiKey: "AIzaSyCqQL1iDXg7qsrtdGsNl_1ggu9Y7wi5ScQ",
  authDomain: "flowers-flow.firebaseapp.com",
  databaseURL: "https://flowers-flow.firebaseio.com",
  projectId: "flowers-flow",
  storageBucket: "",
  messagingSenderId: "1064581697915"
};

@NgModule()
export class FirebaseConfigModule {
  constructor() {
    firebase.initializeApp(firebaseConfig);
  }
}
