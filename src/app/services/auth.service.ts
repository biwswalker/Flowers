import { Provider } from './../models/provider';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class AuthService {

  constructor() { }

  singinWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  }

  singinWithFacebook() {
    var provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  }

  signout() {
    return firebase.auth().signOut();
  }

  getActiveUser() {
    return firebase.auth().currentUser;
  }

}
